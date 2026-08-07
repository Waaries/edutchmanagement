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
      className="relative py-24 md:py-32 bg-slate-50 overflow-hidden border-t border-slate-200"
      ref={sectionRef}
    >
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/[0.04] blur-[140px] pointer-events-none" />

      <div className="relative container mx-auto px-6 reveal">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-slate-100 border border-slate-200">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-600">{translate("services.title")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
            {translate("services.subtitle")}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {translate("services.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl transition-all duration-500 animate-fade-in flex flex-col ${
                service.mostPopular
                  ? "bg-white border-2 border-brand shadow-xl shadow-brand/15 lg:scale-[1.03]"
                  : "bg-white border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {service.mostPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand text-brand-foreground text-xs font-semibold tracking-wide uppercase shadow-lg shadow-brand/30">
                  {service.mostPopularText}
                </div>
              )}
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {service.price}
                  </span>
                  <span className="text-slate-500 mb-2 text-sm">{service.period}</span>
                </div>
                <p className="text-slate-600 mb-8 leading-relaxed">{service.description}</p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {service.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(service.planType)}
                  className={`w-full group/btn transition-all duration-300 ${
                    service.mostPopular
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 hover:border-slate-300"
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
          <p className="text-slate-600 mb-4">{translate("services.customNeeds")}</p>
          <Button
            variant="outline"
            className="bg-white border-slate-300 text-slate-900 hover:bg-slate-100 hover:border-blue-400"
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
