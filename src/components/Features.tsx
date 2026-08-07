import { useEffect, useRef, useState } from "react";
import { Shield, Clock, Award, Briefcase, Mail, Phone, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { translate } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          entry.target.classList.add("active");
          setHasAnimated(true);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [hasAnimated]);

  const featureItems = [
    { icon: Shield, title: translate("features.reliability.title"), description: translate("features.reliability.description") },
    { icon: Clock, title: translate("features.timeSaving.title"), description: translate("features.timeSaving.description") },
    { icon: Award, title: translate("features.professional.title"), description: translate("features.professional.description") },
    { icon: Briefcase, title: translate("features.flexibility.title"), description: translate("features.flexibility.description") },
    { icon: Mail, title: translate("features.mailPackages.title"), description: translate("features.mailPackages.description") },
    { icon: Phone, title: translate("features.reception.title"), description: translate("features.reception.description") },
  ];

  return (
    <section
      id="voordelen"
      className="relative py-24 md:py-32 bg-white overflow-hidden"
      ref={sectionRef}
    >
      {/* Soft transition from the dark hero into the light body */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950 to-white pointer-events-none" />
      {/* Barely-there blue haze so the section is not flat */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-blue-500/[0.04] blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-6 reveal">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-slate-100 border border-slate-200">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-600">{translate("features.title")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
            {translate("features.subtitle")}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {translate("features.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureItems.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-6 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

};

export default Features;
