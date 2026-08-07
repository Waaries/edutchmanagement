
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { updateMetaTags, pageSEO } from "@/lib/seo";

const CookiePolicy = () => {
  useEffect(() => {
    updateMetaTags(pageSEO.cookiePolicy);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <main className="relative flex-grow overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="relative container mx-auto px-4 py-32 max-w-4xl">
          <p className="mb-3 inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-sm text-blue-300">
            Juridisch
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-8">Cookiebeleid</h1>

          <Section title="Wat zijn cookies?">
            <p>
              Cookies zijn kleine tekstbestanden die bij uw bezoek aan onze website worden opgeslagen op uw computer,
              tablet of smartphone. Deze tekstbestanden bevatten informatie die bij een volgend bezoek weer door de
              website kan worden herkend.
            </p>
          </Section>

          <Section title="Welke cookies gebruiken wij?">
            <h3 className="text-xl font-bold text-white">Essentiële cookies</h3>
            <p>
              Deze cookies zijn noodzakelijk voor het functioneren van de website. Zonder deze cookies kunnen bepaalde
              onderdelen niet worden gebruikt. Deze cookies verzamelen geen informatie over u die gebruikt kan worden
              voor marketing of om te onthouden welke websites u hebt bezocht.
            </p>

            <h3 className="text-xl font-bold text-white">Analytische cookies</h3>
            <p>
              Deze cookies verzamelen informatie over het gedrag van websitebezoekers, zoals welke pagina's het meest
              worden bezocht en of bezoekers foutmeldingen ontvangen. Deze cookies verzamelen geen informatie die
              bezoekers kan identificeren. Alle informatie die deze cookies verzamelen, is anoniem en wordt alleen
              gebruikt om de werking van de website te verbeteren.
            </p>

            <h3 className="text-xl font-bold text-white">Marketing cookies</h3>
            <p>
              Deze cookies worden gebruikt om advertenties beter op u en uw interesses af te stemmen. Ze worden ook
              gebruikt om het aantal keren dat u een advertentie ziet te beperken en om de effectiviteit van
              reclamecampagnes te meten. Ze onthouden dat u een website hebt bezocht en deze informatie kan worden
              gedeeld met andere organisaties, zoals adverteerders.
            </p>
          </Section>

          <Section title="Cookie-instellingen aanpassen">
            <p>
              U kunt uw voorkeuren voor cookies op elk moment aanpassen. Bij uw eerste bezoek aan onze website
              hebt u de mogelijkheid om bepaalde cookies te accepteren of te weigeren. U kunt deze instellingen
              later wijzigen door uw browserinstellingen aan te passen om cookies te weigeren of te verwijderen.
            </p>
            <p>Let op: het blokkeren van cookies kan invloed hebben op de functionaliteit van onze website.</p>
          </Section>

          <Section title="Contact">
            <p>
              Als u vragen heeft over ons cookiebeleid, neem dan contact met ons op via: <br />
              <a href="mailto:info@edutchmanagement.nl">info@edutchmanagement.nl</a>
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );

};

export default CookiePolicy;
