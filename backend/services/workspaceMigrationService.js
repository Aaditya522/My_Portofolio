import mongoose from "mongoose";
import Workspace from "../models/Workspace.js";

/**
 * Ensures all existing legacy workspaces found across database collections
 * have corresponding password protection records in the Workspace collection.
 */
export const migrateLegacyWorkspaces = async () => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      console.log("[Migration] MongoDB not connected yet, skipping legacy workspace check.");
      return;
    }

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    const legacyCandidateCollections = [
      "tasks",
      "githubbranches",
      "expenses",
      "assets",
      "githubactivitybranches",
      "githubcommits",
      "githubcommitfiles",
      "githubactivitysyncs",
    ];

    const discoveredWorkspaceIds = new Set();

    for (const colName of legacyCandidateCollections) {
      if (collectionNames.includes(colName)) {
        try {
          const ids = await db.collection(colName).distinct("workspaceId");
          if (Array.isArray(ids)) {
            ids.forEach((id) => {
              if (id && typeof id === "string" && id.trim()) {
                discoveredWorkspaceIds.add(id.trim().toLowerCase());
              }
            });
          }
        } catch (err) {
          console.warn(`[Migration] Error reading distinct workspaceIds from ${colName}:`, err.message);
        }
      }
    }

    const defaultPassword = process.env.WORKSPACE_DEFAULT_PASSWORD || "Portfolio@2026";
    let migratedCount = 0;

    for (const rawId of discoveredWorkspaceIds) {
      const existing = await Workspace.findOne({ workspaceId: rawId });
      if (!existing) {
        // Create password protected workspace record
        await Workspace.create({
          workspaceId: rawId,
          password: defaultPassword,
        });
        migratedCount++;
        console.log(`[Migration] Secured legacy workspace '${rawId}' with default password protection.`);
      }
    }

    if (migratedCount > 0) {
      console.log(`[Migration] Successfully secured ${migratedCount} legacy workspace(s).`);
    } else {
      console.log("[Migration] All existing workspaces are verified and password protected.");
    }
  } catch (error) {
    console.error("[Migration] Error migrating legacy workspaces:", error.message);
  }
};
