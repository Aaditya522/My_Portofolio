import GithubActivityBranch from "../models/GithubActivityBranch.js";
import GithubCommit from "../models/GithubCommit.js";
import GithubCommitFile from "../models/GithubCommitFile.js";
import GithubActivitySync from "../models/GithubActivitySync.js";

/**
 * Intelligent branch matching helper.
 * Matches any branch containing the target search term/prefix in its name.
 */
export const isMatchingBranch = (branchName, prefix = "aaditya") => {
  if (!branchName || typeof branchName !== "string") return false;
  const p = prefix.trim().toLowerCase();
  const name = branchName.trim().toLowerCase();

  return name.includes(p);
};

/**
 * Checks if a commit belongs to the configured author identity.
 */
export const isConfiguredAuthor = (commitData, targetUsername = "Aaditya522") => {
  if (!commitData) return false;

  const target = targetUsername.toLowerCase().trim();

  // 1. GitHub author login
  const ghLogin = commitData.author?.login?.toLowerCase();
  if (ghLogin && ghLogin === target) {
    return true;
  }

  // 2. Commit author name / email (fallback for Git identity)
  const commitAuthorName = commitData.commit?.author?.name?.toLowerCase() || "";
  const commitAuthorEmail = commitData.commit?.author?.email?.toLowerCase() || "";

  if (commitAuthorName && (commitAuthorName.includes(target) || target.includes(commitAuthorName))) {
    return true;
  }

  if (commitAuthorEmail && commitAuthorEmail.includes(target)) {
    return true;
  }

  // Check generic "aaditya" name match if username contains aaditya
  if (target.includes("aaditya")) {
    if (commitAuthorName.includes("aaditya") || (ghLogin && ghLogin.includes("aaditya"))) {
      return true;
    }
  }

  return false;
};

/**
 * Performs smart incremental sync of GitHub activity into local database.
 * Re-uses unchanged branches to optimize sync time and purge deleted branches.
 */
export const syncGithubActivityForWorkspace = async (workspaceId, customConfig = {}) => {
  const token = process.env.GITHUB_TOKEN || customConfig.token || "";
  const username = customConfig.username || process.env.GITHUB_USERNAME || "Aaditya522";
  const owner = customConfig.owner || process.env.GITHUB_OWNER || "bhawanbaweja";
  const repo = customConfig.repo || process.env.GITHUB_REPOSITORY || "kits-staging-new";
  const branchPrefix = customConfig.prefix || process.env.GITHUB_BRANCH_PREFIX || "aaditya";

  // Update sync status to IN_PROGRESS
  await GithubActivitySync.findOneAndUpdate(
    { workspaceId },
    {
      workspaceId,
      lastSyncStatus: "IN_PROGRESS",
      errorMessage: null,
      configuredUsername: username,
      configuredPrefix: branchPrefix,
      configuredRepo: `${owner}/${repo}`,
    },
    { upsert: true, new: true }
  );

  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "MERN-Portfolio-App",
  };
  if (token && token.trim() !== "") {
    headers.Authorization = token.startsWith("Bearer ") || token.startsWith("token ") ? token : `Bearer ${token}`;
  }

  const fetchWithHeaders = async (url) => {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const errorText = await res.text();
      let errorJson = {};
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {}
      const message = errorJson.message || res.statusText || `HTTP ${res.status}`;
      throw new Error(`GitHub API Error (${res.status}): ${message}`);
    }
    return res.json();
  };

  try {
    // 1. Fetch Pull Requests with pagination to correlate branches with PR metadata
    let pullRequests = [];
    try {
      let page = 1;
      let hasMore = true;
      while (hasMore && page <= 10) {
        const prsUrl = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=100&page=${page}`;
        const pagePrs = await fetchWithHeaders(prsUrl);
        if (Array.isArray(pagePrs) && pagePrs.length > 0) {
          pullRequests = pullRequests.concat(pagePrs);
          if (pagePrs.length < 100) hasMore = false;
          page++;
        } else {
          hasMore = false;
        }
      }
    } catch (prErr) {
      console.warn("Could not fetch PRs from GitHub API:", prErr.message);
    }

    // Map PRs by head ref (source branch)
    const prMap = {};
    if (Array.isArray(pullRequests)) {
      for (const pr of pullRequests) {
        if (pr.head && pr.head.ref) {
          prMap[pr.head.ref] = pr;
        }
      }
    }

    // 2. Fetch all repository branches with pagination loop
    let allBranches = [];
    try {
      let page = 1;
      let hasMore = true;
      while (hasMore && page <= 15) {
        const branchesUrl = `https://api.github.com/repos/${owner}/${repo}/branches?per_page=100&page=${page}`;
        const pageBranches = await fetchWithHeaders(branchesUrl);
        if (Array.isArray(pageBranches) && pageBranches.length > 0) {
          allBranches = allBranches.concat(pageBranches);
          if (pageBranches.length < 100) hasMore = false;
          page++;
        } else {
          hasMore = false;
        }
      }
    } catch (branchErr) {
      if (branchErr.message && branchErr.message.includes("404")) {
        throw new Error(
          `Repository '${owner}/${repo}' was not found or your GitHub token lacks access permission to this repository. Please verify GITHUB_OWNER, GITHUB_REPOSITORY, and token permissions.`
        );
      }
      throw branchErr;
    }

    if (!Array.isArray(allBranches)) {
      throw new Error("Invalid GitHub API response for branches list");
    }

    // Filter branches using the matching rule
    const matchingBranches = allBranches.filter((b) => isMatchingBranch(b.name, branchPrefix));
    const matchingBranchNames = new Set(matchingBranches.map((b) => b.name));

    // Fetch existing synced branches from MongoDB
    const existingBranchDocs = await GithubActivityBranch.find({ workspaceId, repo });
    const existingBranchMap = {};
    existingBranchDocs.forEach((doc) => {
      existingBranchMap[doc.branchName] = doc;
    });

    // Clean up deleted branches that no longer exist on GitHub
    const deletedBranchNames = existingBranchDocs
      .map((d) => d.branchName)
      .filter((name) => !matchingBranchNames.has(name));

    if (deletedBranchNames.length > 0) {
      await GithubActivityBranch.deleteMany({ workspaceId, repo, branchName: { $in: deletedBranchNames } });
      await GithubCommit.updateMany(
        { workspaceId, repo },
        { $pull: { branches: { $in: deletedBranchNames } } }
      );
    }

    let totalSyncedCommits = 0;
    let syncedBranchesCount = 0;
    let newBranchesCount = 0;
    let updatedBranchesCount = 0;

    // 3. Process each matching branch with Smart Incremental Check
    for (const b of matchingBranches) {
      const branchName = b.name;
      const headSha = b.commit?.sha || null;
      const existingDoc = existingBranchMap[branchName];

      syncedBranchesCount++;

      // Check PR metadata for this branch
      const assocPr = prMap[branchName] || null;
      let branchStatus = "ACTIVE";
      let targetBranch = null;
      let prNumber = null;
      let prTitle = null;
      let prUrl = null;
      let prStatus = null;
      let mergedBy = null;
      let mergedAt = null;

      if (assocPr) {
        targetBranch = assocPr.base?.ref || null;
        prNumber = assocPr.number;
        prTitle = assocPr.title;
        prUrl = assocPr.html_url;
        prStatus = assocPr.state?.toUpperCase();

        if (assocPr.merged_at || assocPr.merged === true) {
          branchStatus = "MERGED";
          mergedAt = assocPr.merged_at ? new Date(assocPr.merged_at) : new Date();
          mergedBy = assocPr.merged_by?.login || null;
        } else if (assocPr.state === "closed") {
          branchStatus = "CLOSED";
        } else {
          branchStatus = "ACTIVE";
        }
      }

      // SMART INCREMENTAL CHECK:
      // If branch already synced and head commit SHA has not changed, keep current branch & commits without re-fetching!
      if (existingDoc && headSha && existingDoc.headCommitSha === headSha && existingDoc.commitCount > 0) {
        totalSyncedCommits += existingDoc.commitCount || 0;
        // Update PR info or status if PR state changed
        existingDoc.status = branchStatus;
        existingDoc.targetBranch = targetBranch;
        existingDoc.prNumber = prNumber;
        existingDoc.prTitle = prTitle;
        existingDoc.prUrl = prUrl;
        existingDoc.prStatus = prStatus;
        existingDoc.mergedBy = mergedBy;
        existingDoc.mergedAt = mergedAt;
        existingDoc.lastSyncedAt = new Date();
        await existingDoc.save();
        continue;
      }

      if (!existingDoc) {
        newBranchesCount++;
      } else {
        updatedBranchesCount++;
      }

      // Branch is NEW or received NEW COMMITS: Fetch branch commit history
      let branchCommits = [];
      try {
        const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branchName)}&per_page=100`;
        branchCommits = await fetchWithHeaders(commitsUrl);
      } catch (cErr) {
        console.warn(`Could not fetch commits for branch ${branchName}:`, cErr.message);
      }

      if (!Array.isArray(branchCommits)) {
        branchCommits = [];
      }

      // Filter commits by author
      const authorCommits = branchCommits.filter((c) => isConfiguredAuthor(c, username));

      let branchAdditions = 0;
      let branchDeletions = 0;
      let branchFilesCount = 0;
      let latestCommitDate = null;
      let firstCommitDate = assocPr?.created_at ? new Date(assocPr.created_at) : null;

      for (const commitObj of authorCommits) {
        const sha = commitObj.sha;
        const shortSha = sha.substring(0, 7);
        const commitMsg = commitObj.commit?.message || "No commit message";
        const authorName = commitObj.commit?.author?.name || commitObj.author?.login || "Aaditya";
        const authorLogin = commitObj.author?.login || username;
        const authorEmail = commitObj.commit?.author?.email || null;
        const authorAvatarUrl = commitObj.author?.avatar_url || null;
        const commitDate = commitObj.commit?.author?.date ? new Date(commitObj.commit.author.date) : new Date();
        const htmlUrl = commitObj.html_url || `https://github.com/${owner}/${repo}/commit/${sha}`;

        if (!latestCommitDate || commitDate > latestCommitDate) {
          latestCommitDate = commitDate;
        }
        if (!firstCommitDate || commitDate < firstCommitDate) {
          firstCommitDate = commitDate;
        }

        // Check if commit details already exist in local DB
        let existingCommit = await GithubCommit.findOne({ workspaceId, repo, sha });

        if (existingCommit) {
          if (!existingCommit.branches.includes(branchName)) {
            existingCommit.branches.push(branchName);
            await existingCommit.save();
          }
          branchAdditions += existingCommit.additions || 0;
          branchDeletions += existingCommit.deletions || 0;
          branchFilesCount += existingCommit.filesChangedCount || 0;
          totalSyncedCommits++;
        } else {
          // Fetch detailed commit diff from GitHub
          let commitDetail = null;
          try {
            const singleCommitUrl = `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`;
            commitDetail = await fetchWithHeaders(singleCommitUrl);
          } catch (detailErr) {
            console.warn(`Could not fetch detail for commit ${sha}:`, detailErr.message);
          }

          const additions = commitDetail?.stats?.additions || 0;
          const deletions = commitDetail?.stats?.deletions || 0;
          const filesChangedCount = commitDetail?.files?.length || 0;

          // Save GithubCommit
          existingCommit = await GithubCommit.create({
            workspaceId,
            repo,
            sha,
            shortSha,
            message: commitMsg,
            authorName,
            authorLogin,
            authorEmail,
            authorAvatarUrl,
            commitDate,
            additions,
            deletions,
            filesChangedCount,
            branches: [branchName],
            htmlUrl,
          });

          // Save commit files and patches
          if (commitDetail && Array.isArray(commitDetail.files)) {
            for (const fileObj of commitDetail.files) {
              await GithubCommitFile.create({
                workspaceId,
                commitSha: sha,
                filename: fileObj.filename,
                changeType: fileObj.status === "removed" ? "deleted" : fileObj.status || "modified",
                additions: fileObj.additions || 0,
                deletions: fileObj.deletions || 0,
                changes: fileObj.changes || 0,
                patch: fileObj.patch || null,
              });
            }
          }

          branchAdditions += additions;
          branchDeletions += deletions;
          branchFilesCount += filesChangedCount;
          totalSyncedCommits++;
        }
      }

      // Upsert GithubActivityBranch with headCommitSha
      await GithubActivityBranch.findOneAndUpdate(
        { workspaceId, repo, branchName },
        {
          workspaceId,
          repo,
          branchName,
          headCommitSha: headSha,
          status: branchStatus,
          targetBranch,
          prNumber,
          prTitle,
          prUrl,
          prStatus,
          mergedBy,
          mergedAt,
          commitCount: authorCommits.length,
          totalAdditions: branchAdditions,
          totalDeletions: branchDeletions,
          totalFilesChanged: branchFilesCount,
          latestCommitDate,
          firstCommitDate: firstCommitDate || latestCommitDate,
          lastSyncedAt: new Date(),
        },
        { upsert: true, new: true }
      );
    }

    // Record success in GithubActivitySync
    const syncResult = await GithubActivitySync.findOneAndUpdate(
      { workspaceId },
      {
        workspaceId,
        lastSyncStatus: "SUCCESS",
        lastSyncTime: new Date(),
        errorMessage: null,
        branchCount: syncedBranchesCount,
        commitCount: totalSyncedCommits,
        configuredUsername: username,
        configuredPrefix: branchPrefix,
        configuredRepo: `${owner}/${repo}`,
      },
      { upsert: true, new: true }
    );

    const isUpToDate = newBranchesCount === 0 && updatedBranchesCount === 0 && deletedBranchNames.length === 0;

    let syncMessage = "";
    if (isUpToDate) {
      syncMessage = `Already up to date! All ${syncedBranchesCount} branches are synced.`;
    } else {
      const parts = [];
      if (newBranchesCount > 0) parts.push(`${newBranchesCount} new branch${newBranchesCount > 1 ? "es" : ""} added`);
      if (updatedBranchesCount > 0) parts.push(`${updatedBranchesCount} branch${updatedBranchesCount > 1 ? "es" : ""} updated`);
      if (deletedBranchNames.length > 0) parts.push(`${deletedBranchNames.length} branch${deletedBranchNames.length > 1 ? "es" : ""} removed`);
      syncMessage = `Sync successful! ${parts.join(", ")}.`;
    }

    return {
      success: true,
      isUpToDate,
      syncMessage,
      newBranchesCount,
      updatedBranchesCount,
      deletedBranchesCount: deletedBranchNames.length,
      branchesCount: syncedBranchesCount,
      commitsCount: totalSyncedCommits,
      lastSyncTime: syncResult.lastSyncTime,
    };
  } catch (error) {
    console.error("Sync GitHub Activity Error:", error);
    await GithubActivitySync.findOneAndUpdate(
      { workspaceId },
      {
        workspaceId,
        lastSyncStatus: "ERROR",
        errorMessage: error.message || "Failed to sync GitHub activity",
      },
      { upsert: true }
    );
    throw error;
  }
};
