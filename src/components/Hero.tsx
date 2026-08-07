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
      className="relative pt-28 pb-12 px-0 bg-white overflow-hidden"
    >
      <div className="relative w-full bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
        {/* Decorative glows */}
        <div
          className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-blue-200/40 blur-[120px] pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute -bottom-32 -left-32 h-[520px] w-[520px] rounded-full bg-indigo-100/60 blur-[120px] pointer-events-none"
          style={{ transform: `translateY(${scrollY * -0.08}px)` }}
        />

        <div className="relative grid gap-12 px-6 pt-14 pb-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-14 lg:pt-20 lg:pb-24 max-w-7xl mx-auto">
          {/* Left content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="mb-6 inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-bold tracking-wider text-brand-strong uppercase border border-brand/20">
              {translate("hero.premium")}
            </div>
            <h1 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-slate-900">
              {titleParts[0]}
              {highlightWord && <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{highlightWord}</span>}
              {titleParts[1]}
            </h1>
            <p className="mb-6 max-w-xl text-lg leading-relaxed text-slate-600">
              {translate("hero.subtitle")}
            </p>
            <p className="mb-10 max-w-xl text-base leading-relaxed text-slate-500">
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
                className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-sm font-bold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900"
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
            <div className="relative h-[440px] sm:h-[480px] w-full max-w-[400px] rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-1 shadow-xl shadow-slate-900/10">
              <div className="h-full w-full overflow-hidden rounded-[22px] bg-white p-8 flex flex-col justify-end relative">
                <div className="absolute top-8 left-8 right-8 h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-lg shadow-slate-900/10">
                  <img
                    src={heroOffice}
                    alt="Premium Amsterdam business location"
                    width={896}
                    height={1024}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                </div>

                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand shadow-lg shadow-brand/30">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">
                    {translate("hero.premium")}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {translate("hero.premiumDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom features */}
        <div className="relative border-t border-slate-200 bg-slate-50/80 px-6 py-10 lg:px-14">
          <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
            {[
              { icon: Building, title: translate("hero.features.address.title"), desc: translate("hero.features.address.desc") },
              { icon: MapPin, title: translate("hero.features.management.title"), desc: translate("hero.features.management.desc") },
              { icon: Mail, title: translate("hero.features.mail.title"), desc: translate("hero.features.mail.desc") },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
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
