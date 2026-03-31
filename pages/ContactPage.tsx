
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { api } from '../lib/api';
import { Profile } from '../types';

const ContactPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    api.getProfile().then(data => setProfile(data as unknown as Profile)).catch(() => {});
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="pt-28">
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default ContactPage;
