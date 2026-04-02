import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Profile, BlogPost } from '../types';
import { Loader2, Calendar, Clock } from 'lucide-react';

const Blog: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, blogsRes] = await Promise.all([
          api.getProfile(),
          api.list<BlogPost>('blogs'),
        ]);

        setProfile(profileRes as unknown as Profile);
        setBlogs(blogsRes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="pt-32 pb-24 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-14 sm:mb-16">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5">
              Thoughts <span className="text-primary-500">& Insights.</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Practical ideas on motion, design, and technology, written to help teams create better digital experiences.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary-500" size={48} />
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {blogs.map((post) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="group cursor-pointer rounded-2xl border border-white/[0.07] bg-surface p-3 hover:border-primary-500/25 transition-colors duration-300"
                >
                  <div className="rounded-xl overflow-hidden mb-4 border border-white/10 relative bg-surface-raised aspect-[16/10]">
                    <img 
                      src={post.image_url || `https://picsum.photos/seed/${post.id}/800/450`} 
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.01]" 
                      alt={post.title} 
                    />
                  </div>
                  <div className="space-y-2.5 px-0.5 pb-0.5">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-primary-500 uppercase tracking-widest">
                      <span>{post.category}</span>
                      <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.read_time}</span>
                    </div>
                    <h2 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-primary-500 transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-slate-400 leading-relaxed line-clamp-2 text-xs sm:text-sm">{post.content}</p>
                    <div className="pt-1.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No articles published yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default Blog;
