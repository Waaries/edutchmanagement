
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'nl' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string) => string;
};

const defaultLanguageContext: LanguageContextType = {
  language: 'nl',
  setLanguage: () => {},
  translate: () => '',
};

const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize with browser language if available, default to Dutch
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage === 'en' || savedLanguage === 'nl') {
      return savedLanguage;
    }
    
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'nl';
  });

  // Store language preference in localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function that looks up the key in the translations object
  const translate = (key: string): string => {
    const path = key.split('.');
    let translation: any = translations[language];
    
    for (const segment of path) {
      if (!translation[segment]) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        // Return the key if translation is missing
        return key;
      }
      translation = translation[segment];
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translations for both languages
const translations = {
  nl: {
    nav: {
      home: "Home",
      services: "Diensten",
      testimonials: "Recensies",
      contact: "Contact",
      login: "Inloggen",
      logout: "Uitloggen",
    },
    hero: {
      badge: "Professioneel Bedrijfsadres",
      title: "Geef uw bedrijf een professionele uitstraling",
      subtitle: "Huur een professioneel bedrijfsadres op een toplocatie en maak een uitstekende eerste indruk. Volledig beheer zonder zorgen.",
      description: "Geschikt voor KVK-inschrijving, btw-registratie en professionele postafhandeling",
      discoverBtn: "Ontdek Onze Diensten",
      contactBtn: "Contact Opnemen",
      features: {
        address: {
          title: "Professioneel adres",
          desc: "Op toplocatie"
        },
        management: {
          title: "Volledig beheer",
          desc: "Zonder zorgen"
        },
        mail: {
          title: "Post & pakketten",
          desc: "Veilig ontvangen"
        }
      },
      premium: "Premium Locaties",
      premiumDesc: "Indrukwekkende adressen in de beste zakendistricten voor uw bedrijf."
    },
    features: {
      title: "Waarom Kiezen Voor Ons",
      subtitle: "Voordelen van een Bedrijfsadres",
      description: "Ontdek hoe een professioneel bedrijfsadres uw bedrijf naar een hoger niveau kan tillen.",
      reliability: {
        title: "Betrouwbaarheid",
        description: "Uw bedrijfsadres in vertrouwde handen met gegarandeerde privacy en professionele afhandeling."
      },
      timeSaving: {
        title: "Tijdbesparing",
        description: "Geen zorgen over postafhandeling of kantooronderhoud, zodat u zich kunt richten op uw kernactiviteiten."
      },
      professional: {
        title: "Professionele Uitstraling",
        description: "Een prestigieus zakelijk adres verbetert uw bedrijfsimago en maakt indruk op potentiële klanten."
      },
      flexibility: {
        title: "Flexibiliteit",
        description: "Werk vanuit waar dan ook terwijl u profiteert van een vaste, professionele zakelijke aanwezigheid."
      },
      mailPackages: {
        title: "Post & Pakketten",
        description: "Al uw zakelijke post en pakketten worden veilig ontvangen en beheerd, met doorstuuropties."
      },
      reception: {
        title: "Receptieservice",
        description: "Optionele telefoondiensten zodat u nooit een belangrijke zakelijke oproep mist."
      }
    },
    services: {
      title: "Onze Diensten",
      subtitle: "Flexibele Adresoplossingen Voor Uw Bedrijf",
      description: "Kies het pakket dat het beste past bij de behoeften van uw bedrijf.",
      basic: {
        title: "Basis Bedrijfsadres",
        price: "€59",
        period: "per maand excl. BTW",
        description: "Perfect voor startende ondernemers en ZZP'ers",
        features: [
          "Prestigieus zakelijk adres",
          "Post ontvangen en bewaren",
          "Digitale notificatie van ontvangen post",
          "KVK/BTW registratie mogelijk",
          "3 maanden minimale contractduur"
        ]
      },
      premium: {
        title: "Premium Bedrijfsadres",
        price: "€89",
        period: "per maand excl. BTW",
        description: "Ideaal voor groeiende bedrijven met meer behoeften",
        features: [
          "Alles uit het Basis pakket",
          "Wekelijks doorsturen van post",
          "Pakketten ontvangen en tijdelijk opslaan",
          "Telefonische bereikbaarheid via receptie",
          "Gebruik van vergaderruimte (2u/maand)"
        ],
        mostPopular: "Meest Gekozen"
      },
      complete: {
        title: "Zakelijk Compleet",
        price: "€149",
        period: "per maand excl. BTW",
        description: "Complete oplossing voor gevestigde bedrijven",
        features: [
          "Alles uit het Premium pakket",
          "Dagelijks doorsturen van post",
          "Bezoekersregistratie voor gasten",
          "Persoonlijke telefoniste",
          "Gebruik van vergaderruimte (10u/maand)",
          "Gratis koffie voor bezoekers"
        ]
      },
      customNeeds: "Heeft u specifieke behoeften die niet in onze standaardpakketten worden gedekt?",
      customBtn: "Vraag Een Aangepast Pakket Aan",
      selectPlan: "Selecteer Plan"
    },
    testimonials: {
      title: "Ervaringen",
      subtitle: "Wat Onze Klanten Zeggen",
      description: "Ontdek waarom ondernemers kiezen voor onze bedrijfsadresservice.",
      items: [
        {
          quote: "Het huren van een bedrijfsadres via deze dienst heeft onze professionele uitstraling aanzienlijk verbeterd. Onze klanten zijn onder de indruk van ons prestigieuze adres, terwijl wij flexibel blijven werken.",
          author: "Sophie van den Berg",
          company: "Directeur, InnovateTech BV"
        },
        {
          quote: "Als startende ondernemer was dit precies wat ik nodig had. Een betaalbaar professioneel adres zonder de kosten van een fysiek kantoor. De postafhandeling is uiterst efficiënt en betrouwbaar.",
          author: "Thomas Bakker",
          company: "Oprichter, WebSolutions"
        },
        {
          quote: "De klantenservice is uitzonderlijk. Ze gaan verder dan verwacht om onze specifieke behoeften te vervullen. Het Premium pakket biedt alles wat we nodig hebben voor ons groeiende team.",
          author: "Emma Visser",
          company: "Marketing Manager, GrowBiz"
        }
      ]
    },
    contact: {
      title: "Contact Opnemen",
      subtitle: "Klaar Om Uw Bedrijfsadres Te Upgraden?",
      description: "Neem contact met ons op voor meer informatie of om een pakket te kiezen dat bij uw bedrijf past.",
      form: {
        title: "Stuur ons een bericht",
        description: "Vul het formulier in en we nemen binnen 24 uur contact met u op. Maximum 3 berichten per uur toegestaan.",
        name: "Naam",
        namePlace: "Uw volledige naam",
        email: "E-mail",
        emailPlace: "uw.email@example.com",
        phone: "Telefoon",
        phonePlace: "+31 6 12345678",
        subject: "Onderwerp",
        subjectPlace: "Waar gaat uw vraag over?",
        service: "Gewenst Pakket",
        servicePlaceholder: "Selecteer een pakket",
        basicService: "Basis Bedrijfsadres",
        premiumService: "Premium Bedrijfsadres",
        completeService: "Zakelijk Compleet",
        customService: "Aangepast Pakket",
        message: "Bericht",
        messagePlaceholder: "Beschrijf uw vraag of wens in detail...",
        sendBtn: "Bericht Verzenden",
        sendingBtn: "Bezig met verzenden...",
        validationTitle: "Ontbrekende informatie",
        validationMsg: "Vul uw naam, e-mail en bericht in.",
        rateLimitTitle: "Te veel verzoeken",
        rateLimitMsg: "Maximum 3 berichten per uur toegestaan. Wacht even voordat u een nieuw bericht verzendt.",
        errorTitle: "Fout",
        errorMsg: "Kan bericht niet verzenden. Probeer het opnieuw.",
        unexpectedError: "Er is een onverwachte fout opgetreden. Probeer het opnieuw.",
        success: "Bericht verzonden!",
        successMessage: "Dank u voor uw bericht. We nemen binnen 24 uur contact met u op."
      },
      info: {
        title: "Contactinformatie",
        description: "U kunt ons ook rechtstreeks bereiken via onderstaande gegevens.",
        address: "Ons Adres",
        addressValue: "Reigersbos 100 P\n1107 ES Amsterdam",
        phone: "Telefoonnummer",
        phoneValue: "+31 (0)20 737 03 85",
        hoursShort: "Ma-Vr: 09:00 - 17:00",
        email: "E-mail",
        emailValue: "info@edutchmanagement.nl",
        responseTime: "Antwoord binnen 24 uur",
        hoursTitle: "Openingstijden",
        hoursMonFri: "Maandag - Vrijdag: 09:00 - 17:00",
        hoursSat: "Zaterdag: Gesloten",
        hoursSun: "Zondag: Gesloten",
        quickResponse: "Snelle respons",
        quickResponseDesc: "We reageren binnen 24 uur op uw bericht. Voor urgente zaken kunt u bellen tijdens kantooruren."
      }
    },
    auth: {
      login: {
        title: "Inloggen",
        email: "E-mail",
        emailPlaceholder: "uw@email.nl",
        password: "Wachtwoord",
        passwordPlaceholder: "••••••••",
        forgotPassword: "Wachtwoord vergeten?",
        checkEmail: "Controleer uw e-mail",
        button: "Inloggen",
        loggingIn: "Bezig met inloggen...",
        secure: "Uw verbinding is beveiligd. Wij slaan uw wachtwoord nooit op in platte tekst."
      },
      register: {
        title: "Registreren",
        firstName: "Voornaam",
        firstNamePlaceholder: "Jan",
        lastName: "Achternaam",
        lastNamePlaceholder: "de Vries",
        email: "E-mail",
        emailPlaceholder: "uw@email.nl",
        password: "Wachtwoord",
        passwordPlaceholder: "••••••••",
        passwordRequirements: "Wachtwoordvereisten:",
        minLength: "Minimaal 8 tekens",
        uppercase: "Minimaal één hoofdletter",
        lowercase: "Minimaal één kleine letter",
        number: "Minimaal één cijfer",
        special: "Minimaal één speciaal teken",
        button: "Account Aanmaken",
        creating: "Account aanmaken...",
        successTitle: "Registratie Succesvol",
        successButton: "Sluiten"
      },
      welcome: "Welkom bij eDutch Management",
      welcomeDesc: "Log in of maak een account aan om verder te gaan",
      secureAuth: "Beveiligde authenticatie",
      backToHome: "Terug naar home"
    },
    footer: {
      services: "Diensten",
      links: "Links",
      contact: "Contact",
      description: "Wij bieden professionele bedrijfsadressen voor ondernemers en bedrijven die hun uitstraling willen verbeteren zonder de kosten van een fysiek kantoor.",
      aboutUs: "Over Ons",
      pricing: "Tarieven",
      copyright: "© {year} eDutch Management. Alle rechten voorbehouden.",
      terms: "Algemene Voorwaarden",
      privacy: "Privacybeleid",
      cookies: "Cookiebeleid"
    },
    notFound: {
      title: "Pagina Niet Gevonden",
      subtitle: "De pagina die u probeert te bezoeken bestaat niet of is verplaatst.",
      backToHome: "Terug naar Home"
    },
    cookieConsent: {
      title: "Cookie-instellingen",
      description: "Wij gebruiken cookies om uw ervaring op onze website te verbeteren. Deze cookies helpen ons te begrijpen hoe bezoekers onze site gebruiken.",
      essential: {
        title: "Essentiële cookies",
        description: "Deze cookies zijn noodzakelijk voor het functioneren van de website. Ze kunnen niet worden uitgeschakeld."
      },
      analytics: {
        title: "Analytische cookies",
        description: "Helpen ons te begrijpen hoe bezoekers omgaan met onze website. Deze informatie gebruiken wij om onze site te verbeteren."
      },
      marketing: {
        title: "Marketing cookies",
        description: "Worden gebruikt om bezoekers te volgen op verschillende websites. Het doel is advertenties te tonen die relevant en boeiend zijn voor de individuele gebruiker."
      },
      viewPolicy: "Bekijk ons cookiebeleid voor meer informatie.",
      acceptEssential: "Alleen essentiële cookies",
      acceptAll: "Alle cookies accepteren",
      toastTitle: "Cookies geaccepteerd",
      toastAllDesc: "Al uw cookievoorkeuren zijn opgeslagen.",
      toastEssentialDesc: "Alleen essentiële cookies worden gebruikt."
    }
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      testimonials: "Reviews",
      contact: "Contact",
      login: "Login",
      logout: "Logout",
    },
    hero: {
      badge: "Professional Business Address",
      title: "Give your business a professional appearance",
      subtitle: "Rent a professional business address at a top location and make an excellent first impression. Complete management without worries.",
      description: "Suitable for Chamber of Commerce registration, VAT registration, and professional mail handling",
      discoverBtn: "Discover Our Services",
      contactBtn: "Contact Us",
      features: {
        address: {
          title: "Professional address",
          desc: "At premium location"
        },
        management: {
          title: "Complete management",
          desc: "Without worries"
        },
        mail: {
          title: "Mail & packages",
          desc: "Securely received"
        }
      },
      premium: "Premium Locations",
      premiumDesc: "Impressive addresses in the best business districts for your company."
    },
    features: {
      title: "Why Choose Us",
      subtitle: "Advantages of a Business Address",
      description: "Discover how a professional business address can take your business to the next level.",
      reliability: {
        title: "Reliability",
        description: "Your business address in trusted hands with guaranteed privacy and professional handling."
      },
      timeSaving: {
        title: "Time Saving",
        description: "No worries about mail handling or office maintenance, allowing you to focus on your core activities."
      },
      professional: {
        title: "Professional Image",
        description: "A prestigious business address improves your company image and impresses potential clients."
      },
      flexibility: {
        title: "Flexibility",
        description: "Work from anywhere while benefiting from a fixed, professional business presence."
      },
      mailPackages: {
        title: "Mail & Packages",
        description: "All your business mail and packages are securely received and managed, with forwarding options."
      },
      reception: {
        title: "Reception Service",
        description: "Optional phone services so you never miss an important business call."
      }
    },
    services: {
      title: "Our Services",
      subtitle: "Flexible Address Solutions For Your Business",
      description: "Choose the package that best fits the needs of your business.",
      basic: {
        title: "Basic Business Address",
        price: "€59",
        period: "per month excl. VAT",
        description: "Perfect for starting entrepreneurs and freelancers",
        features: [
          "Prestigious business address",
          "Mail receipt and storage",
          "Digital notification of received mail",
          "Chamber of Commerce/VAT registration possible",
          "3-month minimum contract duration"
        ]
      },
      premium: {
        title: "Premium Business Address",
        price: "€89",
        period: "per month excl. VAT",
        description: "Ideal for growing businesses with more needs",
        features: [
          "Everything from the Basic package",
          "Weekly mail forwarding",
          "Package receipt and temporary storage",
          "Telephone accessibility via reception",
          "Use of meeting room (2h/month)"
        ],
        mostPopular: "Most Popular"
      },
      complete: {
        title: "Business Complete",
        price: "€149",
        period: "per month excl. VAT",
        description: "Complete solution for established businesses",
        features: [
          "Everything from the Premium package",
          "Daily mail forwarding",
          "Visitor registration for guests",
          "Personal receptionist",
          "Use of meeting room (10h/month)",
          "Free coffee for visitors"
        ]
      },
      customNeeds: "Do you have specific needs not covered in our standard packages?",
      customBtn: "Request a Custom Package",
      selectPlan: "Select Plan"
    },
    testimonials: {
      title: "Experiences",
      subtitle: "What Our Customers Say",
      description: "Discover why entrepreneurs choose our business address service.",
      items: [
        {
          quote: "Renting a business address through this service has significantly improved our professional image. Our clients are impressed by our prestigious address while we keep working flexibly.",
          author: "Sophie van den Berg",
          company: "Director, InnovateTech BV"
        },
        {
          quote: "As a starting entrepreneur this was exactly what I needed. An affordable professional address without the cost of a physical office. Mail handling is highly efficient and reliable.",
          author: "Thomas Bakker",
          company: "Founder, WebSolutions"
        },
        {
          quote: "The customer service is exceptional. They go above and beyond to meet our specific needs. The Premium package offers everything we need for our growing team.",
          author: "Emma Visser",
          company: "Marketing Manager, GrowBiz"
        }
      ]
    },
    contact: {
      title: "Contact Us",
      subtitle: "Ready To Upgrade Your Business Address?",
      description: "Contact us for more information or to choose a package that suits your business.",
      form: {
        title: "Send us a message",
        description: "Fill in the form and we will contact you within 24 hours. Maximum 3 messages per hour allowed.",
        name: "Name",
        namePlace: "Your full name",
        email: "Email",
        emailPlace: "your.email@example.com",
        phone: "Phone",
        phonePlace: "+31 6 12345678",
        subject: "Subject",
        subjectPlace: "What is your question about?",
        service: "Desired Package",
        servicePlaceholder: "Select a package",
        basicService: "Basic Business Address",
        premiumService: "Premium Business Address",
        completeService: "Business Complete",
        customService: "Custom Package",
        message: "Message",
        messagePlaceholder: "Describe your question or request in detail...",
        sendBtn: "Send Message",
        sendingBtn: "Sending...",
        validationTitle: "Missing information",
        validationMsg: "Please fill in your name, email and message.",
        rateLimitTitle: "Too many requests",
        rateLimitMsg: "Maximum 3 messages per hour allowed. Please wait before sending another message.",
        errorTitle: "Error",
        errorMsg: "Could not send message. Please try again.",
        unexpectedError: "An unexpected error occurred. Please try again.",
        success: "Message sent!",
        successMessage: "Thank you for your message. We will contact you within 24 hours."
      },
      info: {
        title: "Contact Information",
        description: "You can also reach us directly via the details below.",
        address: "Our Address",
        addressValue: "Reigersbos 100 P\n1107 ES Amsterdam",
        phone: "Phone Number",
        phoneValue: "+31 (0)20 737 03 85",
        hoursShort: "Mon-Fri: 09:00 - 17:00",
        email: "Email",
        emailValue: "info@edutchmanagement.nl",
        responseTime: "Response within 24 hours",
        hoursTitle: "Opening Hours",
        hoursMonFri: "Monday - Friday: 09:00 - 17:00",
        hoursSat: "Saturday: Closed",
        hoursSun: "Sunday: Closed",
        quickResponse: "Quick response",
        quickResponseDesc: "We respond within 24 hours to your message. For urgent matters, please call during office hours."
      }
    },
    auth: {
      login: {
        title: "Login",
        email: "Email",
        emailPlaceholder: "your@email.com",
        password: "Password",
        passwordPlaceholder: "••••••••",
        forgotPassword: "Forgot password?",
        checkEmail: "Check your email",
        button: "Login",
        loggingIn: "Logging in...",
        secure: "Your connection is secure. We never store your password in plain text."
      },
      register: {
        title: "Register",
        firstName: "First Name",
        firstNamePlaceholder: "John",
        lastName: "Last Name",
        lastNamePlaceholder: "Doe",
        email: "Email",
        emailPlaceholder: "your@email.com",
        password: "Password",
        passwordPlaceholder: "••••••••",
        passwordRequirements: "Password requirements:",
        minLength: "At least 8 characters",
        uppercase: "At least one uppercase letter",
        lowercase: "At least one lowercase letter",
        number: "At least one number",
        special: "At least one special character",
        button: "Create Account",
        creating: "Creating account...",
        successTitle: "Registration Successful",
        successButton: "Close"
      },
      welcome: "Welcome to eDutch Management",
      welcomeDesc: "Login or create an account to continue",
      secureAuth: "Secure authentication",
      backToHome: "Back to home"
    },
    footer: {
      services: "Services",
      links: "Links",
      contact: "Contact",
      copyright: "© {year} eDutch Management. All rights reserved.",
      terms: "Terms and Conditions",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy"
    },
    notFound: {
      title: "Page Not Found",
      subtitle: "The page you are trying to visit does not exist or has been moved.",
      backToHome: "Back to Home"
    },
    cookieConsent: {
      title: "Cookie settings",
      description: "We use cookies to improve your experience on our website. These cookies help us understand how visitors use our site.",
      essential: {
        title: "Essential cookies",
        description: "These cookies are necessary for the functioning of the website. They cannot be disabled."
      },
      analytics: {
        title: "Analytical cookies",
        description: "Help us understand how visitors interact with our website. We use this information to improve our site."
      },
      marketing: {
        title: "Marketing cookies",
        description: "Used to track visitors across different websites. The goal is to display advertisements that are relevant and engaging for the individual user."
      },
      viewPolicy: "View our cookie policy for more information.",
      acceptEssential: "Essential cookies only",
      acceptAll: "Accept all cookies",
      toastTitle: "Cookies accepted",
      toastAllDesc: "All your cookie preferences have been saved.",
      toastEssentialDesc: "Only essential cookies are being used."
    }
  }
};
