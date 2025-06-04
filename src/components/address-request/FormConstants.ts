
export const addressTypes = [
  { 
    value: "basic", 
    label: "Basis Pakket - €59/maand", 
    description: "Bedrijfsadres + postdoorverzendig" 
  },
  { 
    value: "premium", 
    label: "Premium Pakket - €89/maand", 
    description: "Basis + telefonservice + vergaderruimte" 
  },
  { 
    value: "complete", 
    label: "Complete Pakket - €149/maand", 
    description: "Premium + kantoorservice + secretariaatdiensten" 
  }
];

export const businessTypes = [
  "Eenmanszaak",
  "BV",
  "NV",
  "VOF",
  "Maatschap",
  "Stichting",
  "Vereniging",
  "Anders"
];

export const mailVolumeOptions = [
  "Weinig (1-5 items per week)",
  "Gemiddeld (5-15 items per week)", 
  "Veel (15-30 items per week)",
  "Zeer veel (30+ items per week)"
];

export const additionalServicesOptions = [
  "Telefonische bereikbaarheid",
  "Vergaderruimte toegang",
  "Postscanning service",
  "Pakketservice",
  "Secretariaatdiensten",
  "Accountancy ondersteuning"
];
