import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const seedAdminUser = async () => {
  try {
    const adminEmail = "aadityabansal522@gmail.com";
    const rawPassword = "ty]:LO1c";
    const adminName = "Aaditya Bansal";

    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    if (existingUser) {
      existingUser.name = adminName;
      existingUser.password = hashedPassword;
      existingUser.isAdmin = true;
      await existingUser.save();
      console.log(`Admin user [${adminEmail}] verified & updated in database.`);
    } else {
      await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        isAdmin: true,
      });
      console.log(`Admin user [${adminEmail}] created successfully.`);
    }
  } catch (error) {
    console.error("Admin Seeding Error:", error.message);
  }
};
