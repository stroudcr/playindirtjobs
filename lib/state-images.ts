// State-specific hero images from Unsplash
// Using Unsplash static CDN URLs with consistent sizing

export interface StateImage {
  src: string;
  alt: string;
  credit: string;
  creditUrl: string;
}

const FALLBACK_IMAGE: StateImage = {
  src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop",
  alt: "Golden farmland at sunset",
  credit: "Federico Respini",
  creditUrl: "https://unsplash.com/@federicorespini",
};

const STATE_IMAGES: Record<string, StateImage> = {
  AL: {
    src: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop",
    alt: "Cotton fields in Alabama",
    credit: "Zoe Schaeffer",
    creditUrl: "https://unsplash.com/@dirtjoy",
  },
  AK: {
    src: "https://images.unsplash.com/photo-1531176175280-5a0c95bec5fd?w=1920&h=1080&fit=crop",
    alt: "Alaska mountain valley farmland",
    credit: "McKayla Crump",
    creditUrl: "https://unsplash.com/@mckayla",
  },
  AZ: {
    src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=1080&fit=crop",
    alt: "Arizona desert agricultural landscape",
    credit: "Braden Jarvis",
    creditUrl: "https://unsplash.com/@jarvisphoto",
  },
  AR: {
    src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&h=1080&fit=crop",
    alt: "Rice paddies in Arkansas",
    credit: "Dan Meyers",
    creditUrl: "https://unsplash.com/@dmey503",
  },
  CA: {
    src: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&h=1080&fit=crop",
    alt: "California vineyard rows at golden hour",
    credit: "Karsten Winegeart",
    creditUrl: "https://unsplash.com/@karsten116",
  },
  CO: {
    src: "https://images.unsplash.com/photo-1516490981167-dc990a242afe?w=1920&h=1080&fit=crop",
    alt: "Colorado ranch with mountain backdrop",
    credit: "Dan Meyers",
    creditUrl: "https://unsplash.com/@dmey503",
  },
  CT: {
    src: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=1920&h=1080&fit=crop",
    alt: "New England farmland in autumn",
    credit: "Todd Quackenbush",
    creditUrl: "https://unsplash.com/@toddquackenbush",
  },
  DE: {
    src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=1080&fit=crop",
    alt: "Mid-Atlantic farm fields",
    credit: "Henry Be",
    creditUrl: "https://unsplash.com/@henry_be",
  },
  FL: {
    src: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1920&h=1080&fit=crop",
    alt: "Florida citrus grove",
    credit: "Jairo Alzate",
    creditUrl: "https://unsplash.com/@jairoalzate",
  },
  GA: {
    src: "https://images.unsplash.com/photo-1595690611603-70a89c193080?w=1920&h=1080&fit=crop",
    alt: "Georgia peach orchard",
    credit: "Priscilla Du Preez",
    creditUrl: "https://unsplash.com/@priscilladupreez",
  },
  HI: {
    src: "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?w=1920&h=1080&fit=crop",
    alt: "Hawaiian tropical farm landscape",
    credit: "Braden Jarvis",
    creditUrl: "https://unsplash.com/@jarvisphoto",
  },
  ID: {
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop",
    alt: "Idaho potato farmland at sunset",
    credit: "Federico Respini",
    creditUrl: "https://unsplash.com/@federicorespini",
  },
  IL: {
    src: "https://images.unsplash.com/photo-1472745433479-4556f22e32c2?w=1920&h=1080&fit=crop",
    alt: "Illinois cornfield stretching to the horizon",
    credit: "Jake Gard",
    creditUrl: "https://unsplash.com/@jakegard",
  },
  IN: {
    src: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1920&h=1080&fit=crop",
    alt: "Indiana soybean fields",
    credit: "Dan Meyers",
    creditUrl: "https://unsplash.com/@dmey503",
  },
  IA: {
    src: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1920&h=1080&fit=crop",
    alt: "Iowa corn rows at sunrise",
    credit: "Jake Gard",
    creditUrl: "https://unsplash.com/@jakegard",
  },
  KS: {
    src: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=1920&h=1080&fit=crop",
    alt: "Kansas wheat field under dramatic sky",
    credit: "Federico Respini",
    creditUrl: "https://unsplash.com/@federicorespini",
  },
  KY: {
    src: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1920&h=1080&fit=crop",
    alt: "Kentucky horse farm with rolling hills",
    credit: "Tj Holowaychuk",
    creditUrl: "https://unsplash.com/@tjholo",
  },
  LA: {
    src: "https://images.unsplash.com/photo-1516214104703-d870798883c5?w=1920&h=1080&fit=crop",
    alt: "Louisiana sugarcane plantation",
    credit: "Timothy Eberly",
    creditUrl: "https://unsplash.com/@timothyeberly",
  },
  ME: {
    src: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1920&h=1080&fit=crop",
    alt: "Maine blueberry barrens in autumn",
    credit: "Aaron Burden",
    creditUrl: "https://unsplash.com/@aaronburden",
  },
  MD: {
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop",
    alt: "Maryland Chesapeake Bay farmland",
    credit: "Federico Respini",
    creditUrl: "https://unsplash.com/@federicorespini",
  },
  MA: {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop",
    alt: "Massachusetts cranberry bog",
    credit: "Aaron Burden",
    creditUrl: "https://unsplash.com/@aaronburden",
  },
  MI: {
    src: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=1920&h=1080&fit=crop",
    alt: "Michigan cherry orchard",
    credit: "Kelly Sikkema",
    creditUrl: "https://unsplash.com/@kellysikkema",
  },
  MN: {
    src: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=1920&h=1080&fit=crop",
    alt: "Minnesota farmland at golden hour",
    credit: "Todd Quackenbush",
    creditUrl: "https://unsplash.com/@toddquackenbush",
  },
  MS: {
    src: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop",
    alt: "Mississippi Delta cotton fields",
    credit: "Zoe Schaeffer",
    creditUrl: "https://unsplash.com/@dirtjoy",
  },
  MO: {
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop",
    alt: "Missouri farmland rolling hills",
    credit: "Federico Respini",
    creditUrl: "https://unsplash.com/@federicorespini",
  },
  MT: {
    src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1920&h=1080&fit=crop",
    alt: "Montana ranch with mountain backdrop",
    credit: "Casey Horner",
    creditUrl: "https://unsplash.com/@mischievous_penguins",
  },
  NE: {
    src: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=1920&h=1080&fit=crop",
    alt: "Nebraska cornfield stretching to horizon",
    credit: "Jake Gard",
    creditUrl: "https://unsplash.com/@jakegard",
  },
  NV: {
    src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&h=1080&fit=crop",
    alt: "Nevada high desert ranch",
    credit: "Bailey Zindel",
    creditUrl: "https://unsplash.com/@baileyzindel",
  },
  NH: {
    src: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1920&h=1080&fit=crop",
    alt: "New Hampshire farm in fall foliage",
    credit: "Aaron Burden",
    creditUrl: "https://unsplash.com/@aaronburden",
  },
  NJ: {
    src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=1080&fit=crop",
    alt: "New Jersey Garden State farmland",
    credit: "Henry Be",
    creditUrl: "https://unsplash.com/@henry_be",
  },
  NM: {
    src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=1080&fit=crop",
    alt: "New Mexico chile pepper fields",
    credit: "Braden Jarvis",
    creditUrl: "https://unsplash.com/@jarvisphoto",
  },
  NY: {
    src: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=1920&h=1080&fit=crop",
    alt: "New York apple orchard in Hudson Valley",
    credit: "Todd Quackenbush",
    creditUrl: "https://unsplash.com/@toddquackenbush",
  },
  NC: {
    src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&h=1080&fit=crop",
    alt: "North Carolina tobacco farmland",
    credit: "Dan Meyers",
    creditUrl: "https://unsplash.com/@dmey503",
  },
  ND: {
    src: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=1920&h=1080&fit=crop",
    alt: "North Dakota wheat harvest",
    credit: "Federico Respini",
    creditUrl: "https://unsplash.com/@federicorespini",
  },
  OH: {
    src: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1920&h=1080&fit=crop",
    alt: "Ohio farm with red barn",
    credit: "Dan Meyers",
    creditUrl: "https://unsplash.com/@dmey503",
  },
  OK: {
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop",
    alt: "Oklahoma cattle ranch at sunset",
    credit: "Federico Respini",
    creditUrl: "https://unsplash.com/@federicorespini",
  },
  OR: {
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1920&h=1080&fit=crop",
    alt: "Oregon Willamette Valley farmland",
    credit: "Todd Quackenbush",
    creditUrl: "https://unsplash.com/@toddquackenbush",
  },
  PA: {
    src: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1920&h=1080&fit=crop",
    alt: "Pennsylvania Dutch Country farmland",
    credit: "Tj Holowaychuk",
    creditUrl: "https://unsplash.com/@tjholo",
  },
  RI: {
    src: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=1920&h=1080&fit=crop",
    alt: "Rhode Island coastal farmland",
    credit: "Todd Quackenbush",
    creditUrl: "https://unsplash.com/@toddquackenbush",
  },
  SC: {
    src: "https://images.unsplash.com/photo-1595690611603-70a89c193080?w=1920&h=1080&fit=crop",
    alt: "South Carolina lowcountry farm",
    credit: "Priscilla Du Preez",
    creditUrl: "https://unsplash.com/@priscilladupreez",
  },
  SD: {
    src: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=1920&h=1080&fit=crop",
    alt: "South Dakota prairie farmland",
    credit: "Federico Respini",
    creditUrl: "https://unsplash.com/@federicorespini",
  },
  TN: {
    src: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1920&h=1080&fit=crop",
    alt: "Tennessee valley farmland",
    credit: "Tj Holowaychuk",
    creditUrl: "https://unsplash.com/@tjholo",
  },
  TX: {
    src: "https://images.unsplash.com/photo-1516490981167-dc990a242afe?w=1920&h=1080&fit=crop",
    alt: "Texas ranch at golden hour",
    credit: "Dan Meyers",
    creditUrl: "https://unsplash.com/@dmey503",
  },
  UT: {
    src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&h=1080&fit=crop",
    alt: "Utah mountain valley farm",
    credit: "Bailey Zindel",
    creditUrl: "https://unsplash.com/@baileyzindel",
  },
  VT: {
    src: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=1920&h=1080&fit=crop",
    alt: "Vermont dairy farmland with red barn",
    credit: "Todd Quackenbush",
    creditUrl: "https://unsplash.com/@toddquackenbush",
  },
  VA: {
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop",
    alt: "Virginia Shenandoah Valley farm",
    credit: "Federico Respini",
    creditUrl: "https://unsplash.com/@federicorespini",
  },
  WA: {
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1920&h=1080&fit=crop",
    alt: "Washington apple orchard",
    credit: "Todd Quackenbush",
    creditUrl: "https://unsplash.com/@toddquackenbush",
  },
  WV: {
    src: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1920&h=1080&fit=crop",
    alt: "West Virginia mountain farmland",
    credit: "Tj Holowaychuk",
    creditUrl: "https://unsplash.com/@tjholo",
  },
  WI: {
    src: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=1920&h=1080&fit=crop",
    alt: "Wisconsin dairy farm pasture",
    credit: "Todd Quackenbush",
    creditUrl: "https://unsplash.com/@toddquackenbush",
  },
  WY: {
    src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1920&h=1080&fit=crop",
    alt: "Wyoming cattle ranch with mountain backdrop",
    credit: "Casey Horner",
    creditUrl: "https://unsplash.com/@mischievous_penguins",
  },
};

export function getStateImage(stateCode: string): StateImage {
  return STATE_IMAGES[stateCode.toUpperCase()] || FALLBACK_IMAGE;
}
