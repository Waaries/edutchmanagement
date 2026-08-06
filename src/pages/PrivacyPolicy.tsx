import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { updateMetaTags, pageSEO } from "@/lib/seo";

const LAST_UPDATED = "6 augustus 2026";
const LAST_UPDATED_EN = "6 August 2026";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 md:p-8 backdrop-blur-sm">
    <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
    <div className="space-y-4 text-slate-300 leading-relaxed [&_a]:text-blue-400 [&_a:hover]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2">
      {children}
    </div>
  </section>
);

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const nl = language === "nl";

  useEffect(() => {
    updateMetaTags(pageSEO.privacy);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <main className="relative flex-grow overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="relative container mx-auto max-w-4xl px-4 py-32">
          <p className="mb-3 inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-sm text-blue-300">
            {nl ? "Juridisch" : "Legal"}
          </p>
          <h1 className="mb-3 text-4xl font-bold text-white">
            {nl ? "Privacybeleid" : "Privacy Policy"}
          </h1>
          <p className="mb-6 text-slate-400">
            {nl ? `Laatst bijgewerkt: ${LAST_UPDATED}` : `Last updated: ${LAST_UPDATED_EN}`}
          </p>

          <div className="mb-10 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            {nl
              ? "Let op: deze tekst is een concept. Laat het privacybeleid juridisch toetsen voordat het definitief live gaat."
              : "Please note: this text is a draft. Have this privacy policy reviewed by a legal professional before it goes live definitively."}
          </div>

          <Section title={nl ? "1. Verwerkingsverantwoordelijke" : "1. Data controller"}>
            <p>
              {nl
                ? "De verwerkingsverantwoordelijke voor de verwerking van uw persoonsgegevens is:"
                : "The controller responsible for processing your personal data is:"}
            </p>
            <p className="text-white">
              eDutch Management B.V.
              <br />
              Reigersbos 100 P, 1107 ES Amsterdam
              <br />
              KvK: 95218556
              <br />
              <a href="mailto:info@edutchmanagement.nl">info@edutchmanagement.nl</a>
              <br />
              +31 (0)20 737 03 85
            </p>
          </Section>

          <Section title={nl ? "2. Welke persoonsgegevens verwerken wij?" : "2. What personal data do we process?"}>
            <p>
              {nl
                ? "Wij verwerken de gegevens die u zelf aan ons verstrekt en gegevens die automatisch worden vastgelegd bij het gebruik van onze website:"
                : "We process the data you provide to us as well as data recorded automatically when you use our website:"}
            </p>
            <ul>
              <li>{nl ? "Naam en contactpersoon" : "Name and contact person"}</li>
              <li>{nl ? "E-mailadres" : "Email address"}</li>
              <li>{nl ? "Telefoonnummer" : "Telephone number"}</li>
              <li>{nl ? "Bedrijfsnaam" : "Company name"}</li>
              <li>{nl ? "KvK-nummer" : "Chamber of Commerce (KvK) number"}</li>
              <li>{nl ? "Adresgegevens" : "Address details"}</li>
              <li>{nl ? "IP-adres en technische gegevens over uw bezoek" : "IP address and technical data about your visit"}</li>
            </ul>
          </Section>

          <Section title={nl ? "3. Doeleinden en grondslagen" : "3. Purposes and legal bases"}>
            <ul>
              <li>
                <strong className="text-white">{nl ? "Uitvoering van de overeenkomst" : "Performance of the contract"}</strong>
                {nl
                  ? " — het leveren van het bedrijfsadres, postontvangst, doorsturen van post en klantenservice."
                  : " — providing the business address, mail reception, mail forwarding and customer support."}
              </li>
              <li>
                <strong className="text-white">{nl ? "Wettelijke verplichting" : "Legal obligation"}</strong>
                {nl
                  ? " — identificatie en cliëntenonderzoek op grond van de Wwft, inschrijvings- en bewaarplichten richting de Kamer van Koophandel en de Belastingdienst."
                  : " — identification and client due diligence under the Dutch Anti-Money Laundering Act (Wwft), and registration and retention obligations towards the Chamber of Commerce and the tax authorities."}
              </li>
              <li>
                <strong className="text-white">{nl ? "Gerechtvaardigd belang" : "Legitimate interest"}</strong>
                {nl
                  ? " — beveiliging van onze website en dienstverlening, fraudepreventie en het verbeteren van onze diensten."
                  : " — securing our website and services, fraud prevention and improving our services."}
              </li>
              <li>
                <strong className="text-white">{nl ? "Toestemming" : "Consent"}</strong>
                {nl
                  ? " — het plaatsen van analytische en marketingcookies (Google Analytics). U kunt uw toestemming te allen tijde intrekken."
                  : " — placing analytics and marketing cookies (Google Analytics). You may withdraw your consent at any time."}
              </li>
            </ul>
          </Section>

          <Section title={nl ? "4. Ontvangers en verwerkers" : "4. Recipients and processors"}>
            <p>
              {nl
                ? "Wij schakelen dienstverleners in die als verwerker persoonsgegevens voor ons verwerken. Met deze partijen sluiten wij verwerkersovereenkomsten."
                : "We engage service providers who process personal data on our behalf as processors. We enter into data processing agreements with these parties."}
            </p>
            <ul>
              <li>{nl ? "Supabase — hosting van onze database en applicatie" : "Supabase — hosting of our database and application"}</li>
              <li>{nl ? "Google Analytics — websitestatistieken (alleen met uw toestemming, met IP-anonimisering)" : "Google Analytics — website statistics (only with your consent, with IP anonymisation)"}</li>
              <li>{nl ? "E-mail- en postdienstverleners voor het bezorgen en doorsturen van correspondentie" : "Email and postal service providers for delivering and forwarding correspondence"}</li>
            </ul>
            <p>
              {nl
                ? "Daarnaast kunnen wij gegevens verstrekken aan overheidsinstanties wanneer wij daartoe wettelijk verplicht zijn."
                : "In addition, we may disclose data to government authorities where we are legally required to do so."}
            </p>
          </Section>

          <Section title={nl ? "5. Bewaartermijnen" : "5. Retention periods"}>
            <ul>
              <li>
                {nl
                  ? "Administratieve en fiscale gegevens: 7 jaar (wettelijke bewaarplicht Belastingdienst)."
                  : "Administrative and tax data: 7 years (statutory retention obligation)."}
              </li>
              <li>
                {nl
                  ? "Identificatiegegevens in het kader van de Wwft: 5 jaar na afloop van de overeenkomst."
                  : "Identification data under the Wwft: 5 years after the end of the agreement."}
              </li>
              <li>
                {nl
                  ? "Contactformulier- en aanvraaggegevens zonder vervolg: maximaal 12 maanden."
                  : "Contact form and request data without follow-up: a maximum of 12 months."}
              </li>
              <li>{nl ? "Analytische gegevens: maximaal 14 maanden." : "Analytics data: a maximum of 14 months."}</li>
            </ul>
          </Section>

          <Section title={nl ? "6. Doorgifte buiten de EER" : "6. Transfers outside the EEA"}>
            <p>
              {nl
                ? "Wij streven ernaar uw gegevens binnen de Europese Economische Ruimte (EER) te verwerken. Wanneer een verwerker gegevens buiten de EER verwerkt, gebeurt dit uitsluitend op basis van een adequaatheidsbesluit van de Europese Commissie of de standaard contractbepalingen (SCC's), aangevuld met passende aanvullende maatregelen."
                : "We aim to process your data within the European Economic Area (EEA). Where a processor processes data outside the EEA, this occurs only on the basis of an adequacy decision of the European Commission or the Standard Contractual Clauses (SCCs), supplemented by appropriate additional safeguards."}
            </p>
          </Section>

          <Section title={nl ? "7. Beveiliging" : "7. Security"}>
            <p>
              {nl
                ? "Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beschermen, waaronder versleutelde verbindingen (TLS), toegangsbeheer op basis van rollen, logging van toegang tot gevoelige gegevens en beperkte toegang tot persoonsgegevens op need-to-know-basis."
                : "We take appropriate technical and organisational measures to protect your data, including encrypted connections (TLS), role-based access control, logging of access to sensitive data, and limiting access to personal data on a need-to-know basis."}
            </p>
          </Section>

          <Section title={nl ? "8. Uw rechten" : "8. Your rights"}>
            <p>{nl ? "U heeft de volgende rechten:" : "You have the following rights:"}</p>
            <ul>
              <li>{nl ? "Recht op inzage" : "Right of access"}</li>
              <li>{nl ? "Recht op rectificatie" : "Right to rectification"}</li>
              <li>{nl ? "Recht op verwijdering" : "Right to erasure"}</li>
              <li>{nl ? "Recht op beperking van de verwerking" : "Right to restriction of processing"}</li>
              <li>{nl ? "Recht van bezwaar" : "Right to object"}</li>
              <li>{nl ? "Recht op dataportabiliteit" : "Right to data portability"}</li>
            </ul>
            <p>
              {nl
                ? "U kunt uw verzoek indienen via "
                : "You can submit your request via "}
              <a href="mailto:info@edutchmanagement.nl">info@edutchmanagement.nl</a>
              {nl
                ? ". Wij reageren binnen één maand. Ter verificatie kunnen wij u om aanvullende identificatie vragen."
                : ". We respond within one month. We may ask for additional identification to verify your request."}
            </p>
          </Section>

          <Section title={nl ? "9. Klachtrecht" : "9. Right to lodge a complaint"}>
            <p>
              {nl
                ? "Bent u het niet eens met de manier waarop wij met uw gegevens omgaan? Dan heeft u het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens, Postbus 93374, 2509 AJ Den Haag ("
                : "If you disagree with the way we handle your data, you have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens), Postbus 93374, 2509 AJ The Hague ("}
              <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer">
                autoriteitpersoonsgegevens.nl
              </a>
              ).
            </p>
          </Section>

          <Section title={nl ? "10. Cookies" : "10. Cookies"}>
            <p>
              {nl
                ? "Onze website maakt gebruik van cookies. Lees ons "
                : "Our website uses cookies. Please read our "}
              <Link to="/cookie-policy">{nl ? "cookiebeleid" : "cookie policy"}</Link>
              {nl
                ? " voor een volledig overzicht van de cookies die wij plaatsen en hoe u uw voorkeuren aanpast."
                : " for a full overview of the cookies we place and how to adjust your preferences."}
            </p>
          </Section>

          <Section title={nl ? "11. Contact" : "11. Contact"}>
            <p>
              {nl
                ? "Heeft u vragen over dit privacybeleid? Neem contact met ons op:"
                : "Do you have questions about this privacy policy? Please contact us:"}
            </p>
            <p className="text-white">
              eDutch Management B.V.
              <br />
              Reigersbos 100 P, 1107 ES Amsterdam
              <br />
              <a href="mailto:info@edutchmanagement.nl">info@edutchmanagement.nl</a> — +31 (0)20 737 03 85
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
