import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
]

async function main() {
  console.log('Starting seed...')

  // Clear existing jobs
  await prisma.job.deleteMany()
  console.log('Cleared existing jobs')

  // Create jobs
  for (const job of jobsData) {
    const created = await prisma.job.create({
      data: job,
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
