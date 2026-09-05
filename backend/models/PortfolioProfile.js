import mongoose from "mongoose";

const skillItemSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    bgStyle: { type: String, default: "bg-lime-100/60 border-lime-300/80 text-slate-800" },
    iconColor: { type: String, default: "text-amber-800 bg-lime-200/80" },
    proficiency: { type: Number, default: 90 },
  },
  { _id: false, strict: false }
);

const projectItemSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: { type: String, default: "" },
    category: { type: String, default: "Full Stack Application" },
    description: { type: String, default: "" },
    features: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    githubUrl: { type: String, default: "https://github.com" },
    demoUrl: { type: String, default: "/login" },
  },
  { _id: false, strict: false }
);

const portfolioProfileSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "Aaditya Bansal" },
    tagline: { type: String, default: "Software Engineering Intern & Full Stack Developer" },
    heading: { type: String, default: "Crafting Software As A" },
    bio: {
      type: String,
      default:
        "4th Year B.Tech CSE Student passionate about building scalable web apps, MERN stack solutions, and AI-powered developer workflows.",
    },
    roles: {
      type: [String],
      default: [
        "Software Engineering Intern",
        "4th Year B.Tech CSE Student",
        "MERN Stack & LLM Developer",
      ],
    },
    resumeUrl: { type: String, default: "#" },
    githubUrl: { type: String, default: "https://github.com" },
    linkedinUrl: { type: String, default: "https://linkedin.com" },
    avatarUrl: { type: String, default: "" },
    email: { type: String, default: "aadityabansal522@gmail.com" },
    skills: [skillItemSchema],
    projects: [projectItemSchema],
  },
  {
    strict: false,
    timestamps: true,
  }
);

const PortfolioProfile = mongoose.model("PortfolioProfile", portfolioProfileSchema);
export default PortfolioProfile;
