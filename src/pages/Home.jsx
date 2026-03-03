import React from 'react';
import Hero from '../components/Hero';
import DiscoverSection from '../components/DiscoverSection';
import TestimonialsSection from '../components/TestimonialsSection';
import AwardsSection from '../components/AwardsSection';
import ContactSection from '../components/ContactSection';

export default function Home() {
  return (
    <div>
      <Hero />
      <DiscoverSection />
      <TestimonialsSection />
      <AwardsSection />
      <ContactSection />
    </div>
  );
}
