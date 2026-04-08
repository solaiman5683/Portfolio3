
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, X, ChevronLeft, ChevronRight, Maximize2, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { Dialog, DialogContent } from './ui/dialog';

interface ProjectsProps {
  projects: Project[];
  isHomePage?: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ projects, isHomePage = false }) => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'video'>('gallery');
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const displayLimit = 12;
  const displayedProjects = isHomePage ? filteredProjects.slice(0, displayLimit) : filteredProjects;
  const hasMore = filteredProjects.length > displayLimit;

  // Helper to convert standard video URLs to embed URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  };

  const shortTitle = (title: string, max = 22) => {
    const clean = (title || '').trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max).trimEnd()}...`;
  };

  const projectImages = useMemo(() => {
    if (!selectedProject) return [];
    const gallery = selectedProject.gallery || [];
    const galleryUrls = gallery.map(g => g.image_url);

    return galleryUrls;
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      const hasGallery = Boolean(selectedProject.image_url) || Boolean(selectedProject.gallery?.length);
      if (hasGallery) setActiveTab('gallery');
      else setActiveTab(selectedProject.gallery_type === 'video' ? 'video' : 'gallery');
    }
  }, [selectedProject]);

  const scrollToImage = useCallback((index: number) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const width = container.offsetWidth;
      container.scrollTo({ left: width * index, behavior: 'smooth' });
      setCurrentImgIndex(index);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (projectImages.length <= 1) return;
    const nextIndex = (currentImgIndex + 1) % projectImages.length;
    if (isLightboxOpen) {
      setCurrentImgIndex(nextIndex);
    } else {
      scrollToImage(nextIndex);
    }
  }, [projectImages, currentImgIndex, scrollToImage, isLightboxOpen]);

  const handlePrev = useCallback(() => {
    if (projectImages.length <= 1) return;
    const prevIndex = (currentImgIndex - 1 + projectImages.length) % projectImages.length;
    if (isLightboxOpen) {
      setCurrentImgIndex(prevIndex);
    } else {
      scrollToImage(prevIndex);
    }
  }, [projectImages, currentImgIndex, scrollToImage, isLightboxOpen]);

  const closeModals = () => {
    setSelectedProject(null);
    setIsLightboxOpen(false);
    setCurrentImgIndex(0);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container.offsetWidth === 0) return;
    const index = Math.round(container.scrollLeft / container.offsetWidth);
    if (index !== currentImgIndex) {
      setCurrentImgIndex(index);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') {
        if (isLightboxOpen) setIsLightboxOpen(false);
        else closeModals();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, handleNext, handlePrev, isLightboxOpen]);

  return (
    <section id="projects" className="py-20 sm:py-24 lg:py-28 bg-background border-y border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full border border-primary-500/25 bg-primary-500/10 text-primary-500 text-[11px] font-semibold tracking-widest uppercase mb-6"
            >
              Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-title text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight"
            >
              Featured work
            </motion.h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300/90 max-w-xl">
              Selected projects across graphics, motion, video, and CGI—crafted for clarity, polish, and brand impact.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat, idx) => (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => setFilter(cat)}
                  className={`shrink-0 px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 border whitespace-nowrap ${
                    filter === cat
                      ? 'bg-white text-black border-white shadow-[0_10px_30px_-18px_rgba(255,255,255,0.35)]'
                      : 'bg-surface text-slate-400 border-white/[0.06] hover:border-white/15 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedProjects.map((project, index) => (
            <motion.button
              type="button"
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              onClick={() => {
                setSelectedProject(project);
                setCurrentImgIndex(0);
              }}
              className="group w-full h-full rounded-2xl overflow-hidden bg-surface border border-white/[0.06] hover:border-primary-500/30 transition-all duration-500 relative text-left"
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-elevated">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />

                {project.video_url && (
                  <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/95 text-black grid place-items-center shadow-[0_12px_30px_-20px_rgba(0,0,0,0.85)] border border-black/10">
                    <Play size={16} className="ml-0.5 fill-current" />
                  </div>
                )}
              </div>

              <div className="px-5 py-4 border-t border-white/[0.06] bg-surface/80">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                  {project.category || 'Project'}
                </p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white leading-tight line-clamp-1">
                    {shortTitle(project.title || 'Untitled Project')}
                  </h3>
                  <ArrowUpRight size={16} className="shrink-0 text-slate-300 group-hover:text-primary-400 transition-colors" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-14 flex flex-wrap gap-4 justify-center md:justify-end"
        >
          {isHomePage && hasMore && (
            <button
              onClick={() => navigate('/portfolio')}
              className="group px-6 py-3 bg-surface border border-white/10 text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:border-primary-500/40 hover:text-primary-500 transition-all"
            >
              View all projects <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 bg-[#00D084] text-black rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-white/90 transition-colors shadow-[0_18px_60px_-28px_rgba(255,255,255,0.35)] border border-white/10"
          >
            Start a project <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && closeModals()}>
        <DialogContent
          hideCloseButton
          className={`max-w-5xl w-full max-h-[92vh] p-0 bg-[#0c0c0e] border border-white/[0.07] rounded-2xl ${isLightboxOpen ? '!overflow-visible' : 'overflow-hidden'}`}
        >
          {selectedProject && (
            <div className="relative flex flex-col lg:flex-row max-h-[92vh]">
              {/* Close */}
              <button
                onClick={closeModals}
                className="absolute top-3.5 right-3.5 z-[60] p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/50 hover:text-white transition-all border border-white/[0.06]"
                aria-label="Close"
              >
                <X size={15} />
              </button>

              {/* Left: media */}
              <div className="relative lg:w-[58%] shrink-0 bg-black overflow-hidden lg:rounded-l-2xl">
                {/* Tab switcher */}
                {selectedProject.video_url && (
                  <div className="absolute top-3 left-3 z-50 flex gap-1 p-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/[0.08]">
                    <button
                      onClick={() => setActiveTab('gallery')}
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all ${
                        activeTab === 'gallery' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      Gallery
                    </button>
                    <button
                      onClick={() => setActiveTab('video')}
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all ${
                        activeTab === 'video' ? 'bg-white text-black' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      Video
                    </button>
                  </div>
                )}

                <div className="w-full h-full relative overflow-hidden bg-black">
                  {activeTab === 'video' && selectedProject.video_url ? (
                    <iframe
                      src={`${getEmbedUrl(selectedProject.video_url)}${getEmbedUrl(selectedProject.video_url).includes('?') ? '&' : '?'}rel=0&modestbranding=1&iv_load_policy=3`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <div
                        ref={carouselRef}
                        onScroll={handleScroll}
                        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {projectImages.length > 0 ? projectImages.map((url, i) => (
                          <div key={i} className="w-full h-full shrink-0 snap-center relative bg-black flex items-center justify-center">
                            <img src={url} className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-[0.15] scale-110" alt="" loading="lazy" />
                            <img src={url} className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain object-center" alt={`${selectedProject.title} ${i + 1}`} loading="lazy" />
                          </div>
                        )) : (
                          <div className="w-full h-full flex items-center justify-center text-white/45 text-sm">
                            No gallery images available
                          </div>
                        )}
                      </div>

                      {projectImages.length > 1 && (
                        <>
                          <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-white hover:text-black transition-all z-20 border border-white/[0.08]">
                            <ChevronLeft size={16} />
                          </button>
                          <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-white hover:text-black transition-all z-20 border border-white/[0.08]">
                            <ChevronRight size={16} />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                            {projectImages.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => scrollToImage(i)}
                                className={`h-[3px] rounded-full transition-all duration-300 ${currentImgIndex === i ? 'bg-white w-5' : 'bg-white/25 w-[5px]'}`}
                                aria-label={`Image ${i + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      <button
                        onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
                        className="absolute bottom-3 right-3 p-2 bg-black/50 text-white/70 rounded-full backdrop-blur-sm hover:bg-white hover:text-black transition-all z-20 border border-white/[0.08]"
                        aria-label="Fullscreen"
                      >
                        <Maximize2 size={13} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Right: details */}
              <div className="flex-1 min-w-0 overflow-y-auto flex flex-col p-7 lg:p-8" style={{ scrollbarWidth: 'none' }}>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 mb-2">
                    {selectedProject.category}
                  </p>
                  <h2 className="font-title text-2xl sm:text-[1.75rem] font-bold text-white leading-tight tracking-tight mb-5">
                    {selectedProject.title}
                  </h2>

                  <div className="h-px bg-white/[0.05] mb-5" />

                  <div className="space-y-5">
                    {selectedProject.description && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 mb-2">Overview</p>
                        <p className="text-[13px] text-white/55 leading-relaxed">{selectedProject.description}</p>
                      </div>
                    )}

                    {selectedProject.tech_stack && selectedProject.tech_stack.length > 0 && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25 mb-2">Tools</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.tech_stack.map((tech) => (
                            <span key={tech} className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.07] rounded-md text-[11px] text-white/45">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {(selectedProject.live_url || selectedProject.github_url) && (
                  <div className="mt-7 pt-5 border-t border-white/[0.05] flex flex-col gap-2">
                    {selectedProject.live_url && (
                      <a
                        href={selectedProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 bg-white text-black rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors"
                      >
                        View project <ExternalLink size={13} />
                      </a>
                    )}
                    {selectedProject.github_url && (
                      <a
                        href={selectedProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 bg-white/[0.04] border border-white/[0.07] text-white/60 rounded-xl font-semibold text-sm hover:bg-white/[0.08] hover:text-white transition-colors"
                      >
                        Source code <Github size={13} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lightbox stays in the dialog React subtree (not body) so Radix modal pointer-events still reach it */}
          <AnimatePresence>
            {isLightboxOpen && selectedProject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] isolate"
                role="presentation"
              >
                <div
                  className="absolute inset-0 bg-black/95 cursor-zoom-out"
                  onClick={() => setIsLightboxOpen(false)}
                  aria-hidden
                />

                <motion.img
                  key={currentImgIndex}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  src={projectImages[currentImgIndex]}
                  alt={`${selectedProject.title} — ${currentImgIndex + 1}`}
                  className="absolute inset-0 m-auto max-w-[90vw] max-h-[90vh] object-contain pointer-events-none"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(false);
                  }}
                  className="absolute top-5 right-5 z-20 p-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all duration-200 border border-white/20"
                  aria-label="Close fullscreen"
                >
                  <X size={16} />
                </button>

                {projectImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="absolute left-5 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all duration-200 border border-white/20 hover:scale-105"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="absolute right-5 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all duration-200 border border-white/20 hover:scale-105"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-[11px] text-white/50 pointer-events-none">
                      {currentImgIndex + 1} / {projectImages.length}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;
