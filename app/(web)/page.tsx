import { CTA } from "@/components/landing/CTA";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Testimonials } from "@/components/landing/Testimonials";
import { TopSprites } from "@/components/landing/TopSprites";

export default async function Home() {


  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <TopSprites  />
      <Testimonials />
      <CTA />
    </main>
  );
}
