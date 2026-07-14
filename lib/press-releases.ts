export interface PressRelease {
  slug: string;
  title: string;
  subtitle?: string;
  date: string; // ISO format
  excerpt: string;
  content: string; // Full HTML content
  author: string;
  contact: {
    name: string;
    title: string;
    email: string;
    website: string;
  };
}

export const pressReleases: PressRelease[] = [
  {
    slug: "agriculture-worker-shortage-meets-office-burnout",
    title: "Agriculture's Worker Shortage Meets Office Burnout: New Platform Bridges the Gap",
    subtitle: "PlayInDirtJobs.com Helps Screen-Fatigued Workers Trade Cubicles for Crops While Solving Agriculture's Labor Crisis",
    date: "2025-10-24",
    excerpt: "PlayInDirtJobs, a platform dedicated to connecting workers with sustainable farming, gardening, and ranching careers, launched to address the disconnect between people seeking agricultural work and operations looking for committed workers.",
    author: "Chad Stroud",
    contact: {
      name: "Chad Stroud",
      title: "Founder",
      email: "playindirtjobs@welldiem.com",
      website: "www.playindirtjobs.com"
    },
    content: `
<p><strong>Atlanta, Georgia – October 24, 2025</strong> – PlayInDirtJobs, a platform dedicated to connecting workers with sustainable farming, gardening, and ranching careers, officially launched today to address the disconnect between people seeking agricultural work and operations looking for committed workers.</p>

<p>The platform connects job seekers with farming, gardening, and ranching opportunities across the United States, focusing on organic farms, regenerative agriculture operations, permaculture gardens, family ranches, and other sustainable operations that are the backbone of America's evolving food system.</p>

<p>"For generations, agriculture has been the backbone of America, yet a disconnect has grown between people seeking meaningful agricultural careers and the farms that need them," said <strong>Chad Stroud</strong>, founder of PlayInDirtJobs. "We created this platform to honor America's agricultural heritage while building bridges to its sustainable future. Whether you're a seasoned farm hand, or just getting your boots dirty for the first time, there's a role for you in agriculture and we're here to help you find it."</p>

<h2>Addressing a Critical Need</h2>

<p>While the agriculture industry faces ongoing labor challenges, PlayInDirtJobs recognizes the issue of finding high quality workers who aren't afraid to get their hands dirty. The platform features diverse opportunities including full-time farm positions, seasonal harvest work, agricultural apprenticeships, ranch hand roles, and specialized positions in greenhouse management, permaculture design, and organic certification.</p>

<h2>From Keyboards to Work Gloves</h2>

<p>PlayInDirtJobs recognizes a growing trend: professionals leaving desk jobs for the tangible satisfaction of agricultural work. Whether seeking a seasonal break from screen fatigue or pursuing a complete career change, workers are discovering that getting their hands dirty offers something office life cannot: physical engagement, immediate results, and the profound fulfillment that comes from nurturing life from the ground. The platform features opportunities for all commitment levels, from weekend farm work to full-time career transitions.</p>

<h2>More Than Just a Job Board</h2>

<p>Unlike general employment platforms, PlayInDirtJobs understands what makes agricultural work unique. Many listings include benefits specific to farm life: housing in rural settings, fresh organic meals, hands-on learning from experienced farmers, and the satisfaction of producing real food for real communities.</p>

<p>The platform serves job seekers free of charge, allowing them to browse positions, filter by farm type and location, and receive email alerts for new opportunities. For employers, posting is designed to be simple and affordable for farms of all sizes, with listings active for 60 days.</p>

<h2>Commitment to Quality and Authenticity</h2>

<p>PlayInDirtJobs may review or remove listings that appear fraudulent, misleading, or inconsistent with its posting terms. Employers remain responsible for the accuracy and legal compliance of their listings and hiring practices.</p>

<p>"When you're planting crops, managing livestock, or grafting cultivars of trees, you're participating in something essential and timeless," Stroud added. "We celebrate that work and the people who do it."</p>

<p>Job seekers can browse opportunities free at <a href="https://www.playindirtjobs.com" target="_blank" rel="noopener noreferrer">www.playindirtjobs.com</a>. Farms looking to hire can post positions in minutes.</p>

<h2>About PlayInDirtJobs</h2>

<p>PlayInDirtJobs is a nationwide job board for sustainable agriculture, connecting workers with farming, gardening, and ranching opportunities. The platform highlights organic farming, regenerative agriculture, permaculture, and sustainable ranching while honoring the historical prominence of agriculture in American life. For more information, visit <a href="https://www.playindirtjobs.com" target="_blank" rel="noopener noreferrer">www.playindirtjobs.com</a>.</p>
`
  }
];

// Helper function to get a press release by slug
export function getPressReleaseBySlug(slug: string): PressRelease | undefined {
  return pressReleases.find(pr => pr.slug === slug);
}

// Helper function to get the latest press release
export function getLatestPressRelease(): PressRelease | undefined {
  return pressReleases[0]; // Assumes array is sorted by date descending
}
