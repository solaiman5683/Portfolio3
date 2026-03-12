
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import toast from 'react-hot-toast';

interface ContactProps {
  profile: Profile | null;
}

const Contact: React.FC<ContactProps> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('contact_messages').insert([formData]);
      if (error) throw error;
      toast.success('Message sent successfully!');
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      toast.error('Failed to send message.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <Mail size={20} style={{ color: 'var(--_theme---accent)' }} />, label: 'Email', value: profile?.email || '—' },
    { icon: <Phone size={20} style={{ color: 'var(--_theme---accent)' }} />, label: 'Phone', value: profile?.phone || '—' },
    { icon: <MapPin size={20} style={{ color: 'var(--_theme---accent)' }} />, label: 'Location', value: profile?.location || '—' },
  ];

  return (
    <section id="contact" className="py-section relative overflow-hidden border-t" style={{ backgroundColor: 'var(--_theme---base--surface--surface)', borderColor: 'var(--_theme---base--border--subtle)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] blur-[100px] rounded-full -z-10 pointer-events-none" style={{ backgroundColor: 'var(--_theme---accent--secondary--muted)' }} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-primary-500/25 bg-primary-500/10 text-primary-500 text-[11px] font-semibold tracking-widest uppercase mb-6"
          >
            Get in touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-display-xl font-bold text-white tracking-tight mb-6"
          >
            Start your next <span className="text-primary-500">project.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="max-w-xl mx-auto text-slate-500 text-base leading-relaxed"
          >
            Have a brief, a campaign idea, or just want to explore? I'm open to new projects and conversations that push visual boundaries.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            {contactInfo.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group flex items-center gap-5 p-6 bg-surface border border-white/[0.06] rounded-2xl hover:border-primary-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-surface-elevated rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-500/10 transition-colors">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">{item.label}</h4>
                  <p className="text-white font-medium truncate">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface p-8 md:p-10 rounded-3xl border border-white/[0.06]"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Full name</label>
                    <input
                      required
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 bg-background/60 border border-white/10 rounded-xl focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-white placeholder:text-slate-600 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                    <input
                      required
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-4 bg-background/60 border border-white/10 rounded-xl focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-white placeholder:text-slate-600 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Subject</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Motion design project"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-5 py-4 bg-background/60 border border-white/10 rounded-xl focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-white placeholder:text-slate-600 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-4 bg-background/60 border border-white/10 rounded-xl focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-white placeholder:text-slate-600 font-medium resize-none"
                  />
                </div>
                <button
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    success
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-primary-500 text-black hover:bg-primary-400 active:scale-[0.99]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : success ? (
                    <>Message sent <CheckCircle size={18} /></>
                  ) : (
                    <>Send message <Send size={18} /></>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
