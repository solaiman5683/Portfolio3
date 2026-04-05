
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { PricingPackage } from '../types';

interface PricingProps {
  packages: PricingPackage[];
}

function parseFeatures(features: unknown): string[] {
  if (!features) return [];
  if (Array.isArray(features)) {
    return features.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof features === 'string') {
    const trimmed = features.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      /* fall through */
    }
    return trimmed
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);
  }
  return [];
}

function isPopular(pkg: PricingPackage): boolean {
  const v = pkg.is_popular;
  if (typeof v === 'boolean') return v;
  return v === 1;
}

const Pricing: React.FC<PricingProps> = ({ packages }) => {
  if (!packages.length) return null;

  const sorted = [...packages].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  return (
    <section
      id="pricing"
      className="py-20 sm:py-24 lg:py-28 border-y border-white/[0.06]"
      style={{ backgroundColor: 'var(--_theme---base--surface--surface)' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12 sm:mb-14">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full border text-[11px] font-semibold tracking-widest uppercase mb-6"
              style={{
                borderColor: 'var(--_theme---accent--secondary)',
                backgroundColor: 'var(--_theme---accent--secondary--muted)',
                color: 'var(--_theme---accent--secondary)',
              }}
            >
              Investment
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-title text-4xl md:text-5xl font-bold tracking-tight"
              style={{ color: 'var(--_theme---base--text--primary)' }}
            >
              Clear packages for <span style={{ color: 'var(--_theme---accent)' }}>every scope.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="mt-5 text-sm sm:text-base leading-relaxed max-w-xl"
              style={{ color: 'var(--_theme---base--text--secondary)' }}
            >
              Choose a tier that fits your timeline and deliverables. Every package is scoped for quality,
              communication, and a polished outcome—adjust details anytime when we talk.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2.5 lg:justify-end"
          >
            {['Transparent scope', 'Milestone-friendly', 'Custom add-ons'].map((pill) => (
              <span
                key={pill}
                className="px-3 py-1.5 rounded-full text-[11px] font-medium border"
                style={{
                  borderColor: 'var(--_theme---base--border--subtle)',
                  backgroundColor: 'var(--_theme---base--surface--raised)',
                  color: 'var(--_theme---base--text--muted)',
                }}
              >
                {pill}
              </span>
            ))}
          </motion.div>
        </div>

        <div
          className={`grid gap-6 ${
            sorted.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : sorted.length === 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
          }`}
        >
          {sorted.map((pkg, index) => {
            const popular = isPopular(pkg);
            const featureList = parseFeatures(pkg.features);
            const href = (pkg.cta_href || '/contact').trim() || '/contact';
            const isExternal = /^https?:\/\//i.test(href);
            const ctaLabel = (pkg.cta_text || 'Get started').trim() || 'Get started';

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.07, duration: 0.5 }}
                className={`relative flex flex-col h-full rounded-2xl border p-7 sm:p-8 transition-all duration-500 hover:-translate-y-0.5 ${
                  popular ? 'shadow-[0_0_0_1px_var(--_theme---accent)]' : ''
                }`}
                style={{
                  backgroundColor: popular
                    ? 'var(--_theme---base--surface--raised)'
                    : 'var(--_theme---base--surface--raised)',
                  borderColor: popular
                    ? 'var(--_theme---accent)'
                    : 'var(--_theme---base--border--subtle)',
                  boxShadow: popular
                    ? '0 24px 60px -28px color-mix(in srgb, var(--_theme---accent) 35%, transparent)'
                    : undefined,
                }}
              >
                {popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: 'var(--_theme---accent)',
                      color: 'var(--_theme---base--surface--surface)',
                    }}
                  >
                    <Sparkles size={12} strokeWidth={2.5} />
                    Most popular
                  </div>
                )}

                <div
                  className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full blur-3xl opacity-50 pointer-events-none"
                  style={{ backgroundColor: 'var(--_theme---accent--muted)' }}
                />

                <div className="relative z-10 flex flex-col flex-1">
                  <div className="mb-6">
                    <h3
                      className="font-title text-xl font-semibold tracking-tight"
                      style={{ color: 'var(--_theme---base--text--primary)' }}
                    >
                      {pkg.name}
                    </h3>
                    {pkg.subtitle && (
                      <p
                        className="text-xs font-medium mt-1.5"
                        style={{ color: 'var(--_theme---accent)' }}
                      >
                        {pkg.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="mb-6 pb-6 border-b" style={{ borderColor: 'var(--_theme---base--border--subtle)' }}>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span
                        className="font-title text-4xl sm:text-5xl font-bold tracking-tight"
                        style={{ color: 'var(--_theme---base--text--primary)' }}
                      >
                        {pkg.price_display}
                      </span>
                    </div>
                    {pkg.price_note && (
                      <p
                        className="text-xs mt-2 font-medium"
                        style={{ color: 'var(--_theme---base--text--muted)' }}
                      >
                        {pkg.price_note}
                      </p>
                    )}
                  </div>

                  {pkg.description && (
                    <p
                      className="text-sm leading-relaxed mb-6"
                      style={{ color: 'var(--_theme---base--text--secondary)' }}
                    >
                      {pkg.description}
                    </p>
                  )}

                  {featureList.length > 0 && (
                    <ul className="space-y-3 mb-8 flex-1">
                      {featureList.map((line, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span
                            className="mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center border"
                            style={{
                              borderColor: 'var(--_theme---base--border--subtle)',
                              backgroundColor: 'var(--_theme---base--surface--overlay)',
                              color: 'var(--_theme---accent)',
                            }}
                          >
                            <Check size={12} strokeWidth={3} />
                          </span>
                          <span style={{ color: 'var(--_theme---base--text--secondary)' }}>{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto pt-2">
                    {isExternal ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: popular
                            ? 'var(--_theme---accent)'
                            : 'transparent',
                          color: popular
                            ? 'var(--_theme---base--surface--surface)'
                            : 'var(--_theme---base--text--primary)',
                          border: popular
                            ? 'none'
                            : '1px solid var(--_theme---base--border--subtle)',
                        }}
                      >
                        {ctaLabel}
                        <ArrowRight size={16} />
                      </a>
                    ) : (
                      <Link
                        to={href}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: popular
                            ? 'var(--_theme---accent)'
                            : 'transparent',
                          color: popular
                            ? 'var(--_theme---base--surface--surface)'
                            : 'var(--_theme---base--text--primary)',
                          border: popular
                            ? 'none'
                            : '1px solid var(--_theme---base--border--subtle)',
                        }}
                      >
                        {ctaLabel}
                        <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs mt-10 sm:mt-12 max-w-lg mx-auto leading-relaxed"
          style={{ color: 'var(--_theme---base--text--muted)' }}
        >
          Final quotes depend on scope and timeline. These packages are starting points—message me for a tailored
          estimate.
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
