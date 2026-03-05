import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to parse location into city and state
function parseLocation(location: string): { city: string; state: string; location: string } {
  const parts = location.split(',').map(p => p.trim());
  const city = parts[0] || '';
  const state = parts[1] || '';
  return { city, state, location };
}

const jobsData = [
  {
    slug: 'organic-farm-hand-vermont',
    title: 'Organic Farm Hand',
    company: 'Green Valley Farm',
    description: `We are seeking a dedicated farm hand to join our certified organic vegetable farm. You'll work alongside our experienced team to grow high-quality produce for local markets and CSA members.

Responsibilities:
• Planting, weeding, and harvesting vegetables
• Maintaining irrigation systems
• Operating tractors and farm equipment
• Assisting with greenhouse management
• Participating in farmers market sales

Requirements:
• Physical fitness and ability to work outdoors in all weather
• Enthusiasm for sustainable agriculture
• Willingness to learn and work as part of a team
• Previous farm experience preferred but not required`,
    location: 'Middlebury, VT',
    salaryMin: 35000,
    salaryMax: 42000,
    jobType: ['full-time', 'seasonal'],
    farmType: ['organic', 'vegetable'],
    categories: ['farm-hand', 'crop-production'],
    tags: ['sustainable', 'csa', 'farmers-market'],
    benefits: ['housing', 'meals', 'produce-share'],
    companyEmail: 'hiring@greenvalleyfarm.com',
    companyWebsite: 'https://greenvalleyfarm.com',
    applyEmail: 'hiring@greenvalleyfarm.com',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'ranch-hand-montana-cattle',
    title: 'Cattle Ranch Hand',
    company: 'Big Sky Ranch',
    description: `Looking for an experienced ranch hand to help manage our 500-head cattle operation in beautiful Montana. This is a year-round position for someone who loves working with livestock and the ranching lifestyle.

Responsibilities:
• Daily cattle care and health monitoring
• Fence repair and pasture management
• Operating ranch equipment and tractors
• Calving season assistance
• Hay production and feeding

Requirements:
• Previous cattle handling experience required
• Ability to ride horses preferred
• Valid driver's license
• Physically fit and able to work long hours during busy seasons
• Self-motivated and reliable`,
    location: 'Bozeman, MT',
    salaryMin: 40000,
    salaryMax: 50000,
    jobType: ['full-time'],
    farmType: ['conventional', 'livestock'],
    categories: ['ranch-hand', 'livestock-management'],
    tags: ['cattle', 'animal-care', 'equipment-operation'],
    benefits: ['housing', 'health-insurance', 'equipment'],
    companyEmail: 'jobs@bigskyranch.com',
    companyWebsite: 'https://bigskyranch.com',
    applyUrl: 'https://bigskyranch.com/careers',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'garden-manager-california',
    title: 'Garden Manager - Permaculture',
    company: 'Earthworks Garden Collective',
    description: `Join our thriving permaculture education center as Garden Manager. You'll oversee our demonstration gardens, food forest, and teaching spaces while mentoring apprentices and hosting workshops.

Responsibilities:
• Design and implement permaculture garden systems
• Lead educational workshops and farm tours
• Manage a team of apprentices and volunteers
• Plan crop rotations and companion plantings
• Maintain composting and water harvesting systems
• Coordinate with kitchen staff on harvest planning

Requirements:
• 3+ years permaculture or organic gardening experience
• Knowledge of water-wise gardening techniques
• Strong teaching and communication skills
• Permaculture design certificate preferred
• Comfortable with social media and documentation`,
    location: 'Santa Cruz, CA',
    salaryMin: 45000,
    salaryMax: 55000,
    jobType: ['full-time'],
    farmType: ['permaculture', 'organic', 'educational'],
    categories: ['gardener', 'farm-manager', 'education'],
    tags: ['sustainable', 'permaculture', 'teaching', 'food-forest'],
    benefits: ['health-insurance', 'professional-development', 'produce-share'],
    companyEmail: 'team@earthworksgarden.org',
    companyWebsite: 'https://earthworksgarden.org',
    applyEmail: 'team@earthworksgarden.org',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'dairy-farm-assistant-wisconsin',
    title: 'Dairy Farm Assistant',
    company: 'Clover Hill Dairy',
    description: `Family-owned grass-fed dairy farm seeking a reliable assistant to help with our milking herd of 80 Jersey cows. Great opportunity to learn traditional dairy farming.

Responsibilities:
• Morning and evening milking
• Cow health monitoring
• Pasture rotation
• Equipment cleaning and maintenance
• Calf care

Requirements:
• Early morning availability (4:30 AM start)
• Willingness to learn
• Good with animals
• Reliable transportation
• Weekend availability`,
    location: 'Madison, WI',
    salaryMin: 32000,
    salaryMax: 38000,
    jobType: ['full-time'],
    farmType: ['conventional', 'livestock'],
    categories: ['farm-hand', 'livestock-management'],
    tags: ['dairy', 'animal-care', 'grass-fed'],
    benefits: ['housing', 'dairy-products'],
    companyEmail: 'info@cloverhilldairy.com',
    applyEmail: 'info@cloverhilldairy.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'greenhouse-manager-oregon',
    title: 'Greenhouse Production Manager',
    company: 'Cascade Nursery',
    description: `We're looking for an experienced greenhouse manager to oversee our year-round production of vegetable starts and ornamental plants.

Responsibilities:
• Manage greenhouse staff (4-6 people)
• Plan production schedules
• Monitor and maintain climate control systems
• Pest and disease management (IPM practices)
• Quality control and inventory
• Customer relations for wholesale accounts

Requirements:
• 5+ years greenhouse production experience
• Knowledge of hydroponic and soil-based systems
• Strong organizational skills
• Experience with greenhouse automation
• Bachelor's degree in horticulture or related field preferred`,
    location: 'Eugene, OR',
    salaryMin: 50000,
    salaryMax: 65000,
    jobType: ['full-time'],
    farmType: ['conventional', 'greenhouse'],
    categories: ['farm-manager', 'greenhouse-production'],
    tags: ['hydroponics', 'management', 'year-round'],
    benefits: ['health-insurance', 'retirement', 'paid-time-off'],
    companyEmail: 'hr@cascadenursery.com',
    companyWebsite: 'https://cascadenursery.com',
    applyUrl: 'https://cascadenursery.com/careers',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'farm-apprentice-new-york',
    title: 'Farm Apprenticeship Program',
    company: 'Hudson Valley Farm School',
    description: `Comprehensive 8-month farm apprenticeship covering all aspects of diversified vegetable production, animal husbandry, and sustainable farm management.

What You'll Learn:
• Organic vegetable production from seed to harvest
• Small-scale livestock management (chickens, pigs, goats)
• Tractor operation and farm equipment
• Season extension techniques
• Value-added product creation
• Farm business basics and marketing

Program Details:
• March - November season
• 40-50 hours per week
• Weekly educational sessions
• Mentorship from experienced farmers
• Housing and food included
• $300/month stipend

Ideal for: Those seeking to start their own farm or pursue a career in sustainable agriculture.`,
    location: 'Kingston, NY',
    salaryMin: 2400,
    salaryMax: 2400,
    jobType: ['seasonal', 'apprenticeship'],
    farmType: ['organic', 'diversified', 'educational'],
    categories: ['apprenticeship', 'education'],
    tags: ['sustainable', 'livestock', 'diversified', 'beginning-farmer'],
    benefits: ['housing', 'meals', 'education'],
    companyEmail: 'apprentice@hvfarmschool.org',
    companyWebsite: 'https://hvfarmschool.org',
    applyEmail: 'apprentice@hvfarmschool.org',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'vineyard-worker-washington',
    title: 'Vineyard Canopy Management Specialist',
    company: 'Columbia Valley Vineyards',
    description: `Premium winery seeking skilled vineyard worker specializing in canopy management for our 100-acre estate vineyard.

Responsibilities:
• Pruning, shoot positioning, and leaf removal
• Trellis maintenance and repair
• Harvest coordination
• Irrigation management
• Equipment operation

Requirements:
• 2+ years vineyard experience
• Knowledge of grapevine growth cycles
• Attention to detail for quality wine production
• Ability to work independently
• Spanish/English bilingual a plus`,
    location: 'Walla Walla, WA',
    salaryMin: 38000,
    salaryMax: 48000,
    jobType: ['full-time', 'seasonal'],
    farmType: ['conventional', 'vineyard'],
    categories: ['crop-production', 'specialty-crops'],
    tags: ['wine', 'grapes', 'viticulture'],
    benefits: ['health-insurance', 'wine-allowance'],
    companyEmail: 'hiring@columbiavalleyvineyards.com',
    companyWebsite: 'https://columbiavalleyvineyards.com',
    applyEmail: 'hiring@columbiavalleyvineyards.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'farm-to-school-coordinator',
    title: 'Farm to School Coordinator',
    company: 'Roots & Harvest Farm',
    description: `Innovative position combining farm work with education outreach. You'll help grow food for local schools while teaching students about where their food comes from.

Responsibilities:
• Plan and plant school garden curriculum crops
• Lead field trips and student work days on farm
• Develop educational materials and activities
• Coordinate harvest and delivery to school cafeterias
• Document programs through photos and social media
• Assist with general farm tasks

Requirements:
• Experience working with children/education background
• Knowledge of sustainable agriculture
• Excellent communication skills
• Comfortable with public speaking
• Valid driver's license
• Background check required`,
    location: 'Durham, NC',
    salaryMin: 36000,
    salaryMax: 42000,
    jobType: ['full-time'],
    farmType: ['organic', 'educational'],
    categories: ['education', 'farm-hand'],
    tags: ['teaching', 'youth', 'community', 'sustainable'],
    benefits: ['health-insurance', 'paid-time-off', 'produce-share'],
    companyEmail: 'jobs@rootsandharvest.org',
    applyEmail: 'jobs@rootsandharvest.org',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  // NEW JOBS START HERE
  {
    slug: 'regenerative-farm-manager-texas',
    title: 'Regenerative Farm Manager',
    company: 'White Oak Pastures',
    description: `Lead our transition to regenerative agriculture practices on a 3,000-acre diversified farm. You'll implement holistic management principles while overseeing daily operations.

Responsibilities:
• Develop and implement rotational grazing plans
• Manage soil health monitoring and improvement programs
• Coordinate with multiple enterprise managers (poultry, cattle, hogs)
• Train staff on regenerative practices
• Track carbon sequestration metrics
• Interface with certification bodies

Requirements:
• 5+ years experience in regenerative or holistic management
• Savory Institute training or equivalent preferred
• Strong leadership and team management skills
• Experience with multi-species grazing systems
• Data-driven decision making approach`,
    location: 'Bluffton, GA',
    salaryMin: 65000,
    salaryMax: 85000,
    jobType: ['full-time'],
    farmType: ['regenerative', 'livestock', 'diversified'],
    categories: ['farm-manager', 'livestock-management'],
    tags: ['regenerative', 'holistic-management', 'carbon-farming'],
    benefits: ['housing', 'health-insurance', 'retirement', 'meat-share'],
    companyEmail: 'careers@whiteoakpastures.com',
    companyWebsite: 'https://whiteoakpastures.com',
    applyUrl: 'https://whiteoakpastures.com/careers',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'market-garden-grower-colorado',
    title: 'Market Garden Grower',
    company: 'Front Range Fresh',
    description: `Small-scale intensive market garden seeks an experienced grower to help produce vegetables for farmers markets and restaurant accounts.

Responsibilities:
• Plan and execute weekly plantings
• Manage harvest schedules for multiple market outlets
• Maintain beds using no-till methods
• Operate and maintain BCS and walk-behind equipment
• Pack and deliver to restaurant accounts
• Staff farmers market booth

Requirements:
• 2+ years market garden experience
• Familiarity with intensive planting methods (JM Fortier, Curtis Stone)
• Efficient and detail-oriented
• Valid driver's license
• Able to lift 50 lbs regularly
• Early morning availability for markets`,
    location: 'Boulder, CO',
    salaryMin: 38000,
    salaryMax: 45000,
    jobType: ['full-time', 'seasonal'],
    farmType: ['organic', 'market-garden'],
    categories: ['farm-hand', 'crop-production'],
    tags: ['market-garden', 'no-till', 'farmers-market', 'restaurants'],
    benefits: ['produce-share', 'flexible-schedule'],
    companyEmail: 'grow@frontrangefresh.com',
    applyEmail: 'grow@frontrangefresh.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'goat-dairy-manager-maine',
    title: 'Goat Dairy Manager',
    company: 'Tide Mill Creamery',
    description: `Artisan goat cheese producer seeking experienced dairy manager for our herd of 60 Alpine and LaMancha dairy goats.

Responsibilities:
• Manage breeding program and maintain herd records
• Oversee daily milking operations
• Coordinate with cheesemaker on milk quality
• Supervise kidding season
• Pasture and browse management
• Train and supervise farm assistants

Requirements:
• 3+ years goat dairy experience
• Knowledge of goat health and nutrition
• Experience with cheesemaking a plus
• Able to work independently
• Strong record-keeping skills
• Gentle, patient handling approach`,
    location: 'Trescott, ME',
    salaryMin: 42000,
    salaryMax: 52000,
    jobType: ['full-time'],
    farmType: ['organic', 'livestock'],
    categories: ['farm-manager', 'livestock-management'],
    tags: ['goats', 'dairy', 'cheese', 'artisan'],
    benefits: ['housing', 'cheese-share', 'health-insurance'],
    companyEmail: 'farm@tidemillcreamery.com',
    companyWebsite: 'https://tidemillcreamery.com',
    applyEmail: 'farm@tidemillcreamery.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'mushroom-cultivation-specialist-pennsylvania',
    title: 'Mushroom Cultivation Specialist',
    company: 'Mycopia Mushrooms',
    description: `Join our specialty mushroom operation growing shiitake, oyster, lion's mane, and other gourmet varieties for restaurants and farmers markets.

Responsibilities:
• Manage spawn production and substrate preparation
• Monitor and maintain growing room conditions
• Harvest and pack mushrooms for market
• Maintain sterile lab procedures
• Experiment with new varieties and techniques
• Assist with log inoculation for outdoor production

Requirements:
• Experience in mushroom cultivation
• Understanding of mycology fundamentals
• Attention to detail and cleanliness
• Comfortable in humid environments
• Interest in culinary mushrooms
• Flexible schedule for harvesting`,
    location: 'Kennett Square, PA',
    salaryMin: 40000,
    salaryMax: 50000,
    jobType: ['full-time'],
    farmType: ['organic', 'specialty'],
    categories: ['specialty-crops', 'greenhouse-production'],
    tags: ['mushrooms', 'mycology', 'gourmet', 'indoor-farming'],
    benefits: ['health-insurance', 'mushroom-share', 'paid-time-off'],
    companyEmail: 'jobs@mycopiamushrooms.com',
    companyWebsite: 'https://mycopiamushrooms.com',
    applyEmail: 'jobs@mycopiamushrooms.com',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'orchard-manager-michigan',
    title: 'Orchard Manager',
    company: 'Great Lakes Fruit Co.',
    description: `Seeking an experienced orchard manager to oversee our 200-acre apple and cherry operation in prime fruit-growing region.

Responsibilities:
• Plan and execute annual pruning schedule
• Manage integrated pest management program
• Coordinate with farm crew on daily tasks
• Oversee harvest operations and labor
• Maintain spray records and food safety documentation
• Equipment operation and maintenance

Requirements:
• 5+ years orchard management experience
• Pesticide applicator license or ability to obtain
• Knowledge of apple and stone fruit production
• Strong leadership and communication skills
• Bilingual English/Spanish preferred
• CDL a plus`,
    location: 'Traverse City, MI',
    salaryMin: 55000,
    salaryMax: 70000,
    jobType: ['full-time'],
    farmType: ['conventional', 'orchard'],
    categories: ['farm-manager', 'specialty-crops'],
    tags: ['apples', 'cherries', 'fruit', 'ipm'],
    benefits: ['health-insurance', 'retirement', 'housing-stipend', 'fruit-share'],
    companyEmail: 'hr@greatlakesfruit.com',
    companyWebsite: 'https://greatlakesfruit.com',
    applyUrl: 'https://greatlakesfruit.com/careers',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'flower-farmer-virginia',
    title: 'Flower Farmer - Cut Flowers',
    company: 'Blue Ridge Blooms',
    description: `Growing farm seeking a passionate flower farmer to help expand our cut flower operation for weddings, florists, and farmers markets.

Responsibilities:
• Seed starting and transplanting annuals and perennials
• Field maintenance including weeding and irrigation
• Harvest flowers at optimal stage
• Condition and arrange flowers for market
• Design and create wedding arrangements
• Maintain records and assist with crop planning

Requirements:
• Experience growing cut flowers
• Eye for color and design
• Knowledge of flower varieties and growing requirements
• Able to work early mornings and weekends
• Physical stamina for field work
• Customer service skills for weddings and markets`,
    location: 'Charlottesville, VA',
    salaryMin: 35000,
    salaryMax: 42000,
    jobType: ['full-time', 'seasonal'],
    farmType: ['organic', 'specialty'],
    categories: ['gardener', 'specialty-crops'],
    tags: ['flowers', 'weddings', 'florist', 'farmers-market'],
    benefits: ['flexible-schedule', 'produce-share', 'education'],
    companyEmail: 'flowers@blueridgeblooms.com',
    companyWebsite: 'https://blueridgeblooms.com',
    applyEmail: 'flowers@blueridgeblooms.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'aquaponics-technician-florida',
    title: 'Aquaponics Technician',
    company: 'Coastal Greens Aquaponics',
    description: `Innovative aquaponics operation seeking technician to manage our integrated fish and vegetable production system.

Responsibilities:
• Monitor water quality and system parameters
• Feed and care for tilapia population
• Manage crop production in grow beds and rafts
• Harvest vegetables and fish
• Troubleshoot system issues
• Maintain equipment and plumbing

Requirements:
• Experience with aquaponics or hydroponics systems
• Understanding of water chemistry
• Basic mechanical and electrical skills
• Detail-oriented with strong record-keeping
• Comfortable working with fish
• Flexible schedule for system monitoring`,
    location: 'Tampa, FL',
    salaryMin: 38000,
    salaryMax: 48000,
    jobType: ['full-time'],
    farmType: ['aquaponics', 'greenhouse'],
    categories: ['greenhouse-production', 'specialty-crops'],
    tags: ['aquaponics', 'hydroponics', 'tilapia', 'urban-farming'],
    benefits: ['health-insurance', 'produce-share', 'fish-share'],
    companyEmail: 'jobs@coastalgreens.com',
    companyWebsite: 'https://coastalgreens.com',
    applyEmail: 'jobs@coastalgreens.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'sheep-shepherd-wyoming',
    title: 'Shepherd - Range Sheep Operation',
    company: 'Wind River Ranch',
    description: `Traditional sheep ranch seeking experienced shepherd for our 2,000-head flock in the beautiful Wind River Range.

Responsibilities:
• Manage flock on summer range
• Guard dog and livestock guardian animal coordination
• Predator management and monitoring
• Lambing assistance during spring season
• Move sheep between pastures
• Basic veterinary care and record keeping

Requirements:
• Previous sheep handling experience
• Comfortable working in remote locations
• Experience with guard dogs
• Horsemanship skills preferred
• Self-sufficient and resourceful
• Must enjoy solitude and outdoor living`,
    location: 'Lander, WY',
    salaryMin: 35000,
    salaryMax: 45000,
    jobType: ['full-time', 'seasonal'],
    farmType: ['conventional', 'livestock'],
    categories: ['ranch-hand', 'livestock-management'],
    tags: ['sheep', 'range', 'guardian-dogs', 'remote'],
    benefits: ['housing', 'meals', 'equipment'],
    companyEmail: 'ranch@windriverranch.com',
    applyEmail: 'ranch@windriverranch.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'urban-farm-coordinator-illinois',
    title: 'Urban Farm Coordinator',
    company: 'Growing Home Chicago',
    description: `Nonprofit urban farm seeks coordinator to manage our production sites and job training programs in underserved communities.

Responsibilities:
• Oversee vegetable production at multiple urban sites
• Train and mentor program participants
• Coordinate volunteer groups and workdays
• Manage CSA program and farm stand sales
• Grant writing and program documentation
• Community outreach and partnerships

Requirements:
• 3+ years urban agriculture experience
• Experience working with diverse populations
• Strong organizational and communication skills
• Knowledge of food justice and community development
• Valid driver's license
• Bilingual English/Spanish a plus`,
    location: 'Chicago, IL',
    salaryMin: 45000,
    salaryMax: 55000,
    jobType: ['full-time'],
    farmType: ['organic', 'urban', 'educational'],
    categories: ['farm-manager', 'education'],
    tags: ['urban-farming', 'food-justice', 'nonprofit', 'job-training'],
    benefits: ['health-insurance', 'paid-time-off', 'transit-benefits'],
    companyEmail: 'jobs@growinghomechicago.org',
    companyWebsite: 'https://growinghomechicago.org',
    applyUrl: 'https://growinghomechicago.org/careers',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'beekeeper-assistant-arizona',
    title: 'Beekeeper Assistant',
    company: 'Desert Bloom Apiaries',
    description: `Commercial beekeeping operation seeking assistant to help manage 500+ hives for honey production and pollination services.

Responsibilities:
• Hive inspections and maintenance
• Honey extraction and processing
• Prepare hives for pollination contracts
• Queen rearing assistance
• Equipment repair and maintenance
• Truck driving for hive transport

Requirements:
• Some beekeeping experience preferred
• Comfortable working with bees (will train)
• Physical ability to lift 60+ lb boxes
• Valid driver's license (CDL a plus)
• Available for seasonal travel
• Not allergic to bee stings`,
    location: 'Tucson, AZ',
    salaryMin: 32000,
    salaryMax: 40000,
    jobType: ['full-time'],
    farmType: ['conventional', 'specialty'],
    categories: ['farm-hand', 'specialty-crops'],
    tags: ['bees', 'honey', 'pollination', 'apiary'],
    benefits: ['health-insurance', 'honey-share', 'travel-opportunities'],
    companyEmail: 'hives@desertbloomapiaries.com',
    applyEmail: 'hives@desertbloomapiaries.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'biodynamic-farm-intern-new-hampshire',
    title: 'Biodynamic Farm Internship',
    company: 'Temple-Wilton Community Farm',
    description: `One of America's oldest CSA farms offers immersive biodynamic farming internship. Learn from experienced practitioners in a supportive community setting.

Program Includes:
• Full participation in vegetable, grain, and livestock operations
• Weekly biodynamic study groups
• Preparation making and application
• Community life and farm governance
• Room and board included
• Monthly stipend

We're Looking For:
• Genuine interest in biodynamic agriculture
• Willingness to engage in community living
• Physical fitness for farm work
• Commitment to full season (May-November)
• Open mind and collaborative spirit`,
    location: 'Wilton, NH',
    salaryMin: 3500,
    salaryMax: 3500,
    jobType: ['seasonal', 'apprenticeship'],
    farmType: ['biodynamic', 'organic', 'csa'],
    categories: ['apprenticeship', 'education'],
    tags: ['biodynamic', 'community', 'csa', 'beginning-farmer'],
    benefits: ['housing', 'meals', 'education', 'community'],
    companyEmail: 'internship@templewilton.org',
    companyWebsite: 'https://templewilton.org',
    applyEmail: 'internship@templewilton.org',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'hop-farm-worker-idaho',
    title: 'Hop Farm Worker',
    company: 'Treasure Valley Hops',
    description: `Growing hop farm seeking seasonal workers for training, harvesting, and field maintenance in Idaho's prime hop growing region.

Responsibilities:
• Train hop bines up strings in spring
• Field maintenance and irrigation
• Operate harvest machinery in fall
• Sort and package hop cones
• Assist with hop yard maintenance
• Equipment operation

Requirements:
• Able to work at heights on ladders and lifts
• Physical fitness for repetitive tasks
• Available March-September
• Previous farm experience helpful
• Team player attitude
• Early morning availability`,
    location: 'Wilder, ID',
    salaryMin: 30000,
    salaryMax: 38000,
    jobType: ['seasonal'],
    farmType: ['conventional', 'specialty'],
    categories: ['farm-hand', 'specialty-crops'],
    tags: ['hops', 'beer', 'brewing', 'harvest'],
    benefits: ['overtime-pay', 'beer-allowance'],
    companyEmail: 'jobs@treasurevalleyhops.com',
    applyEmail: 'jobs@treasurevalleyhops.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'csa-farm-coordinator-minnesota',
    title: 'CSA Farm Coordinator',
    company: 'Prairie Roots CSA',
    description: `Growing CSA farm seeking coordinator to manage member relations and help with vegetable production for 250 member shares.

Responsibilities:
• Coordinate weekly CSA harvest and pack
• Manage member communication and newsletter
• Handle share signups and renewals
• Organize on-farm events and u-pick days
• Assist with field production as needed
• Manage farm stand at pickup locations

Requirements:
• CSA or direct-market farming experience
• Excellent customer service skills
• Strong organizational abilities
• Comfortable with email and basic tech
• Valid driver's license
• Available Wednesdays for pack day`,
    location: 'Northfield, MN',
    salaryMin: 36000,
    salaryMax: 44000,
    jobType: ['full-time', 'seasonal'],
    farmType: ['organic', 'csa'],
    categories: ['farm-hand', 'crop-production'],
    tags: ['csa', 'marketing', 'customer-service', 'community'],
    benefits: ['produce-share', 'flexible-schedule', 'farm-events'],
    companyEmail: 'csa@prairierootsfarm.com',
    companyWebsite: 'https://prairierootsfarm.com',
    applyEmail: 'csa@prairierootsfarm.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'livestock-guardian-dog-handler-colorado',
    title: 'Livestock Guardian Dog Handler',
    company: 'High Country Lamb',
    description: `Mountain sheep ranch seeking experienced handler to manage our pack of 15 livestock guardian dogs protecting sheep on summer range.

Responsibilities:
• Daily care and feeding of guardian dogs
• Monitor dog health and behavior
• Coordinate dog placement with flock
• Train young dogs alongside experienced dogs
• Work with predator management team
• Document predator interactions

Requirements:
• Experience with livestock guardian dogs
• Knowledge of predator behavior
• Comfortable in remote mountain terrain
• Physical fitness for hiking
• Patient dog training approach
• First aid skills for dogs`,
    location: 'Gunnison, CO',
    salaryMin: 38000,
    salaryMax: 46000,
    jobType: ['full-time', 'seasonal'],
    farmType: ['conventional', 'livestock'],
    categories: ['livestock-management', 'ranch-hand'],
    tags: ['guardian-dogs', 'sheep', 'predator-management', 'mountains'],
    benefits: ['housing', 'meals', 'wilderness-living'],
    companyEmail: 'dogs@highcountrylamb.com',
    applyEmail: 'dogs@highcountrylamb.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'pastured-poultry-manager-missouri',
    title: 'Pastured Poultry Manager',
    company: 'Singing Pastures Farm',
    description: `Growing pastured poultry operation seeks experienced manager to oversee production of 10,000 broilers and 2,000 laying hens annually.

Responsibilities:
• Manage brooder operations and chick care
• Coordinate daily pasture moves
• Oversee processing days
• Maintain egg collection and grading
• Direct-market sales and delivery
• Train and supervise seasonal workers

Requirements:
• 2+ years pastured poultry experience
• Knowledge of poultry health and nutrition
• Experience with on-farm processing
• Marketing and customer service skills
• Valid driver's license
• Physical ability for daily pasture moves`,
    location: 'Columbia, MO',
    salaryMin: 42000,
    salaryMax: 52000,
    jobType: ['full-time'],
    farmType: ['organic', 'livestock', 'pastured'],
    categories: ['farm-manager', 'livestock-management'],
    tags: ['poultry', 'pastured', 'eggs', 'direct-market'],
    benefits: ['housing', 'health-insurance', 'meat-share', 'eggs'],
    companyEmail: 'farm@singingpastures.com',
    companyWebsite: 'https://singingpastures.com',
    applyEmail: 'farm@singingpastures.com',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'seed-production-technician-iowa',
    title: 'Seed Production Technician',
    company: 'Heartland Seed Company',
    description: `Organic seed company seeking technician to assist with vegetable and flower seed production, processing, and quality control.

Responsibilities:
• Plant care and isolation management
• Roguing for variety purity
• Harvest timing and seed collection
• Seed cleaning and processing
• Germination testing
• Packing and inventory management

Requirements:
• Interest in plant genetics and seed saving
• Attention to detail for quality control
• Physical stamina for field work
• Basic computer skills for record keeping
• Willingness to learn seed processing equipment
• Plant identification skills helpful`,
    location: 'Decorah, IA',
    salaryMin: 35000,
    salaryMax: 42000,
    jobType: ['full-time'],
    farmType: ['organic', 'specialty'],
    categories: ['crop-production', 'specialty-crops'],
    tags: ['seeds', 'organic', 'plant-breeding', 'quality-control'],
    benefits: ['health-insurance', 'seed-discount', 'paid-time-off'],
    companyEmail: 'jobs@heartlandseed.com',
    companyWebsite: 'https://heartlandseed.com',
    applyEmail: 'jobs@heartlandseed.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'olive-orchard-worker-california',
    title: 'Olive Orchard Worker',
    company: 'California Gold Olive Ranch',
    description: `Premium olive oil producer seeking workers for our 500-acre organic olive orchard in the Central Valley.

Responsibilities:
• Pruning and orchard maintenance
• Irrigation system management
• Harvest coordination and equipment operation
• Cover crop management
• Assist with olive oil production
• General farm maintenance

Requirements:
• Previous orchard or farm experience
• Comfortable operating tractors and equipment
• Physical fitness for outdoor work
• Available during harvest season (Oct-Dec)
• Valid driver's license
• Spanish language skills a plus`,
    location: 'Oroville, CA',
    salaryMin: 38000,
    salaryMax: 48000,
    jobType: ['full-time'],
    farmType: ['organic', 'orchard'],
    categories: ['farm-hand', 'specialty-crops'],
    tags: ['olives', 'olive-oil', 'orchard', 'california'],
    benefits: ['health-insurance', 'olive-oil-share', 'housing-available'],
    companyEmail: 'ranch@cagoldolive.com',
    companyWebsite: 'https://cagoldolive.com',
    applyEmail: 'ranch@cagoldolive.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'cannabis-cultivation-technician-oregon',
    title: 'Cannabis Cultivation Technician',
    company: 'Green Thumb Gardens',
    description: `Licensed cannabis farm seeking cultivation technician for our sustainable, sun-grown operation.

Responsibilities:
• Plant care from clone to harvest
• IPM scouting and application
• Irrigation management
• Harvest and curing operations
• Compliance record-keeping
• Greenhouse maintenance

Requirements:
• 21+ years old (required by law)
• Cannabis or horticulture experience
• Knowledge of plant nutrition
• Detail-oriented for compliance
• Able to pass background check
• OLCC marijuana worker permit or ability to obtain`,
    location: 'Grants Pass, OR',
    salaryMin: 40000,
    salaryMax: 52000,
    jobType: ['full-time'],
    farmType: ['organic', 'greenhouse', 'specialty'],
    categories: ['greenhouse-production', 'specialty-crops'],
    tags: ['cannabis', 'horticulture', 'ipm', 'compliance'],
    benefits: ['health-insurance', 'employee-discount', 'paid-time-off'],
    companyEmail: 'jobs@greenthumbgardens.com',
    applyUrl: 'https://greenthumbgardens.com/careers',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'heritage-breed-livestock-manager-virginia',
    title: 'Heritage Breed Livestock Manager',
    company: 'Polyface Farm',
    description: `Iconic regenerative farm seeks livestock manager to help maintain our heritage breed conservation program including Tamworth pigs, Devon cattle, and heritage poultry.

Responsibilities:
• Daily care of multiple heritage breed species
• Maintain breed registries and records
• Coordinate breeding programs
• Educate visitors about heritage breeds
• Assist with on-farm tours and events
• General farm infrastructure maintenance

Requirements:
• Experience with multiple livestock species
• Interest in breed conservation
• Public speaking comfort for tours
• Knowledge of grazing management
• Self-motivated and detail-oriented
• Alignment with regenerative agriculture principles`,
    location: 'Swoope, VA',
    salaryMin: 38000,
    salaryMax: 48000,
    jobType: ['full-time'],
    farmType: ['regenerative', 'livestock', 'educational'],
    categories: ['livestock-management', 'education'],
    tags: ['heritage-breeds', 'regenerative', 'conservation', 'education'],
    benefits: ['housing', 'meat-share', 'education', 'farm-tours'],
    companyEmail: 'jobs@polyfacefarms.com',
    companyWebsite: 'https://polyfacefarms.com',
    applyUrl: 'https://polyfacefarms.com/employment',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'maple-syrup-producer-vermont',
    title: 'Maple Syrup Producer',
    company: 'Sugarbush Maple Farm',
    description: `Family maple operation seeking year-round employee to manage our 5,000-tap sugarbush and syrup production.

Responsibilities:
• Maintain tubing system and collection equipment
• Operate reverse osmosis and evaporator
• Monitor sap flow and plan boiling schedule
• Grade and bottle finished syrup
• Equipment maintenance and repair
• Woods work during off-season (thinning, tapping)

Requirements:
• Maple syrup production experience preferred
• Mechanical aptitude for equipment repair
• Able to work long hours during sap season
• Comfortable working in cold weather
• Valid driver's license
• Forestry knowledge a plus`,
    location: 'Montpelier, VT',
    salaryMin: 40000,
    salaryMax: 50000,
    jobType: ['full-time'],
    farmType: ['conventional', 'specialty'],
    categories: ['farm-hand', 'specialty-crops'],
    tags: ['maple-syrup', 'forestry', 'sugar-house', 'vermont'],
    benefits: ['housing-stipend', 'syrup-share', 'flexible-schedule-off-season'],
    companyEmail: 'sap@sugarbushmaple.com',
    companyWebsite: 'https://sugarbushmaple.com',
    applyEmail: 'sap@sugarbushmaple.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'nursery-propagation-specialist-north-carolina',
    title: 'Nursery Propagation Specialist',
    company: 'Piedmont Native Plants',
    description: `Native plant nursery seeking propagation specialist to grow plants for ecological restoration and landscape projects.

Responsibilities:
• Propagate native trees, shrubs, and perennials
• Manage seed collection and treatment
• Maintain greenhouse growing conditions
• Care for container stock
• Document propagation protocols
• Assist with plant sales and customer education

Requirements:
• Horticulture degree or equivalent experience
• Knowledge of native plants of the Southeast
• Propagation experience (seeds, cuttings, division)
• Strong plant identification skills
• Attention to detail and record keeping
• Passion for ecological restoration`,
    location: 'Hillsborough, NC',
    salaryMin: 38000,
    salaryMax: 46000,
    jobType: ['full-time'],
    farmType: ['organic', 'specialty'],
    categories: ['greenhouse-production', 'specialty-crops'],
    tags: ['native-plants', 'propagation', 'restoration', 'nursery'],
    benefits: ['health-insurance', 'plant-discount', 'professional-development'],
    companyEmail: 'grow@piedmontnatives.com',
    companyWebsite: 'https://piedmontnatives.com',
    applyEmail: 'grow@piedmontnatives.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'agritourism-coordinator-tennessee',
    title: 'Agritourism Coordinator',
    company: 'Sweetwater Valley Farm',
    description: `Diversified farm with cheese production seeks coordinator to manage our agritourism programs including farm tours, cheese tastings, and special events.

Responsibilities:
• Lead farm tours and cheese tastings
• Coordinate school field trips
• Plan and execute farm events
• Manage tour bookings and scheduling
• Maintain visitor center and farm store
• Social media and marketing support

Requirements:
• Excellent public speaking skills
• Experience in hospitality or tourism
• Agricultural knowledge or willingness to learn
• Event planning experience
• Customer service orientation
• Weekend availability required`,
    location: 'Philadelphia, TN',
    salaryMin: 35000,
    salaryMax: 42000,
    jobType: ['full-time'],
    farmType: ['conventional', 'educational'],
    categories: ['education', 'farm-manager'],
    tags: ['agritourism', 'events', 'cheese', 'tours'],
    benefits: ['cheese-share', 'paid-time-off', 'tips-from-tours'],
    companyEmail: 'tours@sweetwatervalley.com',
    companyWebsite: 'https://sweetwatervalley.com',
    applyUrl: 'https://sweetwatervalley.com/careers',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'irrigation-specialist-california',
    title: 'Agricultural Irrigation Specialist',
    company: 'Central Valley Ag Services',
    description: `Irrigation company serving farms throughout California's Central Valley seeks experienced irrigation technician.

Responsibilities:
• Design and install drip and sprinkler systems
• Program and troubleshoot irrigation controllers
• Perform system audits and water scheduling
• Maintain and repair pumps and filtration
• Work with growers on water efficiency
• Emergency repair response

Requirements:
• 3+ years agricultural irrigation experience
• Knowledge of drip, micro, and overhead systems
• Electrical troubleshooting skills
• Valid driver's license with clean record
• Bilingual English/Spanish preferred
• Irrigation Association certification a plus`,
    location: 'Fresno, CA',
    salaryMin: 50000,
    salaryMax: 65000,
    jobType: ['full-time'],
    farmType: ['conventional'],
    categories: ['farm-hand', 'crop-production'],
    tags: ['irrigation', 'water', 'technology', 'california'],
    benefits: ['health-insurance', 'retirement', 'company-vehicle', 'overtime'],
    companyEmail: 'jobs@centralvalleyag.com',
    companyWebsite: 'https://centralvalleyag.com',
    applyUrl: 'https://centralvalleyag.com/careers',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'kombucha-production-assistant-washington',
    title: 'Kombucha Production Assistant',
    company: 'Pacific Ferments',
    description: `Craft kombucha brewery seeks production assistant to help with fermentation, flavoring, and bottling of our small-batch brews.

Responsibilities:
• Brew and monitor primary fermentation
• Prepare flavoring ingredients (many locally sourced)
• Bottle, label, and package finished product
• Maintain sanitation and quality standards
• Assist with farmers market sales
• Help with SCOBY cultivation

Requirements:
• Interest in fermentation and food science
• Attention to sanitation and detail
• Physical ability to lift kegs and cases
• Food safety certification or willingness to obtain
• Valid driver's license for deliveries
• Taste testing ability required`,
    location: 'Bellingham, WA',
    salaryMin: 34000,
    salaryMax: 40000,
    jobType: ['full-time'],
    farmType: ['organic', 'specialty'],
    categories: ['specialty-crops', 'crop-production'],
    tags: ['fermentation', 'kombucha', 'beverages', 'local-sourcing'],
    benefits: ['kombucha-share', 'health-insurance', 'farmers-market-days'],
    companyEmail: 'brew@pacificferments.com',
    companyWebsite: 'https://pacificferments.com',
    applyEmail: 'brew@pacificferments.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'horse-farm-manager-kentucky',
    title: 'Horse Farm Manager',
    company: 'Bluegrass Equine Estate',
    description: `Thoroughbred breeding farm in Kentucky's horse country seeks experienced farm manager to oversee our 300-acre operation.

Responsibilities:
• Manage 40+ broodmares and foals
• Coordinate breeding schedules with stallion farms
• Oversee farm staff (5-8 employees)
• Pasture and hay production management
• Maintain facility and equipment
• Work with veterinarians on herd health

Requirements:
• 5+ years thoroughbred farm experience
• Extensive foaling experience
• Strong leadership skills
• Knowledge of breeding management
• Computer skills for record keeping
• On-call availability during foaling season`,
    location: 'Lexington, KY',
    salaryMin: 60000,
    salaryMax: 80000,
    jobType: ['full-time'],
    farmType: ['conventional', 'livestock'],
    categories: ['farm-manager', 'livestock-management'],
    tags: ['horses', 'thoroughbred', 'breeding', 'equine'],
    benefits: ['housing', 'health-insurance', 'retirement', 'vehicle'],
    companyEmail: 'careers@bluegrassequine.com',
    companyWebsite: 'https://bluegrassequine.com',
    applyUrl: 'https://bluegrassequine.com/employment',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'vertical-farm-technician-new-jersey',
    title: 'Vertical Farm Technician',
    company: 'Bowery Farming',
    description: `Indoor vertical farm using cutting-edge technology seeks technician to help produce fresh greens for the NYC metro area year-round.

Responsibilities:
• Monitor and maintain hydroponic growing systems
• Seed, transplant, and harvest leafy greens
• Operate and troubleshoot automated equipment
• Maintain data logs and quality control
• Clean and sanitize growing areas
• Package product for distribution

Requirements:
• Interest in controlled environment agriculture
• Comfortable with technology and data systems
• Attention to detail for food safety
• Able to work in climate-controlled environment
• Flexible schedule including some weekends
• Previous CEA experience a plus`,
    location: 'Kearny, NJ',
    salaryMin: 42000,
    salaryMax: 52000,
    jobType: ['full-time'],
    farmType: ['hydroponics', 'greenhouse', 'urban'],
    categories: ['greenhouse-production', 'specialty-crops'],
    tags: ['vertical-farming', 'hydroponics', 'technology', 'urban-farming'],
    benefits: ['health-insurance', 'transit-benefits', 'greens-share', 'career-growth'],
    companyEmail: 'careers@boweryfarming.com',
    companyWebsite: 'https://boweryfarming.com',
    applyUrl: 'https://boweryfarming.com/careers',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'permaculture-design-consultant-hawaii',
    title: 'Permaculture Design Consultant',
    company: 'Tropical Homesteads Hawaii',
    description: `Design and install food forests and permaculture systems throughout the Big Island. Work with homeowners and farms to create abundant, sustainable landscapes.

Responsibilities:
• Site assessments and client consultations
• Design permaculture plans and food forests
• Coordinate and oversee installations
• Source plants from local nurseries
• Provide client education and follow-up
• Document projects for portfolio

Requirements:
• Permaculture Design Certificate required
• Knowledge of tropical plants and systems
• Experience with food forest design
• Strong communication and teaching skills
• Valid driver's license and reliable vehicle
• Portfolio of previous design work`,
    location: 'Kailua-Kona, HI',
    salaryMin: 45000,
    salaryMax: 60000,
    jobType: ['full-time', 'contract'],
    farmType: ['permaculture', 'organic', 'tropical'],
    categories: ['gardener', 'education'],
    tags: ['permaculture', 'food-forest', 'design', 'tropical'],
    benefits: ['flexible-schedule', 'vehicle-allowance', 'professional-development'],
    companyEmail: 'design@tropicalhomesteads.com',
    companyWebsite: 'https://tropicalhomesteads.com',
    applyEmail: 'design@tropicalhomesteads.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'grain-farm-assistant-kansas',
    title: 'Grain Farm Assistant',
    company: 'Prairie Heritage Grains',
    description: `Organic grain farm growing heritage wheat, barley, and ancient grains seeks farm assistant for field work and milling operations.

Responsibilities:
• Operate tractors and grain handling equipment
• Assist with planting and harvest
• Maintain equipment and facilities
• Run stone mill for flour production
• Package and label grain products
• Assist with farmers market sales

Requirements:
• Equipment operation experience
• Mechanical aptitude for repairs
• CDL or ability to obtain
• Interest in heritage grains and local food
• Physical ability to handle grain bags
• Valid driver's license`,
    location: 'Salina, KS',
    salaryMin: 36000,
    salaryMax: 44000,
    jobType: ['full-time'],
    farmType: ['organic', 'diversified'],
    categories: ['farm-hand', 'crop-production'],
    tags: ['grains', 'wheat', 'milling', 'heritage'],
    benefits: ['flour-share', 'health-insurance', 'equipment-training'],
    companyEmail: 'farm@prairieheritagegrains.com',
    companyWebsite: 'https://prairieheritagegrains.com',
    applyEmail: 'farm@prairieheritagegrains.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'farm-kitchen-manager-massachusetts',
    title: 'Farm Kitchen Manager',
    company: 'Allandale Farm',
    description: `Historic farm with retail store seeks kitchen manager to produce prepared foods, baked goods, and preserves from farm-grown ingredients.

Responsibilities:
• Create seasonal menus using farm produce
• Manage kitchen production schedule
• Supervise kitchen staff (2-3 people)
• Maintain food safety and quality standards
• Coordinate with farm team on harvest
• Develop new products and recipes

Requirements:
• Culinary experience in farm-to-table setting
• ServSafe certification
• Experience with preserving and canning
• Strong organizational skills
• Creative menu development ability
• Early morning availability`,
    location: 'Brookline, MA',
    salaryMin: 48000,
    salaryMax: 58000,
    jobType: ['full-time'],
    farmType: ['organic', 'diversified'],
    categories: ['farm-manager', 'specialty-crops'],
    tags: ['farm-kitchen', 'preserving', 'baking', 'value-added'],
    benefits: ['health-insurance', 'meals', 'produce-share', 'paid-time-off'],
    companyEmail: 'kitchen@allandalefarm.com',
    companyWebsite: 'https://allandalefarm.com',
    applyEmail: 'kitchen@allandalefarm.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'lavender-farm-worker-oregon',
    title: 'Lavender Farm Worker',
    company: 'Willamette Lavender Farm',
    description: `Specialty lavender farm seeks seasonal workers for cultivation, harvest, and value-added product creation.

Responsibilities:
• Weed and maintain lavender fields
• Hand harvest lavender at peak bloom
• Bundle and dry lavender
• Create sachets, bouquets, and products
• Staff farm store and u-pick days
• Assist with farm events and weddings

Requirements:
• Love of lavender and aromatic plants
• Detail-oriented for product quality
• Able to work in hot summer conditions
• Customer service skills
• Crafting experience helpful
• Weekend availability June-August`,
    location: 'Newberg, OR',
    salaryMin: 28000,
    salaryMax: 34000,
    jobType: ['seasonal', 'part-time'],
    farmType: ['organic', 'specialty'],
    categories: ['farm-hand', 'specialty-crops'],
    tags: ['lavender', 'aromatics', 'crafts', 'agritourism'],
    benefits: ['lavender-products', 'flexible-hours', 'farm-events'],
    companyEmail: 'farm@willamettelavender.com',
    companyWebsite: 'https://willamettelavender.com',
    applyEmail: 'farm@willamettelavender.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'soil-health-specialist-nebraska',
    title: 'Soil Health Specialist',
    company: 'Regenerative Ag Consulting',
    description: `Agricultural consulting firm seeks soil health specialist to work with farmers transitioning to regenerative practices across the Midwest.

Responsibilities:
• Conduct soil assessments and testing
• Develop cover crop and rotation plans
• Monitor and report on soil health indicators
• Educate farmers on regenerative practices
• Lead field days and workshops
• Write reports and grant applications

Requirements:
• Degree in soil science or agronomy
• Experience with soil health assessment
• Knowledge of cover crops and no-till
• Strong communication and teaching skills
• Willingness to travel regionally
• Farming background preferred`,
    location: 'Lincoln, NE',
    salaryMin: 55000,
    salaryMax: 70000,
    jobType: ['full-time'],
    farmType: ['regenerative', 'organic'],
    categories: ['education', 'farm-manager'],
    tags: ['soil-health', 'regenerative', 'consulting', 'cover-crops'],
    benefits: ['health-insurance', 'retirement', 'vehicle-allowance', 'professional-development'],
    companyEmail: 'careers@regenagconsulting.com',
    companyWebsite: 'https://regenagconsulting.com',
    applyUrl: 'https://regenagconsulting.com/careers',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 + 60 * 60 * 1000),
  },
  // GEORGIA JOBS
  {
    slug: 'peach-orchard-manager-georgia',
    title: 'Peach Orchard Manager',
    company: 'Georgia Peach Growers',
    description: `Premier Georgia peach operation seeking experienced orchard manager to oversee our 400-acre peach and pecan operation in the heart of peach country.

Responsibilities:
• Manage all aspects of peach production from dormancy to harvest
• Coordinate pruning, thinning, and pest management programs
• Oversee harvest operations and quality control
• Supervise seasonal crew of 30+ workers
• Maintain spray records and food safety compliance
• Manage pecan harvest operations in fall

Requirements:
• 5+ years stone fruit orchard management
• Pesticide applicator license required
• Strong bilingual English/Spanish skills
• Experience managing large seasonal crews
• Knowledge of Georgia growing conditions
• CDL preferred`,
    location: 'Fort Valley, GA',
    salaryMin: 60000,
    salaryMax: 75000,
    jobType: ['full-time'],
    farmType: ['conventional', 'orchard'],
    categories: ['farm-manager', 'specialty-crops'],
    tags: ['peaches', 'pecans', 'fruit', 'georgia'],
    benefits: ['housing', 'health-insurance', 'retirement', 'peach-share'],
    companyEmail: 'careers@gapeachgrowers.com',
    companyWebsite: 'https://gapeachgrowers.com',
    applyUrl: 'https://gapeachgrowers.com/careers',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'vidalia-onion-farm-worker-georgia',
    title: 'Vidalia Onion Farm Worker',
    company: 'Sweet Vidalia Farms',
    description: `Join our team growing world-famous Vidalia sweet onions in the only region where they can legally be grown.

Responsibilities:
• Transplant onion seedlings in fall
• Field cultivation and weed management
• Harvest and grading operations
• Pack shed work during harvest season
• Equipment operation and maintenance
• Irrigation management

Requirements:
• Previous farming or agricultural experience
• Able to work long hours during harvest (April-June)
• Physical stamina for field work
• Team player attitude
• Valid driver's license
• Bilingual English/Spanish a plus`,
    location: 'Vidalia, GA',
    salaryMin: 32000,
    salaryMax: 40000,
    jobType: ['full-time', 'seasonal'],
    farmType: ['conventional', 'vegetable'],
    categories: ['farm-hand', 'crop-production'],
    tags: ['onions', 'vidalia', 'vegetables', 'harvest'],
    benefits: ['overtime-pay', 'onion-share', 'seasonal-bonus'],
    companyEmail: 'jobs@sweetvidaliafarms.com',
    applyEmail: 'jobs@sweetvidaliafarms.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'poultry-house-manager-georgia',
    title: 'Poultry House Manager',
    company: 'Georgia Broiler Operations',
    description: `Large-scale poultry operation seeking experienced house manager to oversee multiple broiler houses in South Georgia.

Responsibilities:
• Manage daily operations of 4 broiler houses
• Monitor bird health and growth rates
• Maintain ventilation and climate control systems
• Coordinate with integrator on flock placement
• Supervise house cleanout and preparation
• Record keeping and compliance documentation

Requirements:
• 3+ years poultry house management experience
• Knowledge of broiler production systems
• Mechanical skills for equipment maintenance
• Strong attention to detail
• Available for early morning and weekend checks
• Reliable transportation`,
    location: 'Gainesville, GA',
    salaryMin: 45000,
    salaryMax: 55000,
    jobType: ['full-time'],
    farmType: ['conventional', 'livestock'],
    categories: ['farm-manager', 'livestock-management'],
    tags: ['poultry', 'broilers', 'chickens', 'contract-farming'],
    benefits: ['health-insurance', 'housing-stipend', 'performance-bonus'],
    companyEmail: 'hr@gabroilerops.com',
    applyUrl: 'https://gabroilerops.com/careers',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'organic-vegetable-grower-georgia',
    title: 'Organic Vegetable Grower',
    company: 'Atlanta Local Farms',
    description: `Urban-adjacent organic farm supplying Atlanta restaurants and farmers markets seeks experienced vegetable grower.

Responsibilities:
• Plan and execute succession plantings
• Manage certified organic production practices
• Coordinate harvest for restaurant deliveries
• Staff Atlanta-area farmers markets
• Maintain irrigation and high tunnel systems
• Train and supervise farm interns

Requirements:
• 3+ years organic vegetable production
• Knowledge of intensive growing methods
• Experience with restaurant sales
• Excellent time management
• Valid driver's license for deliveries
• Customer service skills`,
    location: 'Decatur, GA',
    salaryMin: 40000,
    salaryMax: 48000,
    jobType: ['full-time'],
    farmType: ['organic', 'market-garden'],
    categories: ['farm-hand', 'crop-production'],
    tags: ['organic', 'vegetables', 'farmers-market', 'restaurants'],
    benefits: ['produce-share', 'health-insurance', 'flexible-schedule'],
    companyEmail: 'farm@atlantalocalfarms.com',
    companyWebsite: 'https://atlantalocalfarms.com',
    applyEmail: 'farm@atlantalocalfarms.com',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'pecan-orchard-worker-georgia',
    title: 'Pecan Orchard Worker',
    company: 'Albany Pecan Company',
    description: `One of Georgia's largest pecan operations seeking orchard workers for year-round positions in our 2,000-acre operation.

Responsibilities:
• Tree maintenance and pruning
• Operate harvesting equipment during fall harvest
• Orchard floor management
• Irrigation system maintenance
• Pesticide application under supervision
• Equipment operation and basic repair

Requirements:
• Experience operating farm equipment
• Comfortable working at heights for pruning
• Available for long hours during harvest (Oct-Dec)
• Valid driver's license
• Physical fitness for outdoor work
• Mechanical aptitude helpful`,
    location: 'Albany, GA',
    salaryMin: 35000,
    salaryMax: 44000,
    jobType: ['full-time'],
    farmType: ['conventional', 'orchard'],
    categories: ['farm-hand', 'specialty-crops'],
    tags: ['pecans', 'nuts', 'orchard', 'harvest'],
    benefits: ['health-insurance', 'pecan-share', 'overtime-pay'],
    companyEmail: 'jobs@albanypecan.com',
    companyWebsite: 'https://albanypecan.com',
    applyEmail: 'jobs@albanypecan.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'cattle-ranch-hand-georgia',
    title: 'Cattle Ranch Hand',
    company: 'South Georgia Cattle Co.',
    description: `Family-owned beef cattle operation seeking reliable ranch hand for our 1,500-acre cow-calf operation.

Responsibilities:
• Daily cattle care and feeding
• Fence repair and pasture maintenance
• Hay production and feeding
• Calving season assistance
• Work cattle through chute for processing
• Equipment operation and maintenance

Requirements:
• Cattle handling experience required
• Ability to ride horses preferred
• Valid driver's license
• Physical fitness for demanding work
• Self-motivated and dependable
• Available for calving season on-call`,
    location: 'Moultrie, GA',
    salaryMin: 36000,
    salaryMax: 45000,
    jobType: ['full-time'],
    farmType: ['conventional', 'livestock'],
    categories: ['ranch-hand', 'livestock-management'],
    tags: ['cattle', 'beef', 'cow-calf', 'ranching'],
    benefits: ['housing', 'beef-share', 'equipment'],
    companyEmail: 'ranch@sgcattleco.com',
    applyEmail: 'ranch@sgcattleco.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'blueberry-farm-supervisor-georgia',
    title: 'Blueberry Farm Supervisor',
    company: 'Southern Blueberry Farms',
    description: `Major blueberry producer in South Georgia seeks experienced supervisor to manage field operations during our growing and harvest seasons.

Responsibilities:
• Supervise field crews of 20-40 workers
• Coordinate harvest timing and quality
• Manage pruning and plant care schedules
• Oversee irrigation and fertigation
• Monitor pest and disease pressure
• Maintain production records

Requirements:
• Supervisory experience in agriculture
• Knowledge of blueberry production preferred
• Strong bilingual English/Spanish required
• Excellent organizational skills
• Valid driver's license
• Experience with H-2A workers a plus`,
    location: 'Alma, GA',
    salaryMin: 48000,
    salaryMax: 58000,
    jobType: ['full-time'],
    farmType: ['conventional', 'orchard'],
    categories: ['farm-manager', 'specialty-crops'],
    tags: ['blueberries', 'fruit', 'supervision', 'harvest'],
    benefits: ['health-insurance', 'housing-available', 'bonus-potential'],
    companyEmail: 'careers@southernblueberry.com',
    companyWebsite: 'https://southernblueberry.com',
    applyUrl: 'https://southernblueberry.com/jobs',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'farm-to-table-coordinator-georgia',
    title: 'Farm to Table Coordinator',
    company: 'Serenbe Farms',
    description: `Innovative community farm at Serenbe seeks coordinator to connect our organic production with restaurants, CSA, and community events.

Responsibilities:
• Coordinate harvest and delivery to on-site restaurants
• Manage CSA program and member communications
• Plan farm dinners and agritourism events
• Lead farm tours for community residents
• Assist with social media and marketing
• Support field production as needed

Requirements:
• Experience in sustainable agriculture
• Event planning and coordination skills
• Excellent communication abilities
• Passion for local food systems
• Valid driver's license
• Comfortable with public speaking`,
    location: 'Chattahoochee Hills, GA',
    salaryMin: 42000,
    salaryMax: 52000,
    jobType: ['full-time'],
    farmType: ['organic', 'educational', 'csa'],
    categories: ['education', 'farm-manager'],
    tags: ['farm-to-table', 'events', 'csa', 'community'],
    benefits: ['health-insurance', 'produce-share', 'community-housing-discount'],
    companyEmail: 'farm@serenbe.com',
    companyWebsite: 'https://serenbe.com/farms',
    applyEmail: 'farm@serenbe.com',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'peanut-farm-equipment-operator-georgia',
    title: 'Peanut Farm Equipment Operator',
    company: 'Plains Peanut Farms',
    description: `Large peanut operation in historic Plains, Georgia seeking skilled equipment operators for our row crop operation.

Responsibilities:
• Operate planters, diggers, and combines
• Maintain and repair farm equipment
• GPS guidance system operation
• Irrigation pivot management
• Grain cart and truck operation during harvest
• Field scouting for pests and disease

Requirements:
• 3+ years experience operating farm equipment
• Knowledge of row crop production
• Mechanical repair skills
• CDL or ability to obtain
• Available for long hours during planting and harvest
• Clean driving record`,
    location: 'Plains, GA',
    salaryMin: 42000,
    salaryMax: 52000,
    jobType: ['full-time'],
    farmType: ['conventional', 'row-crop'],
    categories: ['farm-hand', 'crop-production'],
    tags: ['peanuts', 'equipment', 'row-crops', 'georgia'],
    benefits: ['health-insurance', 'retirement', 'overtime-pay'],
    companyEmail: 'jobs@plainspeanut.com',
    applyEmail: 'jobs@plainspeanut.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'goat-farm-assistant-georgia',
    title: 'Goat Farm Assistant',
    company: 'Caprine Creek Farm',
    description: `Growing meat goat operation seeks assistant to help manage our herd of 200+ Boer and Kiko goats.

Responsibilities:
• Daily goat care and feeding
• Pasture rotation management
• Kidding season assistance
• Health monitoring and basic veterinary care
• Fence maintenance and repair
• Assist with direct sales and farmers markets

Requirements:
• Experience with goats or other livestock
• Knowledge of rotational grazing
• Physical ability for farm work
• Valid driver's license
• Flexible schedule during kidding
• Interest in sustainable livestock production`,
    location: 'Madison, GA',
    salaryMin: 32000,
    salaryMax: 40000,
    jobType: ['full-time'],
    farmType: ['organic', 'livestock'],
    categories: ['farm-hand', 'livestock-management'],
    tags: ['goats', 'meat-goats', 'grazing', 'direct-sales'],
    benefits: ['housing-available', 'goat-share', 'flexible-schedule'],
    companyEmail: 'farm@caprinecreek.com',
    companyWebsite: 'https://caprinecreek.com',
    applyEmail: 'farm@caprinecreek.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'cotton-farm-scout-georgia',
    title: 'Cotton Farm Scout & IPM Specialist',
    company: 'Burke County Cotton',
    description: `Cotton and peanut operation seeking dedicated scout to monitor crop health and implement integrated pest management program.

Responsibilities:
• Regular field scouting for pests and diseases
• Monitor beneficial insect populations
• Collect soil and tissue samples
• Maintain detailed scouting records
• Recommend treatment thresholds
• Assist with precision agriculture mapping

Requirements:
• Degree in agronomy, entomology, or related field
• Knowledge of cotton and peanut pests
• Detail-oriented with strong record keeping
• Valid driver's license
• Comfortable working in hot Georgia summers
• Pesticide applicator license preferred`,
    location: 'Waynesboro, GA',
    salaryMin: 40000,
    salaryMax: 50000,
    jobType: ['full-time', 'seasonal'],
    farmType: ['conventional', 'row-crop'],
    categories: ['crop-production', 'farm-hand'],
    tags: ['cotton', 'ipm', 'scouting', 'agronomy'],
    benefits: ['health-insurance', 'vehicle-provided', 'professional-development'],
    companyEmail: 'hr@burkecountycotton.com',
    applyEmail: 'hr@burkecountycotton.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'urban-farm-educator-georgia',
    title: 'Urban Farm Educator',
    company: 'Truly Living Well Center',
    description: `Atlanta's premier urban agriculture nonprofit seeks educator to lead youth programs and community workshops at our urban farm sites.

Responsibilities:
• Develop and lead youth education programs
• Coordinate school field trips and summer camps
• Train community volunteers
• Manage demonstration garden areas
• Create educational curriculum
• Assist with farm production as needed

Requirements:
• Experience in education or youth development
• Knowledge of organic gardening
• Excellent communication skills
• Passion for food justice and community health
• Valid driver's license
• Background check required`,
    location: 'Atlanta, GA',
    salaryMin: 38000,
    salaryMax: 46000,
    jobType: ['full-time'],
    farmType: ['organic', 'urban', 'educational'],
    categories: ['education', 'gardener'],
    tags: ['urban-farming', 'education', 'youth', 'food-justice'],
    benefits: ['health-insurance', 'paid-time-off', 'transit-benefits'],
    companyEmail: 'jobs@trulylivingwell.com',
    companyWebsite: 'https://trulylivingwell.com',
    applyUrl: 'https://trulylivingwell.com/careers',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'greenhouse-grower-georgia',
    title: 'Greenhouse Grower - Tomatoes',
    company: 'Georgia Greenhouse Growers',
    description: `Year-round greenhouse tomato operation seeking experienced grower to manage production in our 10-acre hydroponic facility.

Responsibilities:
• Manage crop from seeding through harvest
• Monitor and adjust climate control systems
• Implement IPM protocols
• Supervise harvest crew
• Maintain nutrient solution management
• Quality control and grading

Requirements:
• 3+ years greenhouse tomato experience
• Knowledge of hydroponic systems
• Strong attention to detail
• Comfortable with technology and data
• Leadership and team management skills
• Bilingual English/Spanish preferred`,
    location: 'Tifton, GA',
    salaryMin: 50000,
    salaryMax: 62000,
    jobType: ['full-time'],
    farmType: ['hydroponics', 'greenhouse'],
    categories: ['greenhouse-production', 'farm-manager'],
    tags: ['tomatoes', 'hydroponics', 'greenhouse', 'year-round'],
    benefits: ['health-insurance', 'retirement', 'produce-share', 'paid-time-off'],
    companyEmail: 'careers@gagreenhouse.com',
    companyWebsite: 'https://gagreenhouse.com',
    applyUrl: 'https://gagreenhouse.com/careers',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'horse-trainer-georgia',
    title: 'Horse Trainer & Barn Manager',
    company: 'Callaway Equestrian Center',
    description: `Premier equestrian facility near Atlanta seeks experienced trainer and barn manager for our lesson and boarding operation.

Responsibilities:
• Train horses for English and Western disciplines
• Manage daily barn operations
• Supervise barn staff of 4-6
• Coordinate lesson program scheduling
• Oversee horse health and farrier appointments
• Maintain facilities and equipment

Requirements:
• 5+ years professional horse training
• Experience managing barn operations
• Teaching certification preferred
• Strong customer service skills
• Physical fitness for demanding work
• CDL for horse transport a plus`,
    location: 'Pine Mountain, GA',
    salaryMin: 45000,
    salaryMax: 58000,
    jobType: ['full-time'],
    farmType: ['conventional', 'livestock'],
    categories: ['livestock-management', 'education'],
    tags: ['horses', 'equestrian', 'training', 'boarding'],
    benefits: ['housing', 'health-insurance', 'lesson-discount'],
    companyEmail: 'horses@callawayequestrian.com',
    companyWebsite: 'https://callawayequestrian.com',
    applyEmail: 'horses@callawayequestrian.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'hemp-cultivation-manager-georgia',
    title: 'Hemp Cultivation Manager',
    company: 'Georgia Hemp Company',
    description: `Licensed hemp operation seeking cultivation manager to oversee production of CBD hemp on our 150-acre farm.

Responsibilities:
• Plan and manage cultivation from seed to harvest
• Implement organic growing practices
• Monitor THC levels for compliance
• Coordinate harvest and drying operations
• Maintain detailed cultivation records
• Work with extraction facility on quality

Requirements:
• Cannabis or hemp cultivation experience
• Knowledge of Georgia hemp regulations
• Organic growing experience preferred
• Strong record-keeping skills
• Valid driver's license
• Able to pass background check`,
    location: 'Colquitt, GA',
    salaryMin: 48000,
    salaryMax: 60000,
    jobType: ['full-time'],
    farmType: ['organic', 'specialty'],
    categories: ['farm-manager', 'specialty-crops'],
    tags: ['hemp', 'cbd', 'cultivation', 'compliance'],
    benefits: ['health-insurance', 'performance-bonus', 'professional-development'],
    companyEmail: 'grow@gahempco.com',
    companyWebsite: 'https://gahempco.com',
    applyEmail: 'grow@gahempco.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'dairy-farm-worker-georgia',
    title: 'Dairy Farm Worker',
    company: 'Hillside Dairy',
    description: `Family dairy operation seeking reliable worker for our 200-head Jersey dairy in North Georgia.

Responsibilities:
• Morning and evening milking shifts
• Cow care and health monitoring
• Feeding and nutrition management
• Calf care and bottle feeding
• Equipment cleaning and maintenance
• Pasture and facility upkeep

Requirements:
• Dairy experience preferred but will train
• Early morning availability (4 AM start)
• Physical fitness for demanding work
• Reliable and punctual
• Good with animals
• Valid driver's license`,
    location: 'Cleveland, GA',
    salaryMin: 34000,
    salaryMax: 42000,
    jobType: ['full-time'],
    farmType: ['conventional', 'livestock'],
    categories: ['farm-hand', 'livestock-management'],
    tags: ['dairy', 'cows', 'milking', 'jersey'],
    benefits: ['housing-available', 'dairy-products', 'meals'],
    companyEmail: 'farm@hillsidedairy.com',
    applyEmail: 'farm@hillsidedairy.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'farm-internship-georgia',
    title: 'Sustainable Farm Internship',
    company: 'White Oak Pastures',
    description: `Learn regenerative agriculture at one of the Southeast's most innovative farms. This immersive 6-month program covers pastured livestock, vegetable production, and farm business.

Program Includes:
• Hands-on experience with multiple livestock species
• Vegetable garden and orchard management
• On-farm processing operations
• Direct marketing and agritourism
• Weekly educational sessions
• Room, board, and monthly stipend

We're Looking For:
• Passion for regenerative agriculture
• Physical fitness for demanding work
• Commitment to full 6-month program
• Willingness to work weekends
• Team player attitude`,
    location: 'Bluffton, GA',
    salaryMin: 6000,
    salaryMax: 6000,
    jobType: ['seasonal', 'apprenticeship'],
    farmType: ['regenerative', 'livestock', 'diversified'],
    categories: ['apprenticeship', 'education'],
    tags: ['regenerative', 'internship', 'livestock', 'beginning-farmer'],
    benefits: ['housing', 'meals', 'education', 'meat-share'],
    companyEmail: 'internship@whiteoakpastures.com',
    companyWebsite: 'https://whiteoakpastures.com',
    applyUrl: 'https://whiteoakpastures.com/internship',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'muscadine-vineyard-worker-georgia',
    title: 'Muscadine Vineyard Worker',
    company: 'Georgia Wine Country Vineyards',
    description: `Family vineyard growing native muscadine grapes for wine production seeks vineyard workers for year-round positions.

Responsibilities:
• Vineyard maintenance and pruning
• Canopy management and training
• Harvest coordination
• Assist with wine production
• Tasting room support during events
• General farm maintenance

Requirements:
• Interest in viticulture and wine
• Comfortable working outdoors
• Attention to detail
• Customer service skills for tasting room
• Valid driver's license
• Weekend availability during harvest`,
    location: 'Dahlonega, GA',
    salaryMin: 32000,
    salaryMax: 40000,
    jobType: ['full-time'],
    farmType: ['conventional', 'vineyard'],
    categories: ['farm-hand', 'specialty-crops'],
    tags: ['muscadine', 'wine', 'vineyard', 'georgia'],
    benefits: ['wine-share', 'tasting-room-tips', 'flexible-schedule'],
    companyEmail: 'vineyard@gawinecontry.com',
    companyWebsite: 'https://gawinecountry.com',
    applyEmail: 'vineyard@gawinecountry.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'row-crop-farm-manager-georgia',
    title: 'Row Crop Farm Manager',
    company: 'Dougherty County Farms',
    description: `Large-scale row crop operation seeking experienced farm manager to oversee 5,000+ acres of cotton, peanuts, and corn in Southwest Georgia.

Responsibilities:
• Plan and execute planting and harvest operations
• Manage precision agriculture technology
• Supervise full-time and seasonal employees
• Coordinate with crop consultants and chemical reps
• Maintain equipment fleet
• Budget management and record keeping

Requirements:
• 5+ years row crop management experience
• Knowledge of cotton, peanut, and corn production
• Experience with precision ag technology
• Strong leadership and communication skills
• CDL required
• Degree in agriculture or equivalent experience`,
    location: 'Albany, GA',
    salaryMin: 65000,
    salaryMax: 85000,
    jobType: ['full-time'],
    farmType: ['conventional', 'row-crop'],
    categories: ['farm-manager', 'crop-production'],
    tags: ['cotton', 'peanuts', 'corn', 'precision-ag'],
    benefits: ['housing', 'health-insurance', 'retirement', 'vehicle', 'bonus'],
    companyEmail: 'careers@doughertyfarms.com',
    companyWebsite: 'https://doughertyfarms.com',
    applyUrl: 'https://doughertyfarms.com/careers',
    featured: true,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'farmers-market-manager-georgia',
    title: 'Farmers Market Manager',
    company: 'Savannah City Market',
    description: `Historic Savannah farmers market seeks dynamic manager to oversee operations and grow vendor and customer participation.

Responsibilities:
• Recruit and manage 40+ vendor relationships
• Coordinate market logistics and setup
• Marketing and community outreach
• Manage SNAP/EBT and nutrition programs
• Supervise market staff and volunteers
• Grant writing and reporting

Requirements:
• Experience in farmers markets or events
• Strong organizational skills
• Excellent communication abilities
• Knowledge of local food systems
• Valid driver's license
• Weekend availability required`,
    location: 'Savannah, GA',
    salaryMin: 42000,
    salaryMax: 50000,
    jobType: ['full-time'],
    farmType: ['organic', 'educational'],
    categories: ['farm-manager', 'education'],
    tags: ['farmers-market', 'local-food', 'community', 'events'],
    benefits: ['health-insurance', 'paid-time-off', 'market-perks'],
    companyEmail: 'manager@savannahcitymarket.org',
    companyWebsite: 'https://savannahcitymarket.org',
    applyUrl: 'https://savannahcitymarket.org/jobs',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'tree-nursery-worker-georgia',
    title: 'Tree Nursery Worker',
    company: 'Georgia Forestry Nursery',
    description: `Large forestry nursery producing pine seedlings for reforestation seeks seasonal and year-round workers.

Responsibilities:
• Seedbed preparation and planting
• Irrigation and fertilization management
• Seedling lifting and grading
• Equipment operation
• Greenhouse care
• Shipping and customer orders

Requirements:
• Agricultural or forestry experience helpful
• Able to work outdoors in various conditions
• Physical stamina for repetitive tasks
• Team player attitude
• Valid driver's license
• Forklift experience a plus`,
    location: 'Hawkinsville, GA',
    salaryMin: 30000,
    salaryMax: 38000,
    jobType: ['full-time', 'seasonal'],
    farmType: ['conventional', 'specialty'],
    categories: ['farm-hand', 'specialty-crops'],
    tags: ['trees', 'forestry', 'nursery', 'seedlings'],
    benefits: ['health-insurance', 'overtime-pay', 'seasonal-bonus'],
    companyEmail: 'jobs@gaforestrynursery.com',
    applyEmail: 'jobs@gaforestrynursery.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'mushroom-cultivation-specialist-oregon',
    title: 'Mushroom Cultivation Specialist',
    company: 'Pacific Fungi Farm',
    description: `We're looking for a passionate mushroom cultivation specialist to help expand our gourmet and medicinal mushroom operation in the lush forests of coastal Oregon.

Responsibilities:
• Manage indoor and outdoor mushroom growing environments
• Inoculate logs, straw, and substrate blocks
• Monitor humidity, temperature, and air flow in grow rooms
• Harvest, grade, and package mushrooms for market
• Maintain sterile lab procedures for spawn production
• Assist with farmers market sales and restaurant deliveries

Requirements:
• Experience with shiitake, oyster, or lion's mane cultivation
• Understanding of sterile technique and contamination prevention
• Comfortable working in humid environments
• Attention to detail and record-keeping skills
• Interest in mycology and forest ecology`,
    location: 'Astoria, OR',
    salaryMin: 38000,
    salaryMax: 46000,
    jobType: ['full-time'],
    farmType: ['organic', 'indoor'],
    categories: ['farm-hand', 'crop-production'],
    tags: ['sustainable', 'greenhouse', 'processing'],
    benefits: ['housing', 'produce-share', 'learning'],
    companyEmail: 'careers@pacificfungi.com',
    companyWebsite: 'https://pacificfungi.com',
    applyEmail: 'careers@pacificfungi.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'goat-dairy-assistant-wisconsin',
    title: 'Goat Dairy Assistant',
    company: 'Rolling Hills Creamery',
    description: `Small artisan goat dairy seeking a reliable assistant to help with daily milking, herd health, and cheesemaking. We produce award-winning aged chèvre and fresh goat cheese for farmers markets and specialty stores.

Responsibilities:
• Twice-daily milking of 60-head goat herd
• Feeding, watering, and pasture rotation
• Monitoring herd health and assisting with veterinary care
• Assisting with cheesemaking and aging room maintenance
• Cleaning and sanitizing milking equipment
• Helping with kid rearing during spring season

Requirements:
• Experience with dairy animals preferred
• Willingness to work early mornings and weekends
• Physical ability to lift 50+ lbs
• Interest in artisan food production
• Reliable transportation`,
    location: 'Spring Green, WI',
    salaryMin: 32000,
    salaryMax: 40000,
    jobType: ['full-time'],
    farmType: ['small-scale', 'organic'],
    categories: ['livestock-care', 'farm-hand'],
    tags: ['animal-care', 'processing', 'sustainable'],
    benefits: ['housing', 'meals', 'produce-share', 'learning'],
    companyEmail: 'info@rollinghillscreamery.com',
    applyEmail: 'info@rollinghillscreamery.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'irrigation-technician-arizona',
    title: 'Irrigation Technician',
    company: 'Desert Bloom Farms',
    description: `Join our innovative desert agriculture operation as an irrigation technician. We grow specialty crops using cutting-edge drip irrigation and water reclamation systems in the arid Southwest.

Responsibilities:
• Install, maintain, and repair drip irrigation systems
• Monitor soil moisture sensors and adjust watering schedules
• Manage water filtration and fertigation equipment
• Troubleshoot pump and valve issues
• Track water usage and efficiency metrics
• Collaborate with farm manager on crop water needs

Requirements:
• 2+ years experience with agricultural irrigation systems
• Knowledge of drip, micro-sprinkler, and flood irrigation
• Basic plumbing and electrical skills
• Ability to read and interpret system blueprints
• Comfort working in extreme heat
• Valid driver's license`,
    location: 'Tucson, AZ',
    salaryMin: 42000,
    salaryMax: 52000,
    jobType: ['full-time'],
    farmType: ['conventional', 'large-scale'],
    categories: ['agricultural-tech', 'farm-hand'],
    tags: ['machinery', 'crop-production', 'sustainable'],
    benefits: ['health-insurance', 'equipment', 'transportation'],
    companyEmail: 'hiring@desertbloomfarms.com',
    companyWebsite: 'https://desertbloomfarms.com',
    applyUrl: 'https://desertbloomfarms.com/careers',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'farm-to-table-chef-tennessee',
    title: 'Farm-to-Table Chef',
    company: 'Smoky Hollow Farm & Kitchen',
    description: `We're seeking a creative chef to run the kitchen at our farm-to-table restaurant and event venue nestled in the foothills of the Great Smoky Mountains. You'll work hand-in-hand with our farm crew to create seasonal menus.

Responsibilities:
• Design and execute seasonal menus using on-farm produce
• Coordinate harvest planning with the farm team
• Manage kitchen staff and prep schedules
• Oversee food preservation, fermentation, and canning
• Cook for farm dinners, weddings, and special events
• Maintain food safety standards and kitchen cleanliness

Requirements:
• Culinary degree or 3+ years professional kitchen experience
• Passion for seasonal, locally sourced cooking
• Experience with preservation and fermentation techniques
• Ability to manage a small kitchen team
• Knowledge of food safety regulations
• Flexible schedule including evenings and weekends`,
    location: 'Gatlinburg, TN',
    salaryMin: 40000,
    salaryMax: 55000,
    jobType: ['full-time'],
    farmType: ['organic', 'small-scale'],
    categories: ['kitchen', 'other'],
    tags: ['processing', 'sustainable', 'education'],
    benefits: ['meals', 'produce-share', 'flexible-hours'],
    companyEmail: 'chef@smokyhollowfarm.com',
    companyWebsite: 'https://smokyhollowfarm.com',
    applyEmail: 'chef@smokyhollowfarm.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'vineyard-field-worker-new-york',
    title: 'Vineyard Field Worker',
    company: 'Finger Lakes Wine Estates',
    description: `Seeking seasonal vineyard workers for our award-winning winery in the beautiful Finger Lakes region. Great opportunity to learn about viticulture while working in one of the most scenic wine regions in the Northeast.

Responsibilities:
• Pruning, shoot positioning, and canopy management
• Hand harvesting grapes during crush season
• Vineyard floor management and mowing
• Trellising and vine training
• Pest and disease scouting
• General vineyard maintenance

Requirements:
• Physical fitness to work outdoors for extended periods
• Ability to use pruning shears and hand tools
• Willingness to work long days during harvest (September-October)
• No experience necessary — we will train
• Must be available May through October
• Reliable transportation to vineyard`,
    location: 'Watkins Glen, NY',
    salaryMin: 16,
    salaryMax: 20,
    jobType: ['seasonal'],
    farmType: ['conventional'],
    categories: ['viticulture', 'harvest-worker'],
    tags: ['outdoor', 'physical', 'beginner-friendly'],
    benefits: ['meals', 'learning', 'produce-share'],
    companyEmail: 'vineyard@fingerlakeswine.com',
    companyWebsite: 'https://fingerlakeswine.com',
    applyEmail: 'vineyard@fingerlakeswine.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'aquaponics-systems-manager-florida',
    title: 'Aquaponics Systems Manager',
    company: 'Tropical Tides Aquaponics',
    description: `Manage our commercial aquaponics greenhouse producing tilapia and leafy greens year-round in sunny South Florida. This role combines fish husbandry with hydroponic crop production.

Responsibilities:
• Monitor and maintain aquaponics system water chemistry
• Manage tilapia breeding, feeding, and harvesting
• Oversee lettuce, basil, and microgreen production
• Maintain pumps, filters, aeration, and plumbing
• Track production data and optimize yields
• Train and supervise part-time staff

Requirements:
• Experience in aquaponics, aquaculture, or hydroponics
• Understanding of water chemistry (pH, ammonia, nitrates)
• Basic mechanical and plumbing skills
• Ability to manage fish health and diagnose issues
• Strong organizational and record-keeping skills
• Degree in aquaculture, biology, or related field preferred`,
    location: 'Homestead, FL',
    salaryMin: 45000,
    salaryMax: 55000,
    jobType: ['full-time'],
    farmType: ['indoor', 'organic'],
    categories: ['aquaponics', 'farm-manager'],
    tags: ['sustainable', 'greenhouse', 'crop-production'],
    benefits: ['health-insurance', 'produce-share', 'learning'],
    companyEmail: 'jobs@tropicaltides.com',
    companyWebsite: 'https://tropicaltides.com',
    applyUrl: 'https://tropicaltides.com/apply',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'draft-horse-teamster-pennsylvania',
    title: 'Draft Horse Teamster',
    company: 'Heritage Acres Farm',
    description: `Seeking an experienced teamster to work our 80-acre diversified farm using draft horse power. We are a horse-powered CSA and education farm committed to low-tech, sustainable agriculture.

Responsibilities:
• Harness, drive, and care for a team of Percherons
• Plow, disc, cultivate, and harvest using horse-drawn equipment
• Daily horse care including feeding, grooming, and health checks
• Maintain and repair harness and horse-drawn implements
• Lead educational workshops on draft horse farming
• Assist with general farm work as needed

Requirements:
• Significant experience driving draft horses
• Knowledge of horse health, nutrition, and hoof care
• Ability to maintain and repair leather harness
• Mechanical aptitude for implement maintenance
• Teaching ability for public workshops
• Strong work ethic and self-motivation`,
    location: 'Lancaster, PA',
    salaryMin: 35000,
    salaryMax: 45000,
    jobType: ['full-time'],
    farmType: ['organic', 'small-scale', 'csa'],
    categories: ['livestock-care', 'farm-hand'],
    tags: ['animal-care', 'education', 'sustainable'],
    benefits: ['housing', 'meals', 'produce-share', 'learning'],
    companyEmail: 'farm@heritageacres.org',
    companyWebsite: 'https://heritageacres.org',
    applyEmail: 'farm@heritageacres.org',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'farmers-market-coordinator-colorado',
    title: 'Farmers Market Coordinator',
    company: 'Front Range Organic Collective',
    description: `Coordinate market sales and customer relationships for a cooperative of five organic farms along Colorado's Front Range. You'll be the face of our farms at three weekly markets.

Responsibilities:
• Set up and manage market booths at three weekly farmers markets
• Handle cash and card transactions using Square POS
• Build relationships with chefs, restaurants, and regular customers
• Coordinate harvest lists and product availability with member farms
• Manage social media accounts and weekly newsletter
• Track sales data and inventory across markets

Requirements:
• Excellent customer service and communication skills
• Experience in retail, farmers markets, or food service
• Proficiency with POS systems and basic spreadsheets
• Social media management experience
• Ability to lift and carry market supplies (50+ lbs)
• Valid driver's license and reliable vehicle
• Enthusiasm for local food and sustainable agriculture`,
    location: 'Boulder, CO',
    salaryMin: 36000,
    salaryMax: 44000,
    jobType: ['full-time'],
    farmType: ['organic', 'csa'],
    categories: ['marketing', 'retail'],
    tags: ['sales', 'marketing', 'sustainable'],
    benefits: ['produce-share', 'flexible-hours', 'transportation'],
    companyEmail: 'markets@frontrangeorganic.com',
    companyWebsite: 'https://frontrangeorganic.com',
    applyEmail: 'markets@frontrangeorganic.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'regenerative-grazing-manager-texas',
    title: 'Regenerative Grazing Manager',
    company: 'Lone Star Regenerative Ranch',
    description: `Lead our adaptive multi-paddock grazing program on a 2,000-acre cattle and sheep operation in the Texas Hill Country. We're building soil health through holistic planned grazing.

Responsibilities:
• Plan and execute daily livestock moves across 40+ paddocks
• Monitor pasture recovery, soil health, and forage quality
• Manage electric fencing infrastructure
• Track animal performance and grazing data
• Coordinate with veterinarian on herd health
• Mentor ranch interns in regenerative practices

Requirements:
• 3+ years experience in rotational or adaptive grazing
• Knowledge of forage species identification and management
• Understanding of soil biology and regenerative principles
• Experience with cattle and/or sheep handling
• Ability to work independently in remote conditions
• Holistic Management certification preferred`,
    location: 'Fredericksburg, TX',
    salaryMin: 48000,
    salaryMax: 60000,
    jobType: ['full-time'],
    farmType: ['regenerative', 'ranch'],
    categories: ['farm-manager', 'ranch-hand'],
    tags: ['animal-care', 'sustainable', 'education'],
    benefits: ['housing', 'health-insurance', 'equipment', 'profit-sharing'],
    companyEmail: 'ranch@lonestarregenag.com',
    companyWebsite: 'https://lonestarregenag.com',
    applyUrl: 'https://lonestarregenag.com/jobs',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'flower-farm-grower-north-carolina',
    title: 'Flower Farm Grower',
    company: 'Blue Ridge Blooms',
    description: `Join our specialty cut flower farm growing over 100 varieties of seasonal blooms for weddings, florists, and farmers markets in the Blue Ridge Mountains.

Responsibilities:
• Seed starting, transplanting, and direct sowing of annual and perennial flowers
• Daily harvesting, conditioning, and arranging cut flowers
• Pest and disease management using organic methods
• Maintaining drip irrigation and row cover systems
• Creating bouquets and floral arrangements for market
• Assisting with wedding and event flower orders

Requirements:
• Knowledge of cut flower varieties and growing requirements
• Experience with succession planting and crop timing
• Eye for color and design in bouquet arranging
• Comfortable working in heat and rain
• Early morning availability (5 AM harvest starts)
• Own transportation to farm`,
    location: 'Asheville, NC',
    salaryMin: 30000,
    salaryMax: 38000,
    jobType: ['full-time', 'seasonal'],
    farmType: ['organic', 'small-scale'],
    categories: ['gardener', 'crop-production'],
    tags: ['outdoor', 'sustainable', 'crop-production'],
    benefits: ['produce-share', 'flexible-hours', 'learning'],
    companyEmail: 'grow@blueridgeblooms.com',
    companyWebsite: 'https://blueridgeblooms.com',
    applyEmail: 'grow@blueridgeblooms.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'beekeeper-apprentice-maine',
    title: 'Beekeeper Apprentice',
    company: 'Downeast Apiaries',
    description: `Learn the art and science of beekeeping at our 200-hive operation producing raw honey, beeswax candles, and pollination services across coastal Maine.

Responsibilities:
• Assist with hive inspections and colony assessments
• Help with honey extraction, bottling, and labeling
• Build and repair hive equipment (frames, boxes, feeders)
• Support queen rearing and nucleus colony production
• Participate in spring and fall hive management
• Help deliver hives for blueberry pollination contracts

Requirements:
• Strong interest in beekeeping and pollinator conservation
• No bee sting allergies
• Ability to lift 60+ lb honey supers
• Comfortable working around stinging insects
• Willingness to learn and follow safety protocols
• Valid driver's license
• No experience necessary — comprehensive training provided`,
    location: 'Bar Harbor, ME',
    salaryMin: 28000,
    salaryMax: 34000,
    jobType: ['apprenticeship', 'seasonal'],
    farmType: ['small-scale'],
    categories: ['apiculture'],
    tags: ['animal-care', 'beginner-friendly', 'outdoor', 'education'],
    benefits: ['housing', 'meals', 'learning', 'produce-share'],
    companyEmail: 'bees@downeastapiaries.com',
    companyWebsite: 'https://downeastapiaries.com',
    applyEmail: 'bees@downeastapiaries.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'composting-facility-operator-iowa',
    title: 'Composting Facility Operator',
    company: 'Prairie Circle Compost',
    description: `Operate our large-scale composting facility that converts agricultural waste and food scraps into premium compost and soil amendments for Midwest farmers and gardeners.

Responsibilities:
• Manage windrow composting operations (turning, watering, monitoring)
• Operate front-end loader, screener, and spreading equipment
• Monitor compost temperatures, moisture, and maturity
• Coordinate feedstock collection from farms and food processors
• Manage finished compost inventory and customer orders
• Maintain equipment and facility grounds

Requirements:
• Experience operating heavy equipment (loader, skid steer)
• Understanding of composting science and best practices
• CDL preferred but not required
• Mechanical aptitude for equipment maintenance
• Comfortable working outdoors in all seasons
• Strong work ethic and attention to safety`,
    location: 'Ames, IA',
    salaryMin: 38000,
    salaryMax: 48000,
    jobType: ['full-time'],
    farmType: ['conventional', 'large-scale'],
    categories: ['agricultural-tech', 'farm-hand'],
    tags: ['machinery', 'sustainable', 'processing'],
    benefits: ['health-insurance', 'equipment', 'profit-sharing'],
    companyEmail: 'jobs@prairiecirclecompost.com',
    applyEmail: 'jobs@prairiecirclecompost.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'agritourism-event-coordinator-virginia',
    title: 'Agritourism Event Coordinator',
    company: 'Shenandoah Valley Farm Experience',
    description: `Plan and execute farm-based events and experiences at our scenic 150-acre agritourism destination in Virginia's Shenandoah Valley. We host farm stays, u-pick events, weddings, and educational tours.

Responsibilities:
• Plan and coordinate u-pick days, farm dinners, and seasonal festivals
• Manage farm stay guest experience and cabin bookings
• Coordinate with wedding clients and event vendors
• Create marketing content and manage social media presence
• Train and schedule seasonal event staff
• Ensure compliance with health and safety regulations

Requirements:
• 2+ years event planning or hospitality experience
• Excellent organizational and multitasking skills
• Strong written and verbal communication
• Proficiency with booking software and social media platforms
• Customer service orientation
• Flexible schedule including weekends and holidays
• Passion for rural life and agricultural education`,
    location: 'Staunton, VA',
    salaryMin: 38000,
    salaryMax: 48000,
    jobType: ['full-time'],
    farmType: ['agritourism', 'small-scale'],
    categories: ['marketing', 'other'],
    tags: ['education', 'marketing', 'sales'],
    benefits: ['housing', 'meals', 'flexible-hours'],
    companyEmail: 'events@svfarmexperience.com',
    companyWebsite: 'https://svfarmexperience.com',
    applyUrl: 'https://svfarmexperience.com/careers',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'seed-production-technician-idaho',
    title: 'Seed Production Technician',
    company: 'High Desert Seed Co.',
    description: `Help grow and process open-pollinated vegetable and flower seeds for our catalog and wholesale customers. We specialize in varieties adapted to arid and short-season climates.

Responsibilities:
• Plant, cultivate, and rogue seed crops for genetic purity
• Hand-pollinate and isolate crops to prevent cross-pollination
• Harvest, thresh, clean, and package seeds
• Conduct germination testing and quality control
• Maintain detailed field records and variety notes
• Assist with catalog descriptions and trial garden evaluations

Requirements:
• Knowledge of plant biology, pollination, and genetics helpful
• Attention to detail and patience for meticulous work
• Experience with vegetable gardening or farming
• Ability to identify plant varieties and off-types
• Comfortable with repetitive hand work (seed cleaning, sorting)
• Interest in seed sovereignty and crop diversity`,
    location: 'Boise, ID',
    salaryMin: 34000,
    salaryMax: 42000,
    jobType: ['full-time', 'seasonal'],
    farmType: ['organic', 'small-scale'],
    categories: ['crop-production', 'nursery-worker'],
    tags: ['sustainable', 'crop-production', 'outdoor'],
    benefits: ['produce-share', 'learning', 'flexible-hours'],
    companyEmail: 'seeds@highdesertseed.com',
    companyWebsite: 'https://highdesertseed.com',
    applyEmail: 'seeds@highdesertseed.com',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    slug: 'permaculture-design-intern-hawaii',
    title: 'Permaculture Design Intern',
    company: 'Aloha Aina Permaculture',
    description: `Immersive 6-month permaculture internship on a 10-acre tropical food forest and education center on the Big Island of Hawaii. Learn by doing in one of the most biodiverse growing environments on Earth.

Responsibilities:
• Assist with food forest management and tropical crop care
• Participate in permaculture design projects and earthworks
• Help with composting, vermiculture, and biochar production
• Support community workshops and volunteer work days
• Maintain rainwater catchment and greywater systems
• Document projects with photos, maps, and written reports

Requirements:
• Strong interest in permaculture and tropical agriculture
• Willingness to do physical outdoor work in tropical climate
• Basic gardening or farming experience helpful
• Positive attitude and ability to live in community
• Must commit to full 6-month program
• Permaculture Design Certificate course included in internship`,
    location: 'Hilo, HI',
    salaryMin: 800,
    salaryMax: 1200,
    jobType: ['internship'],
    farmType: ['permaculture', 'organic', 'small-scale'],
    categories: ['permaculture', 'gardener'],
    tags: ['sustainable', 'education', 'beginner-friendly', 'outdoor'],
    benefits: ['housing', 'meals', 'learning', 'produce-share'],
    companyEmail: 'intern@alohaaina.org',
    companyWebsite: 'https://alohaaina.org',
    applyUrl: 'https://alohaaina.org/internship',
    featured: false,
    active: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
]

async function main() {
  console.log('Starting seed...')

  // Clear existing jobs
  await prisma.job.deleteMany()
  console.log('Cleared existing jobs')

  // Create jobs
  for (const job of jobsData) {
    const { city, state, location } = parseLocation(job.location);
    const created = await prisma.job.create({
      data: {
        ...job,
        city,
        state,
        location,
        remote: false, // Add default remote field
      },
    })
    console.log(`Created job: ${created.title}`)
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
