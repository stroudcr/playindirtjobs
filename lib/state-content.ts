// State-specific SEO content for location pages
// Each state has unique content for better SEO and user experience

import { US_STATES_WITHOUT_DC } from './constants';

export interface StateContent {
  code: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  content: {
    introduction: string;
    whyWork: string;
    typesOfFarms: string;
    gettingStarted: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedStates: string[]; // State codes
  majorCities: string[];
}

// Template-based content generator for states
// This allows us to quickly create all 50 state pages with reasonable content
// Individual states can be enhanced with detailed, unique content over time
function generateStateContent(
  code: string,
  name: string,
  majorCities: string[] = [],
  relatedStates: string[] = []
): StateContent {
  return {
    code,
    name,
    metaTitle: `Farm Jobs in ${name} | Agricultural Careers in ${code}`,
    metaDescription: `Find farm jobs in ${name}. Browse sustainable agriculture positions including organic farms, ranches, and crop production across ${code}. Housing & benefits available.`,
    heroDescription: `Discover agricultural careers across ${name}, with opportunities on farms, ranches, and sustainable agriculture operations throughout the state.`,
    content: {
      introduction: `${name}'s agricultural sector offers diverse opportunities across farms and ranches throughout the state. The agricultural industry combines traditional farming practices with modern sustainable agriculture techniques, creating varied career paths for those passionate about farming, ranching, and sustainable food production. From row crops to livestock operations, ${name} agriculture provides meaningful work in rural communities.`,
      whyWork: `Working on ${name} farms offers the opportunity to contribute to sustainable food systems while enjoying rural living and strong agricultural community connections. Many farm operations provide competitive wages and benefits packages, with some positions including housing arrangements for full-time employees. The state's agricultural sector values hard work, reliability, and a commitment to quality production.`,
      typesOfFarms: `${name} agriculture includes diverse farming operations: cattle and livestock ranches, crop production farms, organic and sustainable agriculture operations, specialty crop farms, dairy operations, and increasingly regenerative agriculture practices. Both small family farms and larger commercial operations provide employment opportunities throughout the state.`,
      gettingStarted: `Entry-level farm positions in ${name} are available year-round, with peak hiring during planting and harvest seasons. Most entry-level positions require no specific certifications, though experience with farming, livestock, or equipment operation is valued. Agricultural extension services provide training resources. Many farmers value strong work ethic and willingness to learn over previous experience, providing on-the-job training for motivated individuals.`
    },
    faqs: [
      {
        question: `What's the average salary for farm workers in ${name}?`,
        answer: `Farm worker salaries in ${name} typically range from $28,000-$50,000 annually for full-time positions, with equipment operators and supervisors earning more. Many farms provide additional benefits including housing, meals, and health insurance, which significantly increases total compensation value.`
      },
      {
        question: `What types of farm jobs are available in ${name}?`,
        answer: `${name} offers diverse agricultural positions including farm hands, ranch workers, equipment operators, livestock handlers, crop production workers, farm managers, and specialized positions in organic and sustainable agriculture. Both seasonal and year-round positions are available.`
      },
      {
        question: `Is housing typically provided with farm jobs in ${name}?`,
        answer: `Many larger farms and ranches in ${name} provide on-site housing for full-time positions, especially in rural areas. Housing arrangements vary by operation and can include mobile homes, farm houses, or other accommodations, often with utilities included. Always inquire about housing availability during the application process.`
      },
      {
        question: `What certifications are helpful for farm work in ${name}?`,
        answer: `While not always required, certifications such as CDL (Commercial Driver's License), pesticide applicator licenses, equipment operation certifications, and organic farming knowledge can improve job prospects and earning potential. State agricultural extension services often provide training programs.`
      }
    ],
    relatedStates: relatedStates.length > 0 ? relatedStates : [],
    majorCities: majorCities.length > 0 ? majorCities : [`${name} City`, 'Springfield', 'Jackson']
  };
}

// Generate content for all 50 states (excluding DC)
export const STATE_CONTENT_MAP: Record<string, StateContent> = {
  AL: generateStateContent('AL', 'Alabama',
    ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa'],
    ['GA', 'TN', 'MS', 'FL']),

  AK: generateStateContent('AK', 'Alaska',
    ['Anchorage', 'Fairbanks', 'Palmer', 'Wasilla', 'Homer'],
    ['WA', 'OR']),

  AZ: generateStateContent('AZ', 'Arizona',
    ['Phoenix', 'Tucson', 'Yuma', 'Flagstaff', 'Mesa'],
    ['CA', 'NM', 'NV', 'UT']),

  AR: generateStateContent('AR', 'Arkansas',
    ['Little Rock', 'Fort Smith', 'Fayetteville', 'Jonesboro', 'Pine Bluff'],
    ['MO', 'TN', 'MS', 'LA', 'TX', 'OK']),

  CA: generateStateContent('CA', 'California',
    ['Los Angeles', 'San Francisco', 'San Diego', 'Fresno', 'Sacramento', 'Salinas'],
    ['OR', 'AZ', 'NV']),

  CO: generateStateContent('CO', 'Colorado',
    ['Denver', 'Colorado Springs', 'Fort Collins', 'Boulder', 'Grand Junction'],
    ['WY', 'NE', 'KS', 'NM', 'UT']),

  CT: generateStateContent('CT', 'Connecticut',
    ['Hartford', 'New Haven', 'Stamford', 'Waterbury', 'Norwalk'],
    ['MA', 'RI', 'NY']),

  DE: generateStateContent('DE', 'Delaware',
    ['Wilmington', 'Dover', 'Newark', 'Middletown'],
    ['MD', 'PA', 'NJ']),

  FL: generateStateContent('FL', 'Florida',
    ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Tallahassee'],
    ['GA', 'AL']),

  GA: generateStateContent('GA', 'Georgia',
    ['Atlanta', 'Savannah', 'Augusta', 'Macon', 'Athens'],
    ['AL', 'TN', 'SC', 'NC', 'FL']),

  HI: generateStateContent('HI', 'Hawaii',
    ['Honolulu', 'Hilo', 'Kailua', 'Waipahu'],
    []),

  ID: generateStateContent('ID', 'Idaho',
    ['Boise', 'Meridian', 'Twin Falls', 'Idaho Falls', 'Pocatello'],
    ['WA', 'OR', 'NV', 'UT', 'WY', 'MT']),

  IL: generateStateContent('IL', 'Illinois',
    ['Chicago', 'Springfield', 'Peoria', 'Rockford', 'Champaign'],
    ['WI', 'IN', 'KY', 'MO', 'IA']),

  IN: generateStateContent('IN', 'Indiana',
    ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Bloomington'],
    ['MI', 'OH', 'KY', 'IL']),

  IA: generateStateContent('IA', 'Iowa',
    ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City'],
    ['MN', 'WI', 'IL', 'MO', 'NE', 'SD']),

  KS: generateStateContent('KS', 'Kansas',
    ['Wichita', 'Overland Park', 'Kansas City', 'Topeka', 'Lawrence'],
    ['NE', 'MO', 'OK', 'CO']),

  KY: generateStateContent('KY', 'Kentucky',
    ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington'],
    ['OH', 'IN', 'IL', 'MO', 'TN', 'VA', 'WV']),

  LA: generateStateContent('LA', 'Louisiana',
    ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles'],
    ['AR', 'MS', 'TX']),

  ME: generateStateContent('ME', 'Maine',
    ['Portland', 'Lewiston', 'Bangor', 'Auburn', 'Augusta'],
    ['NH']),

  MD: generateStateContent('MD', 'Maryland',
    ['Baltimore', 'Annapolis', 'Frederick', 'Rockville', 'Gaithersburg'],
    ['PA', 'DE', 'VA', 'WV']),

  MA: generateStateContent('MA', 'Massachusetts',
    ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell'],
    ['NH', 'VT', 'NY', 'CT', 'RI']),

  MI: generateStateContent('MI', 'Michigan',
    ['Detroit', 'Grand Rapids', 'Lansing', 'Ann Arbor', 'Traverse City'],
    ['OH', 'IN', 'WI']),

  MN: generateStateContent('MN', 'Minnesota',
    ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth', 'Bloomington'],
    ['WI', 'IA', 'SD', 'ND']),

  MS: generateStateContent('MS', 'Mississippi',
    ['Jackson', 'Gulfport', 'Biloxi', 'Hattiesburg', 'Meridian'],
    ['TN', 'AL', 'LA', 'AR']),

  MO: generateStateContent('MO', 'Missouri',
    ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence'],
    ['IA', 'IL', 'KY', 'TN', 'AR', 'OK', 'KS', 'NE']),

  MT: generateStateContent('MT', 'Montana',
    ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Helena'],
    ['ND', 'SD', 'WY', 'ID']),

  NE: generateStateContent('NE', 'Nebraska',
    ['Omaha', 'Lincoln', 'Grand Island', 'Kearney', 'Fremont'],
    ['SD', 'IA', 'MO', 'KS', 'CO', 'WY']),

  NV: generateStateContent('NV', 'Nevada',
    ['Las Vegas', 'Reno', 'Henderson', 'Carson City', 'Sparks'],
    ['OR', 'ID', 'UT', 'AZ', 'CA']),

  NH: generateStateContent('NH', 'New Hampshire',
    ['Manchester', 'Nashua', 'Concord', 'Portsmouth', 'Dover'],
    ['ME', 'VT', 'MA']),

  NJ: generateStateContent('NJ', 'New Jersey',
    ['Newark', 'Jersey City', 'Trenton', 'Princeton', 'Atlantic City'],
    ['NY', 'PA', 'DE']),

  NM: generateStateContent('NM', 'New Mexico',
    ['Albuquerque', 'Santa Fe', 'Las Cruces', 'Roswell', 'Farmington'],
    ['CO', 'OK', 'TX', 'AZ']),

  NY: generateStateContent('NY', 'New York',
    ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
    ['PA', 'NJ', 'CT', 'MA', 'VT']),

  NC: generateStateContent('NC', 'North Carolina',
    ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Wilmington'],
    ['VA', 'TN', 'GA', 'SC']),

  ND: generateStateContent('ND', 'North Dakota',
    ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'Williston'],
    ['MN', 'SD', 'MT']),

  OH: generateStateContent('OH', 'Ohio',
    ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
    ['MI', 'PA', 'WV', 'KY', 'IN']),

  OK: generateStateContent('OK', 'Oklahoma',
    ['Oklahoma City', 'Tulsa', 'Norman', 'Stillwater', 'Lawton'],
    ['KS', 'MO', 'AR', 'TX', 'NM', 'CO']),

  OR: generateStateContent('OR', 'Oregon',
    ['Portland', 'Salem', 'Eugene', 'Bend', 'Medford'],
    ['WA', 'ID', 'NV', 'CA']),

  PA: generateStateContent('PA', 'Pennsylvania',
    ['Philadelphia', 'Pittsburgh', 'Harrisburg', 'Lancaster', 'Allentown'],
    ['NY', 'NJ', 'DE', 'MD', 'WV', 'OH']),

  RI: generateStateContent('RI', 'Rhode Island',
    ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'Newport'],
    ['MA', 'CT']),

  SC: generateStateContent('SC', 'South Carolina',
    ['Columbia', 'Charleston', 'Greenville', 'Myrtle Beach', 'Spartanburg'],
    ['NC', 'GA']),

  SD: generateStateContent('SD', 'South Dakota',
    ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown'],
    ['ND', 'MN', 'IA', 'NE', 'WY', 'MT']),

  TN: generateStateContent('TN', 'Tennessee',
    ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville'],
    ['KY', 'VA', 'NC', 'GA', 'AL', 'MS', 'AR', 'MO']),

  TX: generateStateContent('TX', 'Texas',
    ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'],
    ['OK', 'AR', 'LA', 'NM']),

  UT: generateStateContent('UT', 'Utah',
    ['Salt Lake City', 'Provo', 'West Valley City', 'St. George', 'Logan'],
    ['ID', 'WY', 'CO', 'NM', 'AZ', 'NV']),

  VT: generateStateContent('VT', 'Vermont',
    ['Burlington', 'Montpelier', 'Rutland', 'Brattleboro', 'Stowe'],
    ['NY', 'NH', 'MA']),

  VA: generateStateContent('VA', 'Virginia',
    ['Richmond', 'Virginia Beach', 'Norfolk', 'Charlottesville', 'Roanoke'],
    ['MD', 'WV', 'KY', 'TN', 'NC']),

  WA: generateStateContent('WA', 'Washington',
    ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellingham'],
    ['OR', 'ID']),

  WV: generateStateContent('WV', 'West Virginia',
    ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling'],
    ['OH', 'PA', 'MD', 'VA', 'KY']),

  WI: generateStateContent('WI', 'Wisconsin',
    ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine'],
    ['MI', 'IL', 'IA', 'MN']),

  WY: generateStateContent('WY', 'Wyoming',
    ['Cheyenne', 'Casper', 'Laramie', 'Jackson', 'Gillette'],
    ['MT', 'SD', 'NE', 'CO', 'UT', 'ID'])
};

// Helper function to get state content
export function getStateContent(stateCodeOrName: string): StateContent | null {
  const upperCode = stateCodeOrName.toUpperCase();
  return STATE_CONTENT_MAP[upperCode] || null;
}

// Generate SEO-friendly meta tags for a state
export function generateStateMetaTags(stateCode: string, jobCount: number) {
  const content = getStateContent(stateCode);
  if (!content) return null;

  return {
    title: content.metaTitle.replace('Agricultural Careers', `${jobCount}+ Agricultural Position${jobCount !== 1 ? 's' : ''}`),
    description: content.metaDescription,
  };
}
