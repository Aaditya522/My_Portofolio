import React, { useState } from "react";
import axios from "axios";
import { Mail, Send, CheckCircle2, AlertCircle, MapPin, Clock, MessageSquare, Loader2 } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import ScrollReveal from "./ScrollReveal";
import ThreeDCard from "./ThreeDCard";

export default function ContactSection() {
  const { profile } = usePortfolio();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, text: "" });

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/contact", formData);
      setLoading(false);
      setStatus({
        type: "success",
        text: response.data.message || "Message sent successfully! I will get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setLoading(false);
      const errorText = error.response?.data?.message || "Failed to send message. Please try again.";
      setStatus({ type: "error", text: errorText });
    }
  };

  return (
    <section id="contact" className="py-28 relative z-10 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-950/80 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-bold uppercase tracking-wider mb-5 backdrop-blur-md shadow-lg shadow-fuchsia-950/40">
            <MessageSquare className="w-4 h-4 text-fuchsia-400" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Let's Build Something <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">Extraordinary</span>
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg leading-relaxed">
            Have a project in mind, a job opportunity, or a technical inquiry? Send me a message and I'll respond within 24 hours.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full">
          {/* Left Column - 3D Contact Details Card */}
          <ScrollReveal delay={150} className="lg:col-span-5">
            <ThreeDCard index={0} maxTilt={10} scaleOnHover={1.01} className="w-full h-full">
              <div className="bg-slate-900/85 border border-slate-800/90 rounded-3xl p-7 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl h-full flex flex-col justify-between overflow-hidden preserve-3d">
                <div className="space-y-6 preserve-3d translate-z-30">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Contact Information</h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-normal">
                    Feel free to reach out directly via email or the form. I'm open to full-time roles, contract work, and technical collaborations.
                  </p>

                  <div className="space-y-5 pt-3">
                    <div className="flex items-start gap-4">
                      <div className="p-3.5 rounded-xl bg-violet-950/90 border border-violet-500/30 text-violet-400 shadow-md">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-semibold">Email Address</div>
                        <a href={`mailto:${profile?.email || "aadityabansal522@gmail.com"}`} className="text-white hover:text-violet-400 font-bold text-sm transition-colors">
                          {profile?.email || "aadityabansal522@gmail.com"}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3.5 rounded-xl bg-cyan-950/90 border border-cyan-500/30 text-cyan-400 shadow-md">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-semibold">Location</div>
                        <div className="text-white font-bold text-sm">Remote Friendly / India</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3.5 rounded-xl bg-fuchsia-950/90 border border-fuchsia-500/30 text-fuchsia-400 shadow-md">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-semibold">Response Time</div>
                        <div className="text-white font-bold text-sm">Within 24 Hours</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ThreeDCard>
          </ScrollReveal>

          {/* Right Column - Wired 3D Contact Form */}
          <ScrollReveal delay={300} className="lg:col-span-7">
            <ThreeDCard index={1} maxTilt={8} scaleOnHover={1.01} className="w-full">
              <form onSubmit={handleSubmit} className="bg-slate-900/85 border border-slate-800/90 rounded-3xl p-7 sm:p-8 space-y-5 shadow-2xl backdrop-blur-xl overflow-hidden preserve-3d">
                <h3 className="text-2xl font-bold text-white mb-2 preserve-3d translate-z-30 tracking-tight">Send a Message</h3>

                {/* Status Alert Banner */}
                {status.type === "success" && (
                  <div className="flex items-center gap-3 bg-violet-950/90 border border-violet-500/40 text-violet-300 p-4 rounded-xl text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-violet-400" />
                    <span>{status.text}</span>
                  </div>
                )}

                {status.type === "error" && (
                  <div className="flex items-center gap-3 bg-red-950/90 border border-red-500/40 text-red-300 p-4 rounded-xl text-sm font-semibold">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                    <span>{status.text}</span>
                  </div>
                )}

                <div className="preserve-3d translate-z-20">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                  />
                </div>

                <div className="preserve-3d translate-z-20">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                  />
                </div>

                <div className="preserve-3d translate-z-20">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or inquiry..."
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition resize-none"
                  />
                </div>

                <div className="preserve-3d translate-z-30 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-violet-600/30 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-white" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </ThreeDCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
