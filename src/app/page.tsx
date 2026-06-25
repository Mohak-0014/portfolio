import SceneCanvas from "@/components/canvas/SceneCanvas";
import Navbar from "@/components/ui/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Projects from "@/sections/Projects";
import Skills from "@/sections/Skills";
import Hobbies from "@/sections/Hobbies";
import Sidequests from "@/sections/Sidequests";
import BlogPreview from "@/sections/BlogPreview";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <>
      {/* fixed WebGL world behind everything */}
      <SceneCanvas />

      <Navbar />
      <ScrollProgress />

      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Hobbies />
        <Sidequests />
        {/* Server component — async data fetch */}
        <BlogPreview />
        <Contact />
      </main>
    </>
  );
}
