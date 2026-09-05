import PortfolioProfile from "../models/PortfolioProfile.js";

const defaultInitialSkills = [
  {
    id: "html5",
    title: "HTML5",
    description: "Enthusiastic HTML learner with a passion for structuring and presenting web content effectively.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-amber-700 bg-lime-200/80",
    proficiency: 95,
  },
  {
    id: "css3",
    title: "CSS3",
    description: "CSS enthusiast with hands-on experience in building visually appealing and responsive web projects as a fresher.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-emerald-800 bg-emerald-200/80",
    proficiency: 90,
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "A JavaScript enthusiast with a strong understanding of building dynamic and interactive web applications.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-amber-800 bg-lime-200/80",
    proficiency: 92,
  },
  {
    id: "reactjs",
    title: "React JS",
    description: "A dedicated React enthusiast with a solid grasp of building dynamic and responsive user interfaces.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-teal-800 bg-emerald-200/80",
    proficiency: 88,
  },
  {
    id: "nodejs",
    title: "Node.js",
    description: "Dedicated Node.js learner with a keen interest in exploring server-side development and creating efficient applications.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-emerald-800 bg-lime-200/80",
    proficiency: 85,
  },
  {
    id: "expressjs",
    title: "Express.js",
    description: "Experience in building RESTful APIs and backend services using Express.js with proper routing, middleware, and authentication.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-slate-800 bg-emerald-200/80",
    proficiency: 87,
  },
  {
    id: "php",
    title: "PHP (Backend)",
    description: "Hands-on experience in server-side development, dynamic page rendering, and database integration using PHP for web applications.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-indigo-800 bg-lime-200/80",
    proficiency: 82,
  },
  {
    id: "auth",
    title: "Authentication & Authorization",
    description: "Implemented authentication and authorization using JWT and session-based methods, along with role-based access control (RBAC) in Express.js and React.js for secure, role-specific access.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-slate-800 bg-emerald-200/80",
    proficiency: 90,
  },
  {
    id: "mongodb",
    title: "MongoDB",
    description: "Hands-on experience with MongoDB using Mongoose and MongoDB Atlas for designing schemas, managing data, and building scalable databases.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-emerald-800 bg-lime-200/80",
    proficiency: 86,
  },
  {
    id: "cpp",
    title: "C/C++",
    description: "Strong foundation in C/C++ syntax, OOPs and Data Structures. Eager to apply and expand my knowledge in practical projects.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-indigo-800 bg-emerald-200/80",
    proficiency: 94,
  },
  {
    id: "java",
    title: "JAVA",
    description: "A dedicated Java enthusiast with a strong foundation in programming and a passion for learning.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-amber-800 bg-lime-200/80",
    proficiency: 84,
  },
  {
    id: "github",
    title: "GitHub",
    description: "Repository management, pull requests, issue tracking, CI/CD integration.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-slate-900 bg-emerald-200/80",
    proficiency: 92,
  },
  {
    id: "security_compliance",
    title: "Information Security & Compliance",
    description: "Understanding of information security principles, data privacy, secure authentication practices, and basic legal compliance related to user data protection.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-slate-800 bg-lime-200/80",
    proficiency: 80,
  },
  {
    id: "network_security",
    title: "Network Security",
    description: "Understanding of securing networks, firewalls, VPNs, etc.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-slate-800 bg-emerald-200/80",
    proficiency: 78,
  },
  {
    id: "kali_linux",
    title: "Kali Linux",
    description: "Hands-on experience with Kali Linux tools for penetration testing, vulnerability scanning, and ethical hacking.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-emerald-900 bg-lime-200/80",
    proficiency: 85,
  },
  {
    id: "security_tools",
    title: "Security Tools",
    description: "Familiar with Wireshark, BurpSuite, Nmap, and other tools for network analysis and penetration testing.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-slate-800 bg-emerald-200/80",
    proficiency: 83,
  },
  {
    id: "cryptography",
    title: "Cryptography",
    description: "Basic understanding of encryption, hashing, and secure communication protocols.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-slate-800 bg-lime-200/80",
    proficiency: 81,
  },
];

// @desc    Get portfolio profile
// @route   GET /api/portfolio-profile
// @access  Public
export const getPortfolioProfile = async (req, res) => {
  try {
    let profile = await PortfolioProfile.findOne();
    if (!profile) {
      profile = await PortfolioProfile.create({
        fullName: "Aaditya Bansal",
        tagline: "Software Engineering Intern & Full Stack Developer",
        heading: "Crafting Software As A",
        bio: "4th Year B.Tech CSE Student passionate about building scalable web apps, MERN stack solutions, and AI-powered developer workflows.",
        roles: [
          "Software Engineering Intern",
          "4th Year B.Tech CSE Student",
          "MERN Stack & LLM Developer",
        ],
        resumeUrl: "#",
        githubUrl: "https://github.com",
        linkedinUrl: "https://linkedin.com",
        email: "aadityabansal522@gmail.com",
        skills: defaultInitialSkills,
      });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch portfolio profile" });
  }
};

// @desc    Update portfolio profile
// @route   PUT /api/portfolio-profile
// @access  Protected (Requires verifyPortfolioPinMiddleware)
export const updatePortfolioProfile = async (req, res) => {
  try {
    let profile = await PortfolioProfile.findOne();
    if (!profile) {
      profile = new PortfolioProfile({});
    }

    const {
      fullName,
      tagline,
      heading,
      bio,
      roles,
      resumeUrl,
      githubUrl,
      linkedinUrl,
      avatarUrl,
      email,
      skills,
      projects,
    } = req.body;

    if (fullName !== undefined) profile.fullName = fullName;
    if (tagline !== undefined) profile.tagline = tagline;
    if (heading !== undefined) profile.heading = heading;
    if (bio !== undefined) profile.bio = bio;
    if (roles !== undefined) profile.roles = roles;
    if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;
    if (githubUrl !== undefined) profile.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
    if (avatarUrl !== undefined) profile.avatarUrl = avatarUrl;
    if (email !== undefined) profile.email = email;

    if (Array.isArray(skills)) {
      profile.skills = skills.map((s) => {
        const rawProf = s.proficiency;
        let proficiency = 90;
        if (rawProf !== undefined && rawProf !== null && rawProf !== "") {
          const parsed = Number(rawProf);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
            proficiency = Math.round(parsed);
          }
        }
        return {
          id: s.id || s._id,
          title: s.title || "",
          description: s.description || "",
          bgStyle: s.bgStyle || "bg-lime-100/60 border-lime-300/80 text-slate-800",
          iconColor: s.iconColor || "text-amber-800 bg-lime-200/80",
          proficiency,
        };
      });
      profile.markModified("skills");
    }

    if (Array.isArray(projects)) {
      profile.projects = projects;
      profile.markModified("projects");
    }

    const savedProfile = await profile.save();
    return res.json(savedProfile);
  } catch (error) {
    console.error("Error updating portfolio profile:", error);
    res.status(500).json({ message: error.message || "Failed to update portfolio profile" });
  }
};

// @desc    Upload avatar image file via Multer
// @route   POST /api/portfolio-profile/upload-avatar
// @access  Protected (Requires verifyPortfolioPinMiddleware)
export const uploadAvatarImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: "Avatar uploaded successfully via Multer",
      avatarUrl,
    });
  } catch (error) {
    console.error("Error in Multer uploadAvatarImage:", error);
    res.status(500).json({ message: error.message || "Failed to upload avatar image" });
  }
};

// @desc    Upload resume document file via Multer
// @route   POST /api/portfolio-profile/upload-resume
// @access  Protected (Requires verifyPortfolioPinMiddleware)
export const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume document file uploaded" });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: "Resume document uploaded successfully via Multer",
      resumeUrl,
      originalName: req.file.originalname,
    });
  } catch (error) {
    console.error("Error in Multer uploadResumeFile:", error);
    res.status(500).json({ message: error.message || "Failed to upload resume document" });
  }
};
