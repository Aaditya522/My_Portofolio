import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const workspaceSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: [true, "Workspace ID is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Workspace ID must be at least 3 characters long"],
    },
    password: {
      type: String,
      required: [true, "Workspace password is required"],
      minlength: [4, "Password must be at least 4 characters long"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash password before saving
workspaceSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to verify candidate password
workspaceSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Workspace = mongoose.model("Workspace", workspaceSchema);
export default Workspace;
