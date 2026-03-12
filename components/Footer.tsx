
import React, { useEffect, useState } from 'react';
import { Profile, SocialLink } from '../types';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface FooterProps {
  profile: Profile | null;
}

const Footer: React.FC<FooterProps> = ({ profile }) => {
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    supabase.from('social_links').select('*').then(({ data }) => {
      if (data) setSocials(data);
    });
  }, []);

  const SocialIcon = ({ name }: { name: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Link2;
    return <Icon size={20} />;
  };

  return (
    <footer className="border-t" style={{ backgroundColor: 'var(--_theme---base--surface--raised)', borderColor: 'var(--_theme---base--border--subtle)' }}>
      <div className="border-b" style={{ borderColor: 'var(--_theme---base--border--subtle)' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 rounded-2xl p-8 md:p-10 border"
            style={{ backgroundColor: 'var(--_theme---base--surface--overlay)', borderColor: 'var(--_theme---accent--muted)' }}
          >
            <div>
              <h3 className="font-title text-xl md:text-2xl font-bold mb-2" style={{ color: 'var(--_theme---base--text--primary)' }}>
                Ready to elevate your brand?
              </h3>
              <p className="text-sm" style={{ color: 'var(--_theme---base--text--secondary)' }}>
                Let's create static and motion work that gets noticed.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm shrink-0 transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--_theme---accent)', color: 'var(--_theme---base--surface--surface)' }}
            >
              Start a project <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center space-y-10">
          <div className="text-center">
            <span className="font-display text-2xl font-bold tracking-tight text-white">
              {profile?.name || 'Md Abdul Hai'}<span className="text-primary-500">.</span>
            </span>
            <p className="text-slate-500 mt-3 text-sm max-w-md mx-auto leading-relaxed">
              Visualizer — static & motion design, video editing, and brand visibility for forward-thinking brands.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-xl bg-surface border border-white/[0.06] flex items-center justify-center text-slate-500 hover:text-primary-500 hover:border-primary-500/30 transition-all duration-300"
              >
                <SocialIcon name={s.icon || s.platform} />
              </a>
            ))}
          </div>

          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex flex-col md:flex-row justify-between w-full text-[11px] font-medium text-slate-500 gap-4 text-center md:text-left">
            <p>© {new Date().getFullYear()} {profile?.name || 'Hai'}. All rights reserved.</p>
            <div className="flex gap-6 justify-center md:justify-end items-center flex-wrap">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <Link to="/admin" className="hover:text-primary-500 transition-colors flex items-center gap-1.5">
                <LucideIcons.Lock size={12} className="opacity-60" /> Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
