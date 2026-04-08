
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Services from '../components/Services';
import Pricing from '../components/Pricing';
import WhyChooseMe from '../components/WhyChooseMe';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { api } from '../lib/api';
import { Profile, Skill, Project, SocialLink, Service, PricingPackage, Testimonial, WhyChooseMe as WhyChooseMeType } from '../types';

const Home: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>([]);
  const [whyChooseMe, setWhyChooseMe] = useState<WhyChooseMeType[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const featuredProjects = projects.filter((project) => project.isFeatured ?? project.featured);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prof, sk, proj, soc, serv, why, test] = await Promise.all([
          api.getProfile(),
          api.list<Skill>('skills'),
          api.list<Project>('projects'),
          api.list<SocialLink>('social_links'),
          api.list<Service>('services'),
          api.list<WhyChooseMeType>('why_choose_me'),
          api.list<Testimonial>('testimonials'),
        ]);

        let pricing: PricingPackage[] = [];
        try {
          pricing = await api.list<PricingPackage>('pricing_packages');
        } catch {
          /* table or route not deployed yet — hide pricing section */
        }

        setProfile(prof as unknown as Profile);
        setSkills(sk);
        setSocials(soc);
        setServices(serv);
        setPricingPackages(pricing);
        setWhyChooseMe(why);
        setTestimonials(test);
        // projects already include gallery from backend
        setProjects(proj);
      } catch (err) {
        console.error("Critical Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary-500">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-background overflow-hidden scroll-smooth min-h-screen">
      <Navbar />
      <Hero profile={profile} socials={socials} />
      <Skills skills={skills} />
      {services.length > 0 && <Services services={services} />}
      {pricingPackages.length > 0 && <Pricing packages={pricingPackages} />}
      {featuredProjects.length > 0 && <Projects projects={featuredProjects} isHomePage={true} />}
      {testimonials.length > 0 && <Testimonials testimonials={testimonials} />}
      {whyChooseMe.length > 0 && <WhyChooseMe items={whyChooseMe} />}
      <Contact profile={profile} />
      <Footer profile={profile} />
    </div>
  );
};

// Helper Loader for loading state
const Loader2: React.FC<{className?: string, size?: number}> = ({className, size}) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default Home;
