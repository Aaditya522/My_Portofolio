import ContactMessage from "../models/ContactMessage.js";
import { sendContactEmails } from "../services/emailService.js";

// @desc    Submit a contact message (Public)
// @route   POST /api/contact
// @access  Public
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    // Save message to MongoDB
    const contactMessage = await ContactMessage.create({
      name,
      email,
      message,
      date: new Date(),
    });

    // Send emails asynchronously (to owner: aadityabansal522@gmail.com AND user: email)
    const mailResult = await sendContactEmails({ name, email, message });

    res.status(201).json({
      message: "Contact message sent successfully! Confirmation email dispatched.",
      contactMessage,
      mailResult,
    });
  } catch (error) {
    console.error("[createContactMessage Error]:", error);
    res.status(500).json({ message: error.message || "Failed to send message" });
  }
};

// @desc    Get all contact messages (Protected)
// @route   GET /api/contact
// @access  Private
export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch contact messages" });
  }
};

// @desc    Delete a contact message (Protected)
// @route   DELETE /api/contact/:id
// @access  Private
export const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.json({ message: "Contact message deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete contact message" });
  }
};
