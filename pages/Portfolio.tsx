
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import { api } from '../lib/api';
import { Profile, Project } from '../types';

const Portfolio: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, projsWithGallery] = await Promise.all([
          api.getProfile(),
          api.list<Project>('projects'),
        ]);

        setProfile(p as unknown as Profile);

        if (projsWithGallery) {
          setProjects(projsWithGallery);
        }
      } catch (err) {
        console.error("Portfolio fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="pt-28">
        <Projects projects={projects} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default Portfolio;
