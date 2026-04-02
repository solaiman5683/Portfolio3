
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Services from '../components/Services';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { api } from '../lib/api';
import { Profile, Service } from '../types';
import { motion } from 'framer-motion';
import { Search, PenTool, Terminal, Rocket, CheckCircle2, Zap, Shield, Target } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, s] = await Promise.all([
          api.getProfile(),
          api.list<Service>('services'),
        ]);
        setProfile(p as unknown as Profile);
        setServices(s);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  const steps = [
    {
      icon: <Search />,
      title: "Discovery",
      desc: "Understanding your vision, audience, and business priorities to define a clear roadmap.",
      info: "Workshops, research, and goal alignment"
    },
    {
      icon: <PenTool />,
      title: "Design",
      desc: "Crafting wireframes and visual systems that balance premium aesthetics with usability.",
      info: "UX flows, UI direction, and feedback loops"
    },
    {
      icon: <Terminal />,
      title: "Execution",
      desc: "Building robust, responsive experiences with clean code and performance-first practices.",
      info: "Implementation, QA, and iteration"
    },
    {
      icon: <Rocket />,
      title: "Delivery",
      desc: "Launching with confidence through testing, optimization, and structured handover support.",
      info: "Deployment, documentation, and post-launch care"
    }
  ];

  const benefits = [
    {
      icon: <Zap className="text-primary-500" />,
      title: "Fast Turnaround",
      desc: "Optimized workflows keep your timeline predictable while maintaining quality standards.",
      point: "Weekly checkpoints and milestone tracking"
    },
    {
      icon: <Shield className="text-primary-500" />,
      title: "Secure & Scalable",
      desc: "Built with modern best practices so your product stays reliable as traffic and scope grow.",
      point: "Clean architecture and maintainable code"
    },
    {
      icon: <Target className="text-primary-500" />,
      title: "Result Oriented",
      desc: "Every decision is guided by measurable outcomes tied to your business and brand goals.",
      point: "Performance, accessibility, and conversion focus"
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="pt-28">
        <Services services={services} />

        <section className="pt-24 pb-24 sm:pt-28 sm:pb-28 lg:pt-32 lg:pb-32 bg-surface-muted border-y border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <div>
                <span className="text-primary-500 text-[11px] font-semibold uppercase tracking-widest block mb-4">Core benefits</span>
                <h2 className="font-display text-display-xl font-bold text-white mb-5">Elevating your <span className="text-primary-500">brand.</span></h2>
                <p className="text-slate-400 max-w-xl leading-relaxed mb-10">
                  I combine strategy, design, and execution to deliver digital experiences that look refined,
                  communicate clearly, and perform reliably across devices.
                </p>
                <div className="space-y-8">
                  {benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex gap-5"
                    >
                      <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center shrink-0 text-primary-500">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
                        <p className="text-slate-400/90 text-xs mt-2">{benefit.point}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 sm:p-9 bg-surface border border-white/[0.06] rounded-3xl"
              >
                <CheckCircle2 className="text-primary-500 w-14 h-14 mb-6" />
                <h3 className="font-display text-2xl font-bold text-white mb-4">Quality guaranteed</h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Every project goes through structured reviews for performance, accessibility, and brand consistency
                  before final delivery.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Clean deliverables', 'On-brand', 'Responsive', 'On time'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-surface-elevated rounded-lg text-[11px] font-medium text-slate-500">{tag}</span>
                  ))}
                </div>
                <div className="mt-7 pt-6 border-t border-white/[0.06] grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white font-semibold">Transparent updates</p>
                    <p className="text-slate-500 text-xs mt-1">Regular progress reports and milestone visibility.</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Post-launch support</p>
                    <p className="text-slate-500 text-xs mt-1">Guidance after delivery for smooth adoption.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="pt-24 pb-24 sm:pt-28 sm:pb-28 lg:pt-32 lg:pb-32 bg-background">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-14">
              <span className="text-primary-500 text-[11px] font-semibold uppercase tracking-widest block mb-4">Workflow</span>
              <h2 className="font-display text-display-lg font-bold text-white">My working <span className="text-primary-500">process</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto mt-5 leading-relaxed">
                A clear, collaborative process designed to reduce uncertainty and keep your project moving with speed and quality.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="relative group text-center lg:text-left p-6 bg-surface border border-white/[0.06] rounded-2xl hover:border-primary-500/20 transition-all"
                >
                  <div className="text-5xl font-display font-bold text-white/[0.04] group-hover:text-primary-500/[0.08] pointer-events-none">0{idx + 1}</div>
                  <div className="w-14 h-14 bg-surface-elevated rounded-xl flex items-center justify-center text-primary-500 mb-6 mx-auto lg:mx-0 group-hover:bg-primary-500 group-hover:text-black transition-all">
                    {step.icon}
                  </div>
                  <h4 className="font-display text-lg font-semibold text-white mb-3">{step.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  <p className="text-slate-400/90 text-xs mt-3">{step.info}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-14 text-center">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 via-primary-500 to-sky-500 shadow-[0_16px_40px_-20px_rgba(0,208,132,0.7)] hover:brightness-110 transition-all duration-300"
              >
                Start a project
                <span aria-hidden="true">→</span>
              </a>
              <p className="text-slate-500 text-xs mt-4">Share your goals and receive a practical roadmap with timeline and scope.</p>
            </div>
          </div>
        </section>

        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default ServicesPage;
