
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, X, ChevronLeft, ChevronRight, Globe, LayoutGrid, Youtube, Maximize2, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';

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

  const projectImages = useMemo(() => {
    if (!selectedProject) return [];
    const gallery = selectedProject.gallery || [];
    const mainImg = selectedProject.image_url;
    const galleryUrls = gallery.map(g => g.image_url);
    
    if (mainImg && !galleryUrls.includes(mainImg)) {
      return [mainImg, ...galleryUrls];
    }
    return galleryUrls.length > 0 ? galleryUrls : [mainImg];
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      setActiveTab(selectedProject.gallery_type === 'video' ? 'video' : 'gallery');
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
    <section id="projects" className="py-section bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div>
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
              className="font-display text-display-xl font-bold text-white tracking-tight"
            >
              Featured work
            </motion.h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 border ${
                  filter === cat
                    ? 'bg-primary-500 text-black border-primary-500'
                    : 'bg-surface text-slate-500 border-white/[0.06] hover:border-white/15 hover:text-slate-300'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                onClick={() => {
                  setSelectedProject(project);
                  setCurrentImgIndex(0);
                }}
                className="group cursor-pointer bg-surface border border-white/[0.06] rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all duration-500 relative aspect-[4/3]"
              >
                <div className="w-full h-full overflow-hidden bg-surface-elevated">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-400 space-y-3">
                    <span className="text-[10px] font-semibold uppercase text-primary-500 tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-white leading-tight">{project.title}</h3>
                    <div className="pt-2 flex items-center gap-2 text-primary-500 text-[11px] font-semibold uppercase tracking-wider">
                      View project <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {isHomePage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 flex flex-wrap gap-4 justify-center md:justify-end"
          >
            {hasMore && (
              <button
                onClick={() => navigate('/portfolio')}
                className="group px-6 py-3 bg-surface border border-white/10 text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:border-primary-500/40 hover:text-primary-500 transition-all"
              >
                View all projects <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-primary-500 text-black rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-primary-400 transition-colors shadow-glow"
            >
              Start a project <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-xl md:backdrop-blur-3xl p-4 md:p-8 lg:p-12 overflow-y-auto custom-scrollbar"
          >
             <motion.div 
               initial={{ y: 50, scale: 0.95 }} 
               animate={{ y: 0, scale: 1 }} 
               className="w-full max-w-6xl bg-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] my-auto relative will-change-transform"
             >
                {/* Close Button - Moved slightly and increased contrast for mobile */}
                <button 
                  onClick={closeModals} 
                  className="absolute top-6 right-6 md:top-8 md:right-8 p-4 bg-black/60 text-white rounded-full hover:bg-primary-500 hover:text-black transition-all z-[300] shadow-2xl backdrop-blur-md md:backdrop-blur-xl border border-white/10"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col lg:flex-row items-stretch min-h-[600px]">
                   {/* Left side: Media */}
                   <div className="w-full lg:w-[60%] bg-black relative group/media overflow-hidden border-r border-white/5 flex items-center justify-center min-h-[400px]">
                      {activeTab === 'video' && selectedProject.video_url ? (
                        <div className="w-full h-full aspect-video flex items-center justify-center">
                          <iframe 
                            src={getEmbedUrl(selectedProject.video_url)} 
                            className="w-full h-full" 
                            frameBorder="0" 
                            allow="autoplay; fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen 
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full relative">
                          <div 
                            ref={carouselRef}
                            onScroll={handleScroll}
                            className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth custom-scrollbar-hide"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                          >
                             {projectImages.map((url, i) => (
                               <div key={i} className="w-full h-full shrink-0 snap-center flex items-center justify-center bg-black relative">
                                  <img src={url} className="absolute inset-0 w-full h-full object-cover blur-xl md:blur-3xl opacity-20 scale-110" alt="blur" loading="lazy" />
                                  <img src={url} className="relative z-10 max-w-full max-h-full object-contain" alt={`${selectedProject.title} ${i}`} loading="lazy" />
                               </div>
                             ))}
                          </div>

                          {projectImages.length > 1 && (
                            <>
                              <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-black/40 text-white rounded-full backdrop-blur-md lg:opacity-0 lg:group-hover/media:opacity-100 transition-all hover:bg-primary-500 hover:text-black z-20">
                                <ChevronLeft size={24} />
                              </button>
                              <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-black/40 text-white rounded-full backdrop-blur-md lg:opacity-0 lg:group-hover/media:opacity-100 transition-all hover:bg-primary-500 hover:text-black z-20">
                                <ChevronRight size={24} />
                              </button>
                              
                              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                                {projectImages.map((_, i) => (
                                  <button key={i} onClick={() => scrollToImage(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${currentImgIndex === i ? 'bg-primary-500 w-8' : 'bg-white/20'}`} />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* View Toggles */}
                      <div className="absolute top-6 left-6 md:top-10 md:left-10 flex gap-2 z-40">
                        {selectedProject.video_url && (
                          <>
                            <button 
                              onClick={() => setActiveTab('gallery')} 
                              className={`p-3 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'gallery' ? 'bg-primary-500 text-black' : 'bg-black/60 text-white hover:bg-black/80 backdrop-blur-md border border-white/10'}`}
                            >
                              <ImageIcon size={14} /> Gallery
                            </button>
                            <button 
                              onClick={() => setActiveTab('video')} 
                              className={`p-3 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'video' ? 'bg-primary-500 text-black' : 'bg-black/60 text-white hover:bg-black/80 backdrop-blur-md border border-white/10'}`}
                            >
                              <Youtube size={14} /> Video
                            </button>
                          </>
                        )}
                      </div>

                      {/* Full Screen Button (Maximize) - Fixed visibility for mobile */}
                      {activeTab === 'gallery' && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsLightboxOpen(true);
                          }}
                          className="absolute bottom-6 right-6 md:top-10 md:right-10 md:bottom-auto p-4 bg-black/60 text-white rounded-full backdrop-blur-md transition-all hover:bg-primary-500 hover:text-black z-40 border border-white/10 pointer-events-auto"
                        >
                          <Maximize2 size={18} />
                        </button>
                      )}
                   </div>

                   {/* Right side: Info */}
                   <div className="w-full lg:w-[40%] p-10 md:p-14 overflow-y-auto custom-scrollbar flex flex-col">
                      <div className="flex-1">
                        <div className="inline-block px-3 py-1 rounded-md bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-black uppercase tracking-widest mb-6">
                           {selectedProject.category}
                        </div>
                        <h2 className="text-4xl font-black text-white leading-tight mb-8 tracking-tighter">
                          {selectedProject.title}
                        </h2>
                        
                        <div className="space-y-8 mb-12">
                           <div>
                              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Overview</h4>
                              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                {selectedProject.description}
                              </p>
                           </div>

                           {selectedProject.tech_stack && selectedProject.tech_stack.length > 0 && (
                              <div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Core Stack</h4>
                                <div className="flex flex-wrap gap-2">
                                   {selectedProject.tech_stack.map(tech => (
                                     <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-slate-400">
                                       {tech}
                                     </span>
                                   ))}
                                </div>
                              </div>
                           )}

                           {/* Gallery Thumbnails */}
                           {projectImages.length > 1 && (
                             <div>
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Gallery Thumbnails</h4>
                                <div className="grid grid-cols-4 gap-3">
                                   {projectImages.map((img, i) => (
                                      <button 
                                        key={i} 
                                        onClick={() => {
                                          setActiveTab('gallery');
                                          scrollToImage(i);
                                        }}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${currentImgIndex === i ? 'border-primary-500' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                      >
                                         <img src={img} className="w-full h-full object-cover" alt="thumb" />
                                      </button>
                                   ))}
                                </div>
                             </div>
                           )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-10 border-t border-white/5">
                         {selectedProject.live_url && (
                           <a 
                             href={selectedProject.live_url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center justify-center gap-3 py-5 bg-primary-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] transition-transform"
                           >
                             Visit Live <ExternalLink size={14} />
                           </a>
                         )}
                         {selectedProject.github_url && (
                           <a 
                             href={selectedProject.github_url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center justify-center gap-3 py-5 bg-white/5 border border-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                           >
                             Source Code <Github size={14} />
                           </a>
                         )}
                      </div>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox / Fullscreen Image */}
      <AnimatePresence>
        {isLightboxOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/98 flex flex-col items-center justify-center p-6"
          >
             {/* Full Screen Close Button */}
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 setIsLightboxOpen(false);
               }}
               className="absolute top-10 right-10 p-5 bg-black/60 text-white rounded-full hover:bg-primary-500 hover:text-black transition-all z-[350] border border-white/10 pointer-events-auto shadow-2xl backdrop-blur-xl"
             >
               <X size={24} />
             </button>

             <div className="relative w-full h-full flex items-center justify-center group/lightbox z-10">
                {projectImages.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                      className="absolute left-6 md:left-10 p-6 bg-black/40 text-white rounded-full hover:bg-primary-500 hover:text-black transition-all z-[320] pointer-events-auto backdrop-blur-md"
                    >
                      <ChevronLeft size={32} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      className="absolute right-6 md:right-10 p-6 bg-black/40 text-white rounded-full hover:bg-primary-500 hover:text-black transition-all z-[320] pointer-events-auto backdrop-blur-md"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </>
                )}

                <motion.img 
                  key={currentImgIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={projectImages[currentImgIndex]} 
                  className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(0,208,132,0.1)] relative z-[310]" 
                  onClick={(e) => e.stopPropagation()}
                />

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/60 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-white backdrop-blur-md z-[320]">
                   {currentImgIndex + 1} / {projectImages.length}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
