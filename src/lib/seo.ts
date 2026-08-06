// SEO utilities and meta tag management
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: Record<string, any>;
}

export const defaultSEO: SEOConfig = {
  title: "eDutch Management | Bedrijfsadres Nederland",
  description: "Professioneel bedrijfsadres en postadres in Nederland. KvK-inschrijfbaar, met postafhandeling en virtual office services.",
  keywords: "bedrijfsadres, postadres, KvK inschrijving, bedrijf opstarten, Nederland, postafhandeling, virtual office",
  canonical: "https://edutchmanagement.nl/",
  ogType: "website",
  twitterCard: "summary_large_image"
};

export const updateMetaTags = (config: Partial<SEOConfig> = {}) => {
  const seoConfig = { ...defaultSEO, ...config };
  
  if (typeof document === 'undefined') return;

  // Update title
  document.title = seoConfig.title;

  // Helper function to update or create meta tag
  const updateMetaTag = (selector: string, content: string, property?: string) => {
    let meta = document.querySelector(selector) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      if (property) {
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
      }
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Update description
  updateMetaTag('meta[name="description"]', seoConfig.description, 'description');
  
  // Update keywords
  if (seoConfig.keywords) {
    updateMetaTag('meta[name="keywords"]', seoConfig.keywords, 'keywords');
  }

  // Update canonical URL
  if (seoConfig.canonical) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = seoConfig.canonical;
  }

  // Open Graph tags
  updateMetaTag('meta[property="og:title"]', seoConfig.title, 'og:title');
  updateMetaTag('meta[property="og:description"]', seoConfig.description, 'og:description');
  updateMetaTag('meta[property="og:type"]', seoConfig.ogType || 'website', 'og:type');
  updateMetaTag('meta[property="og:url"]', window.location.href, 'og:url');
  
  if (seoConfig.ogImage) {
    updateMetaTag('meta[property="og:image"]', seoConfig.ogImage, 'og:image');
  }

  // Twitter Card tags
  updateMetaTag('meta[name="twitter:card"]', seoConfig.twitterCard || 'summary_large_image', 'twitter:card');
  updateMetaTag('meta[name="twitter:title"]', seoConfig.title, 'twitter:title');
  updateMetaTag('meta[name="twitter:description"]', seoConfig.description, 'twitter:description');
  
  if (seoConfig.ogImage) {
    updateMetaTag('meta[name="twitter:image"]', seoConfig.ogImage, 'twitter:image');
  }

  // Structured data
  if (seoConfig.structuredData) {
    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(seoConfig.structuredData);
  }
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: "eDutch Management | Bedrijfsadres Nederland",
    description: "Start uw bedrijf met een prestigieus adres. Bedrijfsadres, KvK inschrijving, postafhandeling en virtual office in Nederland.",
    keywords: "bedrijfsadres nederland, postadres, kvk inschrijving, virtual office, bedrijf opstarten",
    canonical: "https://edutchmanagement.nl/",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "eDutch Management",
      "description": "Professionele bedrijfsadressen en virtual office services",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NL",
        "addressLocality": "Amsterdam"
      },
      "telephone": "+31-20-123-4567",
      "url": "https://edutchmanagement.nl/"
    }
  },

  dashboard: {
    title: "Dashboard | eDutch Management",
    description: "Beheer uw bedrijfsadres en bekijk uw aanvragen in het eDutch Management dashboard.",
    canonical: "https://edutchmanagement.nl/dashboard",
  },

  addressRequest: {
    title: "Bedrijfsadres Aanvragen | eDutch Management",
    description: "Vraag een professioneel bedrijfsadres aan. Eenvoudig proces voor KvK inschrijving en postafhandeling.",
    canonical: "https://edutchmanagement.nl/aanvragen",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Bedrijfsadres aanvragen",
      "description": "Aanvraag voor een KvK-inschrijfbaar bedrijfsadres met postafhandeling.",
      "provider": {
        "@type": "Organization",
        "name": "eDutch Management",
        "url": "https://edutchmanagement.nl/"
      },
      "areaServed": "NL"
    }
  },

  auth: {
    title: "Inloggen | eDutch Management",
    description: "Log in op uw eDutch Management klantportaal.",
    canonical: "https://edutchmanagement.nl/auth",
  },

  admin: {
    title: "Admin Dashboard | eDutch Management",
    description: "Administratie dashboard voor eDutch Management",
    canonical: "https://edutchmanagement.nl/admin",
  },

  cookiePolicy: {
    title: "Cookiebeleid | eDutch Management",
    description: "Informatie over hoe eDutch Management cookies gebruikt.",
    canonical: "https://edutchmanagement.nl/cookie-policy",
  },

  privacy: {
    title: "Privacybeleid | eDutch Management",
    description: "Lees hoe eDutch Management persoonsgegevens verwerkt, welke rechten u heeft en hoe wij uw gegevens beveiligen.",
    canonical: "https://edutchmanagement.nl/privacy",
  },

  terms: {
    title: "Algemene Voorwaarden | eDutch Management",
    description: "De algemene voorwaarden van eDutch Management voor bedrijfsadres-, postadres- en virtual office dienstverlening.",
    canonical: "https://edutchmanagement.nl/terms",
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof document === 'undefined') return;

  const preloadResource = (href: string, as: string, type?: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  };

  // Preload critical fonts
  preloadResource('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap', 'style');
  
  // Preload critical images (if any)
  // preloadResource('/hero-image.jpg', 'image');
};