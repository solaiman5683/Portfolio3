
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Quote, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const trustStats = [
    { value: `${Math.max(testimonials.length, 12)}+`, label: 'Happy clients' },
    { value: '4.9/5', label: 'Average rating' },
    { value: '24h', label: 'Typical response time' },
  ];

  return (
    <section
      id="testimonials"
      className="pt-24 pb-24 sm:pt-28 sm:pb-28 lg:pt-32 lg:pb-32 bg-surface-muted border-y border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full border border-primary-500/25 bg-primary-500/10 text-primary-500 text-[11px] font-semibold tracking-widest uppercase mb-6"
            >
              Client feedback
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-display-xl font-bold text-white tracking-tight"
            >
              What brands say
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
              className="text-slate-400 mt-6 max-w-xl leading-relaxed"
            >
              I partner with growing businesses to deliver clear messaging, modern visuals,
              and conversion-focused digital experiences that help teams move faster with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <span className="inline-flex items-center px-3.5 py-2 rounded-lg border border-emerald-400/25 bg-emerald-400/10 text-emerald-300 text-xs font-medium">
                Strategy-led execution
              </span>
              <span className="inline-flex items-center px-3.5 py-2 rounded-lg border border-sky-400/25 bg-sky-400/10 text-sky-300 text-xs font-medium">
                Transparent collaboration
              </span>
              <span className="inline-flex items-center px-3.5 py-2 rounded-lg border border-amber-400/25 bg-amber-400/10 text-amber-300 text-xs font-medium">
                Fast delivery cycles
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/[0.08] bg-surface/70 backdrop-blur-sm p-6 sm:p-7"
          >
            <p className="text-slate-300 text-sm leading-relaxed">
              Trusted by teams who care about visual impact and clear communication. Every project
              includes milestone updates, measurable goals, and post-launch support.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {trustStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/[0.07] bg-surface-raised/70 px-3 py-3 text-center"
                >
                  <p className="text-white font-semibold text-lg leading-tight">{stat.value}</p>
                  <p className="text-slate-500 text-[11px] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="relative overflow-hidden p-8 bg-surface border border-white/[0.06] rounded-2xl hover:border-primary-500/30 transition-colors duration-300"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400/80 via-cyan-400/70 to-amber-400/80" />
              <Quote className="absolute top-6 right-6 text-primary-500/10 w-10 h-10" />
              <div className="flex items-center gap-1.5 mb-5">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={`${t.id}-star-${starIndex}`} className="w-4 h-4 text-amber-300 fill-amber-300/40" />
                ))}
                <span className="text-[11px] text-slate-500 ml-2">Verified client</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed relative z-10">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={t.photo_url || 'https://picsum.photos/100/100'}
                  alt={t.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/5"
                />
                <div>
                  <h4 className="font-semibold text-white">{t.name}</h4>
                  <p className="text-sm text-primary-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 via-primary-500 to-sky-500 shadow-[0_16px_40px_-20px_rgba(0,208,132,0.7)] hover:brightness-110 transition-all duration-300"
          >
            Join them — start a project
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-slate-500 mt-4">
            Get a free project roadmap, timeline estimate, and budget range.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
