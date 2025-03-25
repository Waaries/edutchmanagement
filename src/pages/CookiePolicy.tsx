
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CookiePolicy = () => {
  useEffect(() => {
    document.title = "Cookiebeleid | eDutch Management";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 font-['Montserrat',sans-serif]">Cookiebeleid</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-['Montserrat',sans-serif]">Wat zijn cookies?</h2>
          <p className="mb-4">
            Cookies zijn kleine tekstbestanden die bij uw bezoek aan onze website worden opgeslagen op uw computer, 
            tablet of smartphone. Deze tekstbestanden bevatten informatie die bij een volgend bezoek weer door de 
            website kan worden herkend.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-['Montserrat',sans-serif]">Welke cookies gebruiken wij?</h2>
          
          <h3 className="text-xl font-bold mt-6 mb-2 font-['Montserrat',sans-serif]">Essentiële cookies</h3>
          <p className="mb-4">
            Deze cookies zijn noodzakelijk voor het functioneren van de website. Zonder deze cookies kunnen bepaalde 
            onderdelen niet worden gebruikt. Deze cookies verzamelen geen informatie over u die gebruikt kan worden 
            voor marketing of om te onthouden welke websites u hebt bezocht.
          </p>
          
          <h3 className="text-xl font-bold mt-6 mb-2 font-['Montserrat',sans-serif]">Analytische cookies</h3>
          <p className="mb-4">
            Deze cookies verzamelen informatie over het gedrag van websitebezoekers, zoals welke pagina's het meest 
            worden bezocht en of bezoekers foutmeldingen ontvangen. Deze cookies verzamelen geen informatie die 
            bezoekers kan identificeren. Alle informatie die deze cookies verzamelen, is anoniem en wordt alleen 
            gebruikt om de werking van de website te verbeteren.
          </p>
          
          <h3 className="text-xl font-bold mt-6 mb-2 font-['Montserrat',sans-serif]">Marketing cookies</h3>
          <p className="mb-4">
            Deze cookies worden gebruikt om advertenties beter op u en uw interesses af te stemmen. Ze worden ook 
            gebruikt om het aantal keren dat u een advertentie ziet te beperken en om de effectiviteit van 
            reclamecampagnes te meten. Ze onthouden dat u een website hebt bezocht en deze informatie kan worden 
            gedeeld met andere organisaties, zoals adverteerders.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 font-['Montserrat',sans-serif]">Cookie-instellingen aanpassen</h2>
          <p className="mb-4">
            U kunt uw voorkeuren voor cookies op elk moment aanpassen. Bij uw eerste bezoek aan onze website 
            hebt u de mogelijkheid om bepaalde cookies te accepteren of te weigeren. U kunt deze instellingen 
            later wijzigen door uw browserinstellingen aan te passen om cookies te weigeren of te verwijderen.
          </p>
          <p className="mb-4">
            Let op: het blokkeren van cookies kan invloed hebben op de functionaliteit van onze website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 font-['Montserrat',sans-serif]">Contact</h2>
          <p className="mb-4">
            Als u vragen heeft over ons cookiebeleid, neem dan contact met ons op via: <br />
            <a href="mailto:info@edutchmanagement.nl" className="text-[#F97316] hover:underline">
              info@edutchmanagement.nl
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
