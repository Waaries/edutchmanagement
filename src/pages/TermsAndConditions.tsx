import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { updateMetaTags, pageSEO } from "@/lib/seo";

const LAST_UPDATED = "6 augustus 2026";
const LAST_UPDATED_EN = "6 August 2026";

const Article = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 md:p-8 backdrop-blur-sm">
    <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
    <div className="space-y-4 text-slate-300 leading-relaxed [&_a]:text-blue-400 [&_a:hover]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2">
      {children}
    </div>
  </section>
);

const TermsAndConditions = () => {
  const { language } = useLanguage();
  const nl = language === "nl";

  useEffect(() => {
    updateMetaTags(pageSEO.terms);
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
            {nl ? "Algemene Voorwaarden" : "Terms and Conditions"}
          </h1>
          <p className="mb-6 text-slate-400">
            {nl ? `Laatst bijgewerkt: ${LAST_UPDATED}` : `Last updated: ${LAST_UPDATED_EN}`}
          </p>

          <div className="mb-10 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            {nl
              ? "Let op: deze tekst is een concept. Laat de algemene voorwaarden juridisch toetsen voordat deze definitief live gaan."
              : "Please note: this text is a draft. Have these terms reviewed by a legal professional before they go live definitively."}
          </div>

          <Article title={nl ? "Artikel 1 — Definities" : "Article 1 — Definitions"}>
            <ul>
              <li>
                <strong className="text-white">{nl ? "Dienstverlener" : "Provider"}</strong>: eDutch Management B.V.,
                KvK 95218556, Reigersbos 100 P, 1107 ES Amsterdam.
              </li>
              <li>
                <strong className="text-white">{nl ? "Klant" : "Client"}</strong>:{" "}
                {nl
                  ? "de natuurlijke persoon of rechtspersoon die een overeenkomst met de dienstverlener aangaat."
                  : "the natural or legal person entering into an agreement with the provider."}
              </li>
              <li>
                <strong className="text-white">{nl ? "Dienst" : "Service"}</strong>:{" "}
                {nl
                  ? "het ter beschikking stellen van een bedrijfs- of postadres, postontvangst en het doorsturen of digitaliseren van post, en aanverwante virtual office diensten."
                  : "the provision of a business or postal address, mail reception and the forwarding or digitising of mail, and related virtual office services."}
              </li>
              <li>
                <strong className="text-white">{nl ? "Overeenkomst" : "Agreement"}</strong>:{" "}
                {nl
                  ? "iedere afspraak tussen dienstverlener en klant over de levering van de dienst."
                  : "any arrangement between provider and client regarding the delivery of the service."}
              </li>
            </ul>
          </Article>

          <Article title={nl ? "Artikel 2 — Toepasselijkheid" : "Article 2 — Applicability"}>
            <p>
              {nl
                ? "Deze voorwaarden zijn van toepassing op alle aanbiedingen, offertes en overeenkomsten tussen dienstverlener en klant. Afwijkingen gelden uitsluitend indien schriftelijk overeengekomen. Inkoop- of andere voorwaarden van de klant worden uitdrukkelijk van de hand gewezen."
                : "These terms apply to all offers, quotations and agreements between the provider and the client. Deviations apply only if agreed in writing. The client's purchasing or other terms are expressly rejected."}
            </p>
          </Article>

          <Article title={nl ? "Artikel 3 — Totstandkoming van de overeenkomst" : "Article 3 — Formation of the agreement"}>
            <p>
              {nl
                ? "De overeenkomst komt tot stand op het moment dat de klant een aanvraag indient en de dienstverlener deze schriftelijk of per e-mail bevestigt. De dienstverlener mag een aanvraag zonder opgaaf van reden weigeren, bijvoorbeeld wanneer het cliëntenonderzoek niet met succes kan worden afgerond."
                : "The agreement is formed when the client submits a request and the provider confirms it in writing or by email. The provider may refuse a request without stating reasons, for example where client due diligence cannot be completed successfully."}
            </p>
          </Article>

          <Article title={nl ? "Artikel 4 — De dienst" : "Article 4 — The service"}>
            <ul>
              <li>
                {nl
                  ? "De dienstverlener stelt een bedrijfsadres beschikbaar dat, afhankelijk van het gekozen pakket, gebruikt kan worden voor inschrijving bij de Kamer van Koophandel."
                  : "The provider makes available a business address which, depending on the selected package, may be used for registration with the Dutch Chamber of Commerce."}
              </li>
              <li>
                {nl
                  ? "Post gericht aan de klant wordt ontvangen en, conform het gekozen pakket, gescand, doorgestuurd of ter afhaling beschikbaar gehouden."
                  : "Mail addressed to the client is received and, in accordance with the selected package, scanned, forwarded or held for collection."}
              </li>
              <li>
                {nl
                  ? "Pakketten en aangetekende zendingen worden uitsluitend aangenomen indien dit in het pakket is inbegrepen. Onbezorgbare of geweigerde post wordt na 30 dagen vernietigd."
                  : "Parcels and registered mail are accepted only if included in the package. Undeliverable or refused mail is destroyed after 30 days."}
              </li>
            </ul>
          </Article>

          <Article title={nl ? "Artikel 5 — Verplichtingen van de klant" : "Article 5 — Client obligations"}>
            <ul>
              <li>
                {nl
                  ? "De klant verstrekt juiste, volledige en actuele gegevens en meldt wijzigingen onverwijld."
                  : "The client provides accurate, complete and current information and reports any changes without delay."}
              </li>
              <li>
                {nl
                  ? "De klant werkt mee aan identificatie en cliëntenonderzoek conform de Wet ter voorkoming van witwassen en financieren van terrorisme (Wwft)."
                  : "The client cooperates with identification and client due diligence under the Dutch Anti-Money Laundering and Anti-Terrorist Financing Act (Wwft)."}
              </li>
              <li>
                {nl
                  ? "Het is de klant verboden het adres te gebruiken voor onrechtmatige, frauduleuze of anderszins strafbare activiteiten. Bij een redelijk vermoeden hiervan mag de dienstverlener de dienst per direct opschorten of beëindigen en melding doen bij de bevoegde autoriteiten."
                  : "The client may not use the address for unlawful, fraudulent or otherwise criminal activities. On reasonable suspicion thereof, the provider may suspend or terminate the service with immediate effect and report it to the competent authorities."}
              </li>
            </ul>
          </Article>

          <Article title={nl ? "Artikel 6 — Tarieven en betaling" : "Article 6 — Rates and payment"}>
            <ul>
              <li>
                {nl
                  ? "Alle genoemde prijzen zijn exclusief btw, tenzij uitdrukkelijk anders vermeld."
                  : "All prices stated are exclusive of VAT unless expressly stated otherwise."}
              </li>
              <li>
                {nl
                  ? "Betaling geschiedt maandelijks vooraf. Automatische incasso is verplicht; de klant verstrekt hiervoor een geldige machtiging."
                  : "Payment is made monthly in advance. Direct debit is mandatory; the client provides a valid mandate for this purpose."}
              </li>
              <li>
                {nl
                  ? "Bij storno of niet-tijdige betaling mag de dienstverlener de dienst opschorten en de wettelijke handelsrente en buitengerechtelijke incassokosten in rekening brengen."
                  : "In case of a reversed direct debit or late payment, the provider may suspend the service and charge statutory commercial interest and extrajudicial collection costs."}
              </li>
            </ul>
          </Article>

          <Article title={nl ? "Artikel 7 — Looptijd en opzegging" : "Article 7 — Term and termination"}>
            <p>
              {nl
                ? "De overeenkomst kent een minimale contractduur van 3 maanden en wordt daarna stilzwijgend verlengd voor onbepaalde tijd. Opzegging is mogelijk tegen het einde van een kalendermaand met inachtneming van een opzegtermijn van 1 maand en dient schriftelijk of per e-mail te geschieden. Na beëindiging is de klant verplicht het adres onmiddellijk uit te schrijven bij de Kamer van Koophandel en bij alle overige registers en relaties."
                : "The agreement has a minimum term of 3 months and is thereafter renewed tacitly for an indefinite period. Termination is possible as of the end of a calendar month, observing a notice period of 1 month, and must be given in writing or by email. Upon termination, the client must immediately deregister the address with the Chamber of Commerce and with all other registers and contacts."}
            </p>
          </Article>

          <Article title={nl ? "Artikel 8 — Aansprakelijkheid" : "Article 8 — Liability"}>
            <p>
              {nl
                ? "De aansprakelijkheid van de dienstverlener is beperkt tot directe schade en tot maximaal het bedrag dat de klant in de zes maanden voorafgaand aan de schadeveroorzakende gebeurtenis heeft betaald, met een maximum van het bedrag dat de aansprakelijkheidsverzekeraar uitkeert. Aansprakelijkheid voor indirecte schade, waaronder gevolgschade, gederfde winst, gemiste besparingen en schade door vertraagde, verloren of beschadigde post, is uitgesloten. Deze beperkingen gelden niet bij opzet of bewuste roekeloosheid van de dienstverlener."
                : "The provider's liability is limited to direct damage and to a maximum of the amount paid by the client in the six months preceding the event causing the damage, capped at the amount paid out by the liability insurer. Liability for indirect damage, including consequential loss, lost profit, missed savings and damage due to delayed, lost or damaged mail, is excluded. These limitations do not apply in the event of intent or wilful recklessness by the provider."}
            </p>
          </Article>

          <Article title={nl ? "Artikel 9 — Overmacht" : "Article 9 — Force majeure"}>
            <p>
              {nl
                ? "De dienstverlener is niet gehouden tot nakoming van enige verplichting indien hij daartoe verhinderd wordt door overmacht, waaronder begrepen storingen bij post- en telecomproviders, stroom- en internetuitval, cyberaanvallen, overheidsmaatregelen en brand. Duurt de overmacht langer dan 60 dagen, dan mogen beide partijen de overeenkomst ontbinden zonder schadeplichtig te zijn."
                : "The provider is not obliged to perform any obligation if prevented from doing so by force majeure, including disruptions at postal and telecom providers, power and internet outages, cyber attacks, government measures and fire. If the force majeure lasts longer than 60 days, either party may dissolve the agreement without liability for damages."}
            </p>
          </Article>

          <Article title={nl ? "Artikel 10 — Geheimhouding" : "Article 10 — Confidentiality"}>
            <p>
              {nl
                ? "Beide partijen behandelen alle vertrouwelijke informatie die zij in het kader van de overeenkomst ontvangen strikt vertrouwelijk. De dienstverlener opent post uitsluitend indien de klant daar uitdrukkelijk opdracht toe geeft, bijvoorbeeld ten behoeve van een scandienst."
                : "Both parties treat all confidential information received under the agreement as strictly confidential. The provider opens mail only where the client expressly instructs it to do so, for example for a scanning service."}
            </p>
          </Article>

          <Article title={nl ? "Artikel 11 — Privacy" : "Article 11 — Privacy"}>
            <p>
              {nl
                ? "De dienstverlener verwerkt persoonsgegevens in overeenstemming met de AVG. Zie ons "
                : "The provider processes personal data in accordance with the GDPR. See our "}
              <Link to="/privacy">{nl ? "privacybeleid" : "privacy policy"}</Link>
              {nl ? " voor meer informatie." : " for more information."}
            </p>
          </Article>

          <Article title={nl ? "Artikel 12 — Wijziging van voorwaarden" : "Article 12 — Amendment of terms"}>
            <p>
              {nl
                ? "De dienstverlener mag deze voorwaarden en de tarieven wijzigen. Wijzigingen worden minimaal 30 dagen vooraf per e-mail aangekondigd. Is de klant het niet eens met een wijziging in zijn nadeel, dan mag hij de overeenkomst opzeggen tegen de datum waarop de wijziging ingaat."
                : "The provider may amend these terms and its rates. Changes are announced by email at least 30 days in advance. If the client does not agree with a change to their detriment, they may terminate the agreement as of the date the change takes effect."}
            </p>
          </Article>

          <Article title={nl ? "Artikel 13 — Toepasselijk recht en bevoegde rechter" : "Article 13 — Governing law and jurisdiction"}>
            <p>
              {nl
                ? "Op alle overeenkomsten is Nederlands recht van toepassing. Geschillen worden bij uitsluiting voorgelegd aan de bevoegde rechter van de rechtbank Amsterdam, tenzij dwingend recht anders voorschrijft."
                : "All agreements are governed by Dutch law. Disputes are submitted exclusively to the competent court of the District Court of Amsterdam, unless mandatory law provides otherwise."}
            </p>
            <p className="text-white">
              eDutch Management B.V. — KvK 95218556
              <br />
              Reigersbos 100 P, 1107 ES Amsterdam
              <br />
              <a href="mailto:info@edutchmanagement.nl">info@edutchmanagement.nl</a> — +31 (0)20 737 03 85
            </p>
          </Article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
