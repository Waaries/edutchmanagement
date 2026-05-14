import { useState, useEffect, useRef } from "react";
import { ArrowRight, Building, MapPin, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackButtonClick } from "@/lib/analytics";
import heroOffice from "@/assets/hero-office.jpg";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguage();

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      trackButtonClick(`scroll_to_${sectionId}`, 'hero_section');
    }
  };

  const rawTitle = translate("hero.title");
  const highlightWord = rawTitle.includes("professionele")
    ? "professionele"
    : rawTitle.includes("professional")
      ? "professional"
      : null;
  const titleParts = highlightWord ? rawTitle.split(highlightWord) : [rawTitle, ""];

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative pt-28 pb-12 px-0 bg-slate-950 overflow-hidden"
    >
      <div className="relative w-full bg-slate-950 overflow-hidden">
        {/* Decorative glows */}
        <div
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-900/40 blur-3xl pointer-events-none"
          style={{ transform: `translateY(${scrollY * -0.08}px)` }}
        />

        <div className="relative grid gap-12 px-6 pt-14 pb-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-14 lg:pt-20 lg:pb-24 max-w-7xl mx-auto">
          {/* Left content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="mb-6 inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold tracking-wider text-blue-400 uppercase border border-blue-500/20">
              {translate("hero.premium")}
            </div>
            <h1 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white">
              {titleParts[0]}
              {highlightWord && <span className="text-blue-500">{highlightWord}</span>}
              {titleParts[1]}
            </h1>
            <p className="mb-6 max-w-xl text-lg leading-relaxed text-slate-300">
              {translate("hero.subtitle")}
            </p>
            <p className="mb-10 max-w-xl text-base leading-relaxed text-slate-400">
              {translate("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('diensten')}
                className="group inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30"
              >
                <span>{translate("hero.discoverBtn")}</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="rounded-xl border border-slate-700 bg-slate-900/50 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-slate-800"
              >
                {translate("hero.contactBtn")}
              </button>
            </div>
          </div>

          {/* Right visual */}
          <div
            className={`relative flex justify-center lg:justify-end transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transform: `translateY(${scrollY * -0.04}px)` }}
          >
            <div className="relative h-[440px] sm:h-[480px] w-full max-w-[400px] rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-1 backdrop-blur-xl shadow-2xl">
              <div className="h-full w-full overflow-hidden rounded-[22px] bg-slate-900/40 p-8 flex flex-col justify-end relative">
                <div className="absolute top-8 left-8 right-8 h-56 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
                  <img
                    src={heroOffice}
                    alt="Premium Amsterdam business location"
                    width={896}
                    height={1024}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                </div>

                <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-500/40">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {translate("hero.premium")}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {translate("hero.premiumDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom features */}
        <div className="relative border-t border-white/5 bg-slate-950/50 px-6 py-10 lg:px-14">
          <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
            {[
              { icon: Building, title: translate("hero.features.address.title"), desc: translate("hero.features.address.desc") },
              { icon: MapPin, title: translate("hero.features.management.title"), desc: translate("hero.features.management.desc") },
              { icon: Mail, title: translate("hero.features.mail.title"), desc: translate("hero.features.mail.desc") },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
