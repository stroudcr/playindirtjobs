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

  GA: {
    code: 'GA',
    name: 'Georgia',
    metaTitle: 'Farm Jobs in Georgia | #1 Poultry, Peanuts & Pecans State | AG Careers',
    metaDescription: 'Find farm jobs in Georgia, the #1 state for poultry, peanuts, pecans & timber. $73B agriculture industry with opportunities on cotton farms, pecan groves, and poultry operations across GA.',
    heroDescription: 'Discover agricultural careers across Georgia, the nation\'s #1 producer of poultry, peanuts, pecans, and timber. From cotton fields in the Coastal Plain to peach orchards in the Piedmont and poultry operations statewide, Georgia offers diverse opportunities in a $73 billion agriculture industry.',
    content: {
      introduction: 'Georgia stands as an agricultural powerhouse, ranking #1 nationally in broiler chicken production, peanuts (producing 53% of U.S. peanuts), pecans, and timber harvesting. The state\'s agriculture and related industries contribute $73.2 billion to Georgia\'s economy, with 9.9 million acres of farmland supporting diverse agricultural operations. Georgia\'s humid subtropical climate and unique geography—from the Blue Ridge Mountains to the Coastal Plain—enable year-round production of over 100 commodities. The state also ranks #2 nationally for cotton production, #4 for blueberries (now Georgia\'s most valuable fruit crop at $449 million), and is home to the famous Vidalia onions, which can only be grown in 20 designated South Georgia counties. With poultry and eggs representing over 40% of the state\'s total commodity value at $6.6 billion, plus significant timber ($42 billion impact), cotton ($3 billion+), and specialty crop industries, Georgia provides stable, diverse career paths in agriculture.',
      whyWork: 'Working on Georgia farms offers exceptional advantages including year-round employment opportunities due to the state\'s mild winters and long growing season (USDA zones 6a-9a). Farm workers in Georgia earn competitive wages averaging $13.79-$16.25 per hour, with H-2A program workers earning $14.68/hour (projected to increase 10% in 2025). Many operations provide housing, especially for seasonal workers during peak harvest periods. Georgia\'s agricultural community is supported by world-class education through the University of Georgia (ranked #5 public university for agricultural sciences), Abraham Baldwin Agricultural College in Tifton, and Fort Valley State University. The state\'s diverse agricultural sectors—from the massive poultry industry concentrated in northeast Georgia to peanut and pecan operations in the south, cotton farms throughout the Coastal Plain, and blueberry operations generating $350 million annually—provide varied career paths. Georgia also leads in timber production with 22 million acres of commercially available private timberland. The cost of living in rural agricultural areas remains affordable, and strong agricultural extension services through UGA provide ongoing training and support.',
      typesOfFarms: 'Georgia agriculture offers exceptional diversity. Poultry operations dominate, particularly in northeast Georgia, with the state producing more broilers than any other (though poultry production has grown five-fold since the 1970s to 7.5 billion pounds annually). Peanut farms throughout the Coastal Plain produce over 1.56 million tons annually, with late fall harvests creating seasonal employment. Pecan groves, primarily in southern counties, harvest from October through December, offering prime seasonal work. Cotton operations, ranking #2 nationally, plant mid-April through June and harvest September through November, with top producing counties including Bulloch, Dooly, Colquitt, Mitchell, and Worth. Blueberry farms, now Georgia\'s most valuable fruit crop, harvest June through August across 25,000 acres. The timber industry, Georgia\'s #1 forestry operation nationally with $42 billion economic impact, provides year-round employment. Vidalia onion farms in 20 designated South Georgia counties harvest in April, producing $150 million in annual value. Additional operations include cattle ranches in the Piedmont, vegetable farms (two-thirds concentrated in southwest Georgia), peach orchards, tobacco farms, and diversified operations growing cantaloupe, watermelon, cucumbers, and bell peppers.',
      gettingStarted: 'Entry-level farm positions in Georgia are available year-round, with peak hiring during planting seasons (spring: March-June) and harvest periods (summer-fall: June-December depending on crop). Major harvest seasons include blueberries (June-August), cotton (September-November), peanuts (late fall), pecans (October-December), and Vidalia onions (April). No specific certifications are required for most entry-level positions, though pesticide applicator licenses are valuable—Georgia offers Private Applicator (for your own property, 5-year validity), Commercial Applicator (for applying to others\' property), and Contractor licenses through the Georgia Department of Agriculture. CDL licenses significantly expand opportunities, especially in cotton and grain operations. Equipment operation experience, mechanical aptitude, and physical stamina for harvest work are highly valued. The University of Georgia Cooperative Extension System, with 1,057 agents serving all counties, provides free training and resources. Abraham Baldwin Agricultural College in Tifton offers degree programs and one-year teaching certifications in agriculture. Top agricultural counties for employment include Colquitt County ($635 million farm gate value, "Plant Capital of the World"), Hart County ($629 million), and Franklin County ($546 million). The state\'s H-2A program brings 37,536 workers annually, making Georgia a top-3 destination for seasonal agricultural employment.'
    },
    faqs: [
      {
        question: 'What\'s the average salary for farm workers in Georgia?',
        answer: 'Georgia farm workers earn $13.79-$16.25 per hour on average, with the 25th percentile at $12.60/hour and 75th percentile at $16.25/hour according to 2024 data. H-2A seasonal workers earn $14.68/hour (up from $13.67 in 2023), with a projected 10% increase to over $16/hour expected in 2025 for the Southeast region. Many positions include housing, meals, and benefits, significantly increasing total compensation. Specialized positions like equipment operators, farm managers, and those with pesticide applicator licenses typically earn higher wages. Seasonal positions during peak harvest (blueberries, cotton, peanuts, pecans) often offer longer hours and higher earning potential.'
      },
      {
        question: 'What types of farm jobs are most common in Georgia?',
        answer: 'Poultry operations offer the most positions statewide, with Georgia producing more broilers than any other state ($6.6 billion industry). The poultry sector particularly dominates northeast Georgia and provides year-round employment in production, processing, and management roles. Seasonal positions are abundant in peanut farming (late fall harvest), cotton operations (September-November harvest), pecan groves (October-December), blueberry farms (June-August), and timber operations (year-round). Cotton farms need workers for planting (April-June) and harvesting. Other common positions include livestock handlers in Piedmont cattle operations, greenhouse workers (Colquitt County is the "Plant Capital of the World"), vegetable farm workers in southwest Georgia, and specialized positions in Vidalia onion operations (20-county region). Farm managers, equipment operators, and CDL drivers are consistently in demand across all sectors.'
      },
      {
        question: 'What makes Georgia\'s peanut industry special?',
        answer: 'Georgia is the #1 peanut-producing state in the nation, growing 53% of all U.S. peanuts—over 1.56 million tons in 2023. Peanuts are Georgia\'s official state crop and became significant in the early 1900s when George Washington Carver suggested them as an alternative to cotton threatened by boll weevil infestations. During WWII, Georgia farmers were encouraged to plant maximum peanut acreage for oil production to support the war effort. The crop has deep historical significance, famously connected to President Jimmy Carter, who grew up on his family\'s peanut farm in Plains, Georgia (Sumter County) and returned from the Navy in 1953 to run the Carter family peanut farm and warehouse. Peanut farming is concentrated in the Coastal Plain region with its ideal sandy soils. Harvest season in late fall creates substantial seasonal employment opportunities. The industry combines traditional farming heritage with modern agricultural technology.'
      },
      {
        question: 'Are Vidalia onions really unique to Georgia?',
        answer: 'Yes! Vidalia onions can only be grown in 20 designated counties in South Georgia, protected by state law and federal marketing order. The unique combination of weather, water, and soil in these specific counties cannot be replicated anywhere else in the world, making Vidalia onions a true Georgia original. The 2024 growing season saw 11,000 acres planted with an annual farm gate value around $150 million. The official pack date for 2024 was April 17. This geographic exclusivity, similar to Champagne from France\'s Champagne region, makes Vidalia onion farming a specialized career opportunity available only in Georgia. The 20-county Vidalia onion region includes some of the state\'s most productive agricultural areas in the Coastal Plain.'
      },
      {
        question: 'What educational resources are available for agriculture careers in Georgia?',
        answer: 'Georgia offers exceptional agricultural education through several institutions. The University of Georgia\'s College of Agricultural & Environmental Sciences (founded 1859) ranks #5 among public universities for agricultural sciences nationally, with $54.8 million in research expenditures and 1,057 Extension agents serving every Georgia county. Abraham Baldwin Agricultural College in Tifton, founded in 1908, is the South\'s premier destination for agricultural studies, enrolling 3,825 students from 148 Georgia counties. ABAC offers both two-year and four-year programs including Bachelor of Science degrees in Agribusiness, Agricultural Technology Management, Agriculture, and Environmental Horticulture. Fort Valley State University, Georgia\'s 1890 land-grant HBCU, is the state\'s top producer of African-American students earning bachelor\'s degrees in agriculture. The UGA Cooperative Extension System provides free training, workshops, and resources statewide. Georgia also offers various USDA grants including SARE agriculture grants, beginning farmer microloans, and climate-smart agriculture funding.'
      },
      {
        question: 'What is the job market outlook for Georgia agriculture?',
        answer: 'Georgia agriculture employment remains strong with 6-8% of the state\'s workforce directly engaged in agriculture and nearly 12% in agriculture-supported roles. The poultry industry continues growing (five-fold increase since 1970s), timber remains robust ($42 billion impact with 141,000 jobs), and specialty crops like blueberries continue expanding (11% acreage increase from 2011-2021). However, the September 2024 Hurricane Helene caused significant impacts: $1.2 billion damage to the timber industry affecting 8.9 million acres, and damage to blueberry and pecan crops that will affect 2025 yields. Despite this setback, Georgia\'s agricultural diversity provides resilience. The H-2A program brings 37,536 workers annually (making Georgia a top-3 destination), indicating sustained demand. Cotton production faces challenges (1.93 million bales in 2024, down 11%), but the industry still provides 53,000 jobs and over $3 billion impact. Long-term outlook remains positive due to Georgia\'s geographic advantages, strong educational infrastructure, and diverse commodity production.'
      }
    ],
    relatedStates: ['AL', 'TN', 'SC', 'NC', 'FL'],
    majorCities: ['Tifton', 'Plains', 'Colquitt County', 'Hart County', 'Franklin County', 'Atlanta', 'Savannah', 'Augusta', 'Macon']
  },

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
