import { useEffect, useState } from "react";
import HeroSearch from "@/components/home/HeroSearch";
import FeaturedGrid from "@/components/home/FeaturedGrid";
import HomeAgents from "@/components/home/HomeAgents";
import HomeContact from "@/components/home/HomeContact";
import Services from "@/components/home/Services";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getFeaturedProperties, getTestimonials, getAgents } from "@/lib/supabase/data";
import type { Property, Testimonial, Agent } from "@/lib/supabase/queries";

export default function Home() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    getFeaturedProperties().then(setFeatured);
    getTestimonials().then(setTestimonials);
    getAgents().then(setAgents);
  }, []);

  return (
    <>
      <HeroSearch />
      <AnimatedSection>
        <FeaturedGrid properties={featured} />
      </AnimatedSection>
      <AnimatedSection direction="fade">
        <HomeAgents agents={agents} />
      </AnimatedSection>
      <AnimatedSection>
        <HomeContact />
      </AnimatedSection>
      <AnimatedSection direction="fade">
        <Services />
      </AnimatedSection>
      <Stats />
      <AnimatedSection>
        <Testimonials testimonials={testimonials} />
      </AnimatedSection>
      <AnimatedSection direction="fade">
        <CTA />
      </AnimatedSection>
    </>
  );
}
