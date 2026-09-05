import mongoose from "mongoose";
import dotenv from "dotenv";
import PortfolioProfile from "./models/PortfolioProfile.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/portfolio_db";

const imageSkills = [
  {
    id: "html5",
    title: "HTML5",
    description: "Enthusiastic HTML learner with a passion for structuring and presenting web content effectively.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-amber-700 bg-lime-200/80",
  },
  {
    id: "css3",
    title: "CSS3",
    description: "CSS enthusiast with hands-on experience in building visually appealing and responsive web projects as a fresher.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-emerald-800 bg-emerald-200/80",
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "A JavaScript enthusiast with a strong understanding of building dynamic and interactive web applications.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-amber-800 bg-lime-200/80",
  },
  {
    id: "reactjs",
    title: "React JS",
    description: "A dedicated React enthusiast with a solid grasp of building dynamic and responsive user interfaces.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-teal-800 bg-emerald-200/80",
  },
  {
    id: "nodejs",
    title: "Node.js",
    description: "Dedicated Node.js learner with a keen interest in exploring server-side development and creating efficient applications.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-emerald-800 bg-lime-200/80",
  },
  {
    id: "expressjs",
    title: "Express.js",
    description: "Experience in building RESTful APIs and backend services using Express.js with proper routing, middleware, and authentication.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-slate-800 bg-emerald-200/80",
  },
  {
    id: "php",
    title: "PHP (Backend)",
    description: "Hands-on experience in server-side development, dynamic page rendering, and database integration using PHP for web applications.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-emerald-800 bg-lime-200/80",
  },
  {
    id: "auth",
    title: "Authentication & Authorization",
    description: "Implemented authentication and authorization using JWT and session-based methods, along with role-based access control (RBAC) in Express.js and React.js for secure, role-specific access.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-slate-800 bg-emerald-200/80",
  },
  {
    id: "mongodb",
    title: "MongoDB",
    description: "Hands-on experience with MongoDB using Mongoose and MongoDB Atlas for designing schemas, managing data, and building scalable databases.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-emerald-800 bg-lime-200/80",
  },
  {
    id: "cpp",
    title: "C/C++",
    description: "Strong foundation in C/C++ syntax, OOPs and Data Structures. Eager to apply and expand my knowledge in practical projects.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-indigo-800 bg-emerald-200/80",
  },
  {
    id: "java",
    title: "JAVA",
    description: "A dedicated Java enthusiast with a strong foundation in programming and a passion for learning.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-amber-800 bg-lime-200/80",
  },
  {
    id: "github",
    title: "GitHub",
    description: "Repository management, pull requests, issue tracking, CI/CD integration.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-slate-900 bg-emerald-200/80",
  },
  {
    id: "security_compliance",
    title: "Information Security & Compliance",
    description: "Understanding of information security principles, data privacy, secure authentication practices, and basic legal compliance related to user data protection.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-slate-800 bg-lime-200/80",
  },
  {
    id: "network_security",
    title: "Network Security",
    description: "Understanding of securing networks, firewalls, VPNs, etc.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-slate-800 bg-emerald-200/80",
  },
  {
    id: "kali_linux",
    title: "Kali Linux",
    description: "Hands-on experience with Kali Linux tools for penetration testing, vulnerability scanning, and ethical hacking.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-emerald-900 bg-lime-200/80",
  },
  {
    id: "security_tools",
    title: "Security Tools",
    description: "Familiar with Wireshark, BurpSuite, Nmap, and other tools for network analysis and penetration testing.",
    bgStyle: "bg-emerald-100/50 border-emerald-300/80 text-slate-800",
    iconColor: "text-slate-800 bg-emerald-200/80",
  },
  {
    id: "cryptography",
    title: "Cryptography",
    description: "Basic understanding of encryption, hashing, and secure communication protocols.",
    bgStyle: "bg-lime-100/60 border-lime-300/80 text-slate-800",
    iconColor: "text-slate-800 bg-lime-200/80",
  },
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to MongoDB.");

    let profile = await PortfolioProfile.findOne();
    if (!profile) {
      profile = new PortfolioProfile({
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
        skills: imageSkills,
      });
    } else {
      profile.skills = imageSkills;
    }

    await profile.save();
    console.log("Portfolio DB skills successfully updated with all image entries!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding skills:", err);
    process.exit(1);
  }
}

seedDatabase();
