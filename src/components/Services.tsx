import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { translate } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          entry.target.classList.add("active");
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [hasAnimated]);

  const services = [
    {
      title: translate("services.basic.title"),
      price: translate("services.basic.price"),
      period: translate("services.basic.period"),
      description: translate("services.basic.description"),
      features: translate("services.basic.features") as unknown as string[],
      mostPopular: false,
      planType: "basic",
    },
    {
      title: translate("services.premium.title"),
      price: translate("services.premium.price"),
      period: translate("services.premium.period"),
      description: translate("services.premium.description"),
      features: translate("services.premium.features") as unknown as string[],
      mostPopular: true,
      mostPopularText: translate("services.premium.mostPopular"),
      planType: "premium",
    },
    {
      title: translate("services.complete.title"),
      price: translate("services.complete.price"),
      period: translate("services.complete.period"),
      description: translate("services.complete.description"),
      features: translate("services.complete.features") as unknown as string[],
      mostPopular: false,
      planType: "complete",
    },
  ];

  const handleSelectPlan = (planType: string) => {
    navigate(`/aanvragen?plan=${planType}`);
  };

  return (
    <section
      id="diensten"
      className="relative py-24 md:py-32 bg-slate-950 overflow-hidden border-t border-white/5"
      ref={sectionRef}
    >
      {/* Premium glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-indigo-900/30 blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-6 reveal">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">{translate("services.title")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            {translate("services.subtitle")}
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            {translate("services.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl backdrop-blur-sm transition-all duration-500 animate-fade-in flex flex-col ${
                service.mostPopular
                  ? "bg-gradient-to-br from-blue-600/20 to-indigo-900/30 border border-blue-500/40 shadow-2xl shadow-blue-500/20 lg:scale-[1.03]"
                  : "bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-blue-500/30"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {service.mostPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold tracking-wide uppercase shadow-lg shadow-blue-500/40">
                  {service.mostPopularText}
                </div>
              )}
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    {service.price}
                  </span>
                  <span className="text-slate-400 mb-2 text-sm">{service.period}</span>
                </div>
                <p className="text-slate-400 mb-8 leading-relaxed">{service.description}</p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {service.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-blue-400" />
                      </div>
                      <span className="text-slate-300 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(service.planType)}
                  className={`w-full group/btn transition-all duration-300 ${
                    service.mostPopular
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20"
                  }`}
                >
                  <span>{translate("services.selectPlan")}</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in">
          <p className="text-slate-400 mb-4">{translate("services.customNeeds")}</p>
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
            onClick={() => navigate("/aanvragen")}
          >
            {translate("services.customBtn")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
