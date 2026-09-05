// Verified against each organizer's public registration page on 2026-09-05.
// Original editorial summaries. No organizer images, logos, testimonials or implied partnerships.
// These ten first-time listing gifts do not waive the organizer's course tuition.
import type { WorkshopInput } from "../lib/workshop-validation";
type Seed = Omit<WorkshopInput, "managementEmail"> & {
  slug: string;
  sourceUrl: string;
};
const defaults = {
  instructor: "",
  prerequisites: "",
  city: "",
  state: "",
  venue: "",
  address: "",
  postalCode: "",
  startAt: null,
  endAt: null,
  registrationClosesAt: null,
  timeZone: "America/New_York",
  scheduleNotes: "",
  priceNotes: "",
};
const osu = {
  organization: "Oregon State University",
  organizerWebsite: "https://workspace.oregonstate.edu/",
  format: "self-paced" as const,
  timeZone: "America/Los_Angeles",
};
const cornell = {
  organization: "Cornell Small Farms Program",
  organizerWebsite: "https://smallfarms.cornell.edu/",
  format: "live-online" as const,
  tuitionCents: 19900,
  priceNotes:
    "Income-based tuition: $199, $255 or $299. Choose the appropriate tier with Cornell.",
};
const tilth = {
  organization: "Tilth Alliance",
  organizerWebsite: "https://tilthalliance.org/",
  format: "in-person" as const,
  city: "Seattle",
  state: "WA",
  timeZone: "America/Los_Angeles",
};

export const workshopSeeds: Seed[] = [
  {
    ...defaults,
    ...osu,
    slug: "farm-safety-first-aid-oregon-state",
    title: "Farm Safety and First Aid",
    instructor: "Jacob Powell",
    topic: "equipment",
    level: "Beginner",
    tuitionCents: 0,
    priceNotes:
      "Currently offered free by Oregon State. Check the organizer’s page for any price changes.",
    summary:
      "Build awareness of everyday farm hazards and explore emergency-response basics in a self-paced course for agricultural workers.",
    description:
      "Oregon State’s online course introduces safety considerations around machinery, animals and rural workplaces. Lessons cover recognizing hazards, preparing for emergencies and organizing first-aid supplies. It offers a practical starting point for people entering agricultural work and for teams revisiting their safety routines.",
    outcomes: [
      "Recognize common equipment, livestock and environmental hazards.",
      "Explore farm-specific emergency preparation and first-aid topics.",
      "Review what belongs in an accessible farm first-aid kit.",
    ],
    audience:
      "Farm employees, ranchers, agricultural students and people new to rural work.",
    prerequisites:
      "No previous experience required. Review the organizer’s description of course completion and training scope.",
    scheduleNotes: "Self-paced online lessons; approximately 3–4 hours.",
    registrationUrl:
      "https://workspace.oregonstate.edu/course/farm-safety-and-first-aid-osu-continuing-education",
    sourceUrl:
      "https://workspace.oregonstate.edu/course/farm-safety-and-first-aid-osu-continuing-education",
  },
  {
    ...defaults,
    ...osu,
    slug: "pasture-grazing-management-oregon-state",
    title: "Introduction to Pasture and Grazing Management",
    topic: "livestock",
    level: "All levels",
    tuitionCents: 0,
    summary:
      "Connect healthier forage with better livestock management through an accessible introduction to pasture assessment and rotational grazing.",
    description:
      "This self-paced Oregon State module approaches livestock production through the health of the pasture. Explore how plants respond to grazing, how to evaluate existing forage and how seasonal management decisions affect the system. The course also introduces options for irrigation, weeds, nutrients and pasture renovation.",
    outcomes: [
      "Assess pasture condition and understand grass growth.",
      "Explore rotational grazing in relation to the forage growth cycle.",
      "Identify seasonal pasture-management and improvement options.",
    ],
    audience:
      "Livestock producers, ranch workers and landowners interested in improving a forage-based system.",
    scheduleNotes:
      "Allow approximately 2–4 hours, plus optional reading. Oregon State lists six months of access after registration.",
    registrationUrl:
      "https://workspace.oregonstate.edu/course/pasture-and-grazing-management",
    sourceUrl:
      "https://workspace.oregonstate.edu/course/pasture-and-grazing-management",
  },
  {
    ...defaults,
    ...osu,
    slug: "organic-nutrient-management-vegetables-oregon-state",
    title: "Organic Nutrient Management for Vegetable Production",
    topic: "soil",
    level: "Experienced",
    tuitionCents: 2500,
    summary:
      "Use soil testing and a whole-farm perspective to make more informed nutrient decisions on a diversified vegetable farm.",
    description:
      "Designed for people managing vegetable production, this Oregon State course connects crop needs with soil-building decisions. Compare organic nutrient sources and consider how available nitrogen, soil condition and farm goals shape a management plan. The material emphasizes decisions that work across multiple seasons.",
    outcomes: [
      "Compare nutrient sources and their soil-building characteristics.",
      "Use soil-test information to guide nutrient decisions.",
      "Develop and evaluate a farm nutrient-management plan.",
    ],
    audience:
      "Managers of small and medium diversified vegetable farms and experienced growers.",
    prerequisites:
      "Oregon State recommends at least four years of farming experience; beginners may find the material challenging.",
    scheduleNotes: "Online and self-paced. Begin when you are ready.",
    registrationUrl:
      "https://workspace.oregonstate.edu/course/organic-nutrient-management-for-vegetable-production",
    sourceUrl:
      "https://workspace.oregonstate.edu/course/organic-nutrient-management-for-vegetable-production",
  },
  {
    ...defaults,
    ...osu,
    slug: "growing-saving-seed-farm-business-oregon-state",
    title: "Growing and Saving Seed as a Farm Business",
    instructor: "Jennifer Kling",
    topic: "growing",
    level: "All levels",
    tuitionCents: 3000,
    summary:
      "Explore the crop-production skills and business decisions involved in saving seed for your farm or developing a seed enterprise.",
    description:
      "Follow seed production from plant biology through harvest, cleaning and storage. This Oregon State course considers both the field practices and planning decisions involved in producing seed. It is relevant to growers keeping seed for their own use as well as people considering commercial production.",
    outcomes: [
      "Connect plant reproduction and regional growing conditions with seed-crop choices.",
      "Explore isolation, population size, harvest and storage practices.",
      "Consider goals and marketing decisions for a seed enterprise.",
    ],
    audience:
      "Small-farm growers, seed-company workers and gardeners interested in seed production.",
    scheduleNotes: "Self-paced online course with on-demand access.",
    registrationUrl:
      "https://workspace.oregonstate.edu/course/growing-and-saving-seed-as-farm-business",
    sourceUrl:
      "https://workspace.oregonstate.edu/course/growing-and-saving-seed-as-farm-business",
  },
  {
    ...defaults,
    ...cornell,
    slug: "starting-at-square-one-cornell-fall-2026",
    title: "Starting at Square One: Plan Your Farm",
    instructor: "Sarah Williford",
    topic: "growing",
    level: "Beginner",
    startAt: "2026-09-21T18:30:00-04:00",
    endAt: "2026-10-26T20:00:00-04:00",
    summary:
      "Take the first steps toward a farm that fits your goals, resources and values, with six weeks of guided online learning.",
    description:
      "Cornell’s BF 101 course helps aspiring farmers organize the decisions that come before starting a farm. Participants examine their available resources, consider personal priorities and begin a start-up plan. Readings and assignments are complemented by live weekly discussions, with recordings available afterward.",
    outcomes: [
      "Inventory resources that could support a farm start-up.",
      "Connect your values and quality-of-life goals with farm decisions.",
      "Find useful resources for land assessment, enterprises and further learning.",
    ],
    audience:
      "People exploring a first farm or planning a start-up in the next few years.",
    prerequisites: "You do not need to own land or have chosen what to grow.",
    scheduleNotes:
      "Mondays, September 21–October 26, 2026, 6:30–8:00 p.m. Eastern. Six weekly webinars plus independent work; recordings are provided.",
    registrationUrl:
      "https://smallfarmcourses.com/p/bf-101-starting-at-square-one",
    sourceUrl: "https://smallfarmcourses.com/p/bf-101-starting-at-square-one",
  },
  {
    ...defaults,
    ...cornell,
    slug: "high-tunnel-season-extension-cornell-2027",
    title: "Season Extension with High Tunnels",
    instructor: "Rich Woodbridge",
    topic: "greenhouse",
    level: "All levels",
    startAt: "2027-01-13T19:00:00-05:00",
    endAt: "2027-02-17T20:30:00-05:00",
    summary:
      "Evaluate high-tunnel structures, crop choices and management practices before investing in a longer growing season.",
    description:
      "Cornell’s BF 220 course examines what it takes to grow successfully under an unheated protective structure. Explore site suitability, soil care and crop selection alongside the business case for season extension. Weekly webinars accompany independent reading, assignments and discussion.",
    outcomes: [
      "Assess a site and compare suitable high-tunnel structures.",
      "Plan soil fertility, crop choices and pest-management approaches.",
      "Consider whether a high tunnel fits your farm’s goals and resources.",
    ],
    audience:
      "Vegetable growers considering protected production, including beginners ready to explore the topic.",
    prerequisites:
      "Outdoor vegetable experience is helpful. Examples focus on colder U.S. growing regions, especially zones 4–6.",
    scheduleNotes:
      "Wednesdays, January 13–February 17, 2027, 7:00–8:30 p.m. Eastern. Six weekly webinars; recordings are available. Registration is already open.",
    registrationUrl:
      "https://smallfarmcourses.com/p/bf-220-season-extension-with-high-tunnels",
    sourceUrl:
      "https://smallfarmcourses.com/p/bf-220-season-extension-with-high-tunnels",
  },
  {
    ...defaults,
    organization: "The Market Gardener Institute",
    organizerWebsite: "https://themarketgardener.com/",
    slug: "start-your-market-gardener-journey",
    title: "Start Your Market Gardener Journey",
    instructor: "Jean-Martin Fortier",
    topic: "growing",
    format: "self-paced",
    level: "Beginner",
    tuitionCents: 14900,
    summary:
      "Get an introduction to small-scale market gardening, from choosing a site and planning crops to growing and selling vegetables.",
    description:
      "This introductory online course presents the foundations of a biointensive market garden. Video lessons connect farm layout and production planning with seed starting, field practices and sales. Crop-specific material covers eight vegetables commonly grown in a market garden, with downloadable reference materials.",
    outcomes: [
      "Understand the elements of a small-scale market-garden system.",
      "Explore site design, crop planning and production techniques.",
      "Follow crop-specific guidance from seed through harvest.",
    ],
    audience:
      "First-time growers, career changers and people considering work on a small vegetable farm.",
    prerequisites:
      "Designed for beginners; prior farming experience is not required.",
    scheduleNotes:
      "Approximately four hours of online content, taken at your own pace. The organizer lists lifetime access.",
    registrationUrl: "https://themarketgardener.com/starthere/",
    sourceUrl: "https://themarketgardener.com/starthere/",
  },
  {
    ...defaults,
    organization: "Pasa Sustainable Agriculture",
    organizerWebsite: "https://pasafarming.org/",
    slug: "cover-crops-soil-health-philadelphia-2026",
    title: "Cover Crops for Building Soil Health",
    instructor: "Farmer Shawn, Dirty South Farms",
    topic: "soil",
    format: "in-person",
    level: "All levels",
    tuitionCents: 0,
    city: "Philadelphia",
    state: "PA",
    venue: "Growing Groceries Community Plot",
    address: "1618 S 20th St",
    postalCode: "19145",
    startAt: "2026-10-06T17:30:00-04:00",
    endAt: "2026-10-06T19:30:00-04:00",
    summary:
      "Explore fall cover crops in a Philadelphia community growing space and learn ways to care for soil between growing seasons.",
    description:
      "Join Pasa for an on-site workshop about using cover crops to support soil organic matter, nitrogen and weed management. Farmer Shawn discusses choosing seed, deciding when to sow and protecting young growth. The session welcomes people tending everything from small garden spaces to urban farms.",
    outcomes: [
      "Choose cover-crop seed and plan a sowing timeline.",
      "Explore spacing and practical frost-protection approaches.",
      "Connect winter soil care with next season’s growing plans.",
    ],
    audience:
      "Urban farmers, community gardeners and growers interested in building soil health.",
    prerequisites:
      "Dress for outdoor garden activities and bring a water bottle and notebook.",
    scheduleNotes:
      "Tuesday, October 6, 2026, 5:30–7:30 p.m. Eastern. Registration is required; the organizer lists a 20-person capacity.",
    registrationUrl: "https://pasa.tfaforms.net/1770",
    sourceUrl: "https://pasa.tfaforms.net/1770",
  },
  {
    ...defaults,
    ...tilth,
    slug: "put-your-garden-to-bed-seattle-2026",
    title: "Put Your Garden to Bed",
    instructor: "Alex Soleil",
    topic: "soil",
    level: "All levels",
    tuitionCents: 6000,
    priceNotes:
      "Regular ticket $60; $75 supporting ticket and limited $30 reduced-price tickets. Check current ticket availability with Tilth.",
    venue: "Rainier Beach Urban Farm and Wetlands",
    address: "5513 S Cloverdale St",
    postalCode: "98118",
    startAt: "2026-09-17T18:00:00-07:00",
    endAt: "2026-09-17T20:00:00-07:00",
    summary:
      "Prepare garden beds for winter with an evening of soil-building ideas, hands-on activities and a Seattle garden tour.",
    description:
      "Tilth Alliance combines discussion and garden practice in this class on caring for beds after summer crops finish. Explore the role of organic matter, cover crops and composting mulches in winter protection. The session takes place both indoors and outdoors at Rainier Beach Urban Farm and Wetlands.",
    outcomes: [
      "Plan final harvests and the transition out of summer crops.",
      "Explore cover-crop selection, planting and incorporation.",
      "Use organic matter and mulches to care for garden beds.",
    ],
    audience:
      "Gardeners and urban growers preparing their growing spaces for fall and winter.",
    prerequisites:
      "Wear clothing suitable for the weather and garden activities.",
    scheduleNotes:
      "Thursday, September 17, 2026, 6:00–8:00 p.m. Pacific. The organizer limits the class to 15 participants.",
    registrationUrl:
      "https://tilthalliance.org/event/put-your-garden-to-bed-4/",
    sourceUrl: "https://tilthalliance.org/event/put-your-garden-to-bed-4/",
  },
  {
    ...defaults,
    ...tilth,
    slug: "pruning-propagating-edible-garden-seattle-2026",
    title: "Pruning and Propagating for the Edible Garden",
    instructor: "Marni Sorin",
    topic: "greenhouse",
    level: "All levels",
    tuitionCents: 13000,
    priceNotes:
      "Regular ticket $130; supporting ticket $150. Reduced and solidarity tickets were sold out when checked; confirm current options with Tilth.",
    venue: "Good Shepherd Center",
    address: "4649 Sunnyside Ave N",
    postalCode: "98103",
    startAt: "2026-10-03T10:00:00-07:00",
    endAt: "2026-10-03T14:00:00-07:00",
    summary:
      "Practice pruning and propagation while exploring how to maintain and multiply edible plants in a hands-on Seattle workshop.",
    description:
      "Spend four hours learning seasonal plant-care techniques with Tilth Alliance. A learning-garden tour and small-group activities introduce ways to prune edible plants and create new ones through division and cuttings. The workshop combines conversation, practice and take-home reference resources.",
    outcomes: [
      "Understand the purpose and timing of pruning and propagation.",
      "Practice pruning techniques with a small group.",
      "Explore plant division and propagation from cuttings.",
    ],
    audience:
      "Gardeners and aspiring growers interested in caring for edible perennials, shrubs and trees.",
    scheduleNotes:
      "Saturday, October 3, 2026, 10:00 a.m.–2:00 p.m. Pacific, including a half-hour lunch break. Approximately 15 places.",
    registrationUrl:
      "https://tilthalliance.org/event/pruning-propagating-for-the-edible-garden/",
    sourceUrl:
      "https://tilthalliance.org/event/pruning-propagating-for-the-edible-garden/",
  },
];
