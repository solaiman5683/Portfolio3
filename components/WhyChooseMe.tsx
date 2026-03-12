
import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { WhyChooseMe as WhyChooseMeType } from '../types';

interface WhyChooseMeProps {
  items: WhyChooseMeType[];
}

const WhyChooseMe: React.FC<WhyChooseMeProps> = ({ items }) => {
  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Award;
    return <Icon className={className} />;
  };

  const sortedItems = [...items].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  return (
    <section id="why-me" className="py-section bg-background border-t border-white/[0.06] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary-500/[0.05] blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full border border-primary-500/25 bg-primary-500/10 text-primary-500 text-[11px] font-semibold tracking-widest uppercase mb-6"
            >
              Why work with me
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-display-xl font-bold text-white tracking-tight mb-6"
            >
              Precision meets <span className="text-primary-500">creative flair.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-500 text-base leading-relaxed max-w-lg mb-10"
            >
              I combine technical precision with creative flair to deliver visuals that don't just exist—they get noticed and remembered.
            </motion.p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-surface border border-white/[0.06] rounded-2xl"
              >
                <div className="font-display text-2xl font-bold text-white mb-1">99%</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Project success</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="p-6 bg-surface border border-white/[0.06] rounded-2xl"
              >
                <div className="font-display text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Global support</div>
              </motion.div>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-black rounded-xl font-semibold text-sm hover:bg-primary-400 transition-colors shadow-glow"
            >
              Let's work together <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {sortedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group flex gap-6 p-6 bg-surface border border-white/[0.06] rounded-2xl hover:border-primary-500/25 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-surface-elevated border border-white/5 text-primary-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-500 group-hover:text-black transition-all duration-300">
                  <IconComponent name={item.icon} className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-primary-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseMe;
