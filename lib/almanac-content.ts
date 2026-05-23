export interface AlmanacArticle {
  slug: string;
  title: string;
  category: "Getting Started" | "Industry Insights" | "Seasonal Guide" | "Career Advice";
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  date: string;
  author: string;
  readTime: number;
  featured: boolean;
  heroImage?: {
    src: string;
    alt: string;
    credit?: string;
    creditUrl?: string;
  };
  content: string;
  relatedSlugs?: string[];
}

export function formatAlmanacDate(
  date: string,
  options: Intl.DateTimeFormatOptions
) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", options);
}

export const almanacArticles: AlmanacArticle[] = [
  {
    slug: "farm-jobs-with-housing",
    title: "Farm Jobs With Housing: What to Know Before You Accept",
    category: "Career Advice",
    excerpt: "Live-in farm jobs can make agricultural work far more affordable, but the details matter. Learn how to evaluate housing, meals, transportation, and red flags before you say yes.",
    metaTitle: "Farm Jobs With Housing: What to Know Before You Accept | The Almanac",
    metaDescription: "A practical guide to farm jobs with housing. Learn what to ask before accepting live-in farm work, how to compare total compensation, and what safe housing should include.",
    date: "2026-05-23",
    author: "PlayInDirtJobs",
    readTime: 8,
    featured: false,
    heroImage: {
      src: "https://images.unsplash.com/photo-1653775174587-d95ea44ab4ef?w=1200&h=630&fit=crop",
      alt: "A small cabin surrounded by green farmland",
      credit: "Nadin Nandin",
      creditUrl: "https://unsplash.com/photos/an-aerial-view-of-a-farm-with-a-small-cabin-LmlvfY6UXCY",
    },
    relatedSlugs: [
      "how-much-do-farm-jobs-pay",
      "seasonal-farm-work-complete-guide-to-harvest-jobs",
    ],
    content: `
<p>A farm job with housing can change everything. Rent is often the biggest monthly expense for workers, and on-farm housing can make a modest hourly wage stretch much further. It can also make remote farm work possible when there are no apartments nearby, no public transit, and no easy commute.</p>

<p>But housing is not just a perk. It is where you sleep, cook, recover from long days, call your family, and keep your belongings. A good housing arrangement can make a season feel stable and generous. A vague one can turn into stress fast. Before you accept a farm job with housing, you need to understand the whole offer - not just the wage.</p>

<h2>Why Housing Changes the Whole Offer</h2>

<p>Farm pay should always be evaluated as total compensation. According to <a href="https://www.ers.usda.gov/topics/farm-economy/farm-labor/">USDA Economic Research Service farm labor data</a>, hired farmworker wages have risen over time, but average farm wages still trail average nonsupervisory nonfarm wages. That makes housing, meals, transportation, and utilities especially important when comparing offers.</p>

<p>A $16/hour job with free, clean housing and access to farm produce may leave you with more usable income than a $20/hour job where you pay market rent, utilities, gas, and groceries. The reverse can also be true: if "housing included" means a crowded room, unclear deductions, unreliable transportation, or no real kitchen, the offer may be less valuable than it looks.</p>

<p>Do the math before you decide. Estimate your monthly take-home pay, then subtract anything the employer charges for rent, utilities, meals, laundry, internet, transportation, or equipment. Add back the value of costs you will not have to pay yourself. The final number - not the hourly wage alone - is the number that tells you whether the job works.</p>

<h2>Get the Terms in Writing</h2>

<p>The best farm housing arrangements are clear before anyone packs a bag. Ask for the housing terms in writing, ideally in the offer letter, employment agreement, or a separate housing agreement. This protects both sides: you know what you are agreeing to, and the employer avoids misunderstandings during the busiest part of the season.</p>

<p>At minimum, clarify:</p>

<ul>
<li><strong>Cost.</strong> Is housing free, subsidized, or deducted from wages? If there is a deduction, how much is taken and when?</li>
<li><strong>Utilities.</strong> Are electricity, heat, water, trash, laundry, and internet included?</li>
<li><strong>Food.</strong> Are meals provided, is farm produce included, or are you expected to cook all meals yourself?</li>
<li><strong>Transportation.</strong> How do workers get from housing to the worksite, grocery store, medical care, and town?</li>
<li><strong>Dates.</strong> When can you move in, when must you move out, and what happens if the season ends early?</li>
<li><strong>Occupancy rules.</strong> Will you have a private room or shared room? Are guests, partners, pets, alcohol, smoking, or quiet hours addressed?</li>
<li><strong>Job separation.</strong> If you quit, are laid off, or are fired, how long do you have to leave the housing?</li>
</ul>

<p>If an employer says, "Do not worry, we will figure it out when you get here," slow down. Farms are busy, people forget details, and housing misunderstandings become much harder to solve once you are already living there.</p>

<h2>What Safe Farm Housing Should Include</h2>

<p>You do not need luxury housing. Many farm workers are perfectly happy in simple cabins, bunkhouses, campers, shared houses, yurts, or converted spaces when they are clean, dry, safe, and honestly described. The key is livability.</p>

<p>The <a href="https://www.dol.gov/agencies/whd/osha-housing-checklist">U.S. Department of Labor housing safety and health checklist</a> for agricultural worker housing is a useful reference even if your specific job is not covered by every federal standard. It points to practical basics: housing should protect workers from weather, avoid overcrowding, provide safe drinking water, include sanitary toilets and bathing facilities, offer a place to store and prepare food, and be kept free of garbage, pests, and obvious hazards.</p>

<p>Before accepting, ask for current photos or a video walkthrough. Look for the things that affect daily life:</p>

<ul>
<li><strong>A real sleeping space.</strong> You should know whether you have a private room, shared room, bunk, loft, tent platform, camper, or cabin.</li>
<li><strong>Weather protection.</strong> The space should stay dry in rain, ventilated in heat, and warm enough in cold weather.</li>
<li><strong>Safe water and bathrooms.</strong> Ask whether drinking water is tested or from a municipal source, and whether bathrooms are indoor, shared, or separate from the housing.</li>
<li><strong>Food storage and cooking.</strong> You need refrigeration, a way to cook, clean dishes, store dry goods, and keep pests out.</li>
<li><strong>Electrical safety.</strong> Extension cords, heaters, fans, and appliances should not be patched together in a way that feels risky.</li>
<li><strong>Fire safety.</strong> Ask about smoke detectors, exits, fire extinguishers, and where fuel or chemicals are stored.</li>
<li><strong>Privacy and storage.</strong> Even in shared housing, workers need somewhere secure for clothing, documents, medication, and personal items.</li>
</ul>

<p>Trust your instincts. Rustic can be charming. Unsafe is different.</p>

<h2>Meals, Kitchens, and Transportation</h2>

<p>Housing is only part of the live-in equation. A cabin without a kitchen, a bunkhouse miles from town, or a meal plan that does not fit the work schedule can quickly become expensive or exhausting.</p>

<p>If meals are included, ask how often, who cooks, whether meals are available on days off, and whether dietary needs can be accommodated. If meals are not included, ask what cooking equipment is available and how workers get groceries. For H-2A employers, the Department of Labor says employers must either provide three meals a day or provide free and convenient cooking and kitchen facilities that allow workers to prepare their own meals; the <a href="https://www.dol.gov/agencies/whd/fact-sheets/26d-meal-obligations-H-2A">DOL H-2A meal obligations fact sheet</a> gives the details for those covered jobs.</p>

<p>Transportation matters just as much. Living on a farm can be wonderful, but rural isolation is real. Ask whether you need your own car, whether workers share vehicles, how far the grocery store is, and what happens if someone needs urgent medical care. If work happens at multiple fields, barns, markets, or packing sheds, clarify whether transportation during the workday is paid time and provided by the employer.</p>

<p>Also ask about heat recovery. Farm housing should support rest after hard outdoor work, especially in summer. OSHA's <a href="https://www.osha.gov/heat-exposure/water-rest-shade">Water. Rest. Shade.</a> guidance emphasizes access to water, rest, and cool recovery areas during heat exposure. That same logic applies after work: if workers are sleeping in a hot room with no ventilation after a ten-hour harvest day, recovery becomes a safety issue, not a comfort complaint.</p>

<h2>Special Note on H-2A Jobs</h2>

<p>Some agricultural jobs are part of the H-2A temporary agricultural worker program. If a worker cannot reasonably return to their permanent home the same day, H-2A rules include specific protections around no-cost housing, daily transportation between housing and the worksite, wages, meals or kitchen facilities, and other conditions. The <a href="https://www.dol.gov/agencies/whd/workers/h2a">Department of Labor's H-2A worker page</a> is the best starting point for current federal information.</p>

<p>Other migrant and seasonal agricultural workers may also have rights under the Migrant and Seasonal Agricultural Worker Protection Act. The <a href="https://www.dol.gov/agencies/whd/fact-sheets/49-mspa">DOL MSPA fact sheet</a> explains that MSPA addresses wages, housing, transportation, disclosures, and recordkeeping, and that housing terms must be posted or given to workers when covered housing is provided.</p>

<p>This article is practical career guidance, not legal advice. Rules vary by worker program, state, employer type, and housing arrangement. If something feels unsafe or unlawful, contact the U.S. Department of Labor Wage and Hour Division, your state labor agency, a legal aid organization, or a trusted farmworker support group.</p>

<h2>Red Flags Before You Accept</h2>

<p>Most farms that offer housing are trying to solve a real problem: their work is rural, seasonal, and hard to commute to. Many provide thoughtful, generous living arrangements. Still, be cautious when you see any of these warning signs:</p>

<ul>
<li><strong>No photos or walkthrough.</strong> If housing exists, the employer should be able to show it.</li>
<li><strong>Unclear deductions.</strong> You should know exactly what will come out of your paycheck.</li>
<li><strong>No written terms.</strong> Verbal promises are hard to rely on once the season is underway.</li>
<li><strong>Unsafe water, heat, or electricity.</strong> These are basics, not perks.</li>
<li><strong>Overcrowding.</strong> Ask how many people share the room, bathroom, kitchen, and laundry.</li>
<li><strong>No transportation plan.</strong> If the farm is remote, "someone can probably drive you" is not enough.</li>
<li><strong>Pressure to decide immediately.</strong> A good employer should welcome practical questions.</li>
<li><strong>No move-out plan.</strong> You need to know what happens if the job ends early or the arrangement is not a fit.</li>
</ul>

<p>One red flag does not always mean you should walk away. It does mean you should ask follow-up questions before you commit.</p>

<h2>Questions to Ask the Employer</h2>

<p>Use these questions before accepting a live-in farm job:</p>

<ul>
<li>Can you send current photos or a video walkthrough of the housing?</li>
<li>Is the room private or shared, and how many people live in the house or bunkhouse?</li>
<li>Is housing free, or are rent, utilities, meals, or deposits deducted from wages?</li>
<li>What kitchen, refrigeration, laundry, bathroom, and shower facilities are available?</li>
<li>Is drinking water from a tested well, municipal supply, or another source?</li>
<li>How do workers get groceries, medical care, and transportation to worksites?</li>
<li>What are the rules for guests, pets, quiet hours, shared chores, and personal storage?</li>
<li>What happens to housing if the job ends early, weather delays work, or either side decides it is not a fit?</li>
</ul>

<h2>The Bottom Line</h2>

<p>A farm job with housing can be a great opportunity. It can lower your cost of living, help you build savings, and make remote agricultural work accessible. But the best offers are specific. They tell you where you will sleep, what you will pay, how you will eat, how you will get around, and what rights and responsibilities come with the arrangement.</p>

<p>Before you accept, compare the full package. Read our guide to <a href="/almanac/how-much-do-farm-jobs-pay">farm job pay and total compensation</a>, then browse current <a href="/">farm, garden, and ranch jobs on PlayInDirtJobs</a> with a sharper eye for the housing details that matter.</p>
`,
  },
  {
    slug: "how-much-do-farm-jobs-pay",
    title: "How Much Do Farm Jobs Pay? A Realistic Guide to Agricultural Salaries",
    category: "Career Advice",
    excerpt: "From entry-level farm hand to farm manager, here's what agricultural workers actually earn — plus the hidden compensation most salary sites miss.",
    metaTitle: "How Much Do Farm Jobs Pay? Agricultural Salary Guide | The Almanac",
    metaDescription: "A realistic guide to agricultural salaries in America. Learn what farm hands, farm managers, ranch workers, and other agricultural roles earn — plus what affects your pay.",
    date: "2026-03-28",
    author: "PlayInDirtJobs",
    readTime: 9,
    featured: false,
    heroImage: {
      src: "https://images.unsplash.com/photo-1774533522525-fb00871e97be?w=1200&h=630&fit=crop",
      alt: "A paved road runs alongside a black wooden fence through green farmland",
      credit: "Cristina Anne Costello",
      creditUrl: "https://unsplash.com/@lightupphotos",
    },
    relatedSlugs: [
      "how-to-get-a-farm-job-with-no-experience",
      "seasonal-farm-work-complete-guide-to-harvest-jobs",
    ],
    content: `
<p>It's the question everyone asks before making the leap into agriculture: can you actually make a living doing this? The honest answer is yes — but it looks different than most office careers. Farm pay involves more than just an hourly wage, and understanding the full picture is the key to making a smart decision about your future.</p>

<h2>The Big Picture: Average Farm Worker Pay in America</h2>

<p>According to the Bureau of Labor Statistics, the median wage for agricultural workers in the United States is approximately $15.89 per hour, or roughly $33,000 per year for full-time work. That number varies widely by role, region, and farm type — but it's the baseline.</p>

<p>How does that compare to other hands-on careers? Construction laborers earn a median of about $18.50/hour. Landscaping workers earn around $16.50/hour. Warehouse workers earn about $17/hour. Farm work sits in a similar range — but here's the critical difference: many farm positions include housing, meals, or other benefits that dramatically change the math. More on that below.</p>

<p>It's also worth noting that agriculture pay has been rising steadily. Farm wages have increased roughly 15-20% over the past five years as labor shortages push employers to compete for workers. If you've been researching farm pay using outdated data, the real numbers are likely higher than what you've seen.</p>

<h2>Pay by Role: What Different Farm Jobs Earn</h2>

<p>Not all farm jobs pay the same. Here's a realistic breakdown of what you can expect across the most common agricultural positions:</p>

<ul>
<li><strong>General farm hand / laborer ($13–$18/hour)</strong> — The most common entry point. You'll do a bit of everything: planting, weeding, harvesting, feeding animals, maintaining equipment. Pay varies by region and farm size, with organic and direct-market farms often paying at the higher end.</li>
<li><strong>Harvest crew / piece-rate worker ($14–$22/hour)</strong> — Seasonal positions where pay often depends on output. Fast, experienced pickers can earn significantly more than hourly workers during peak harvest. Some fruit harvest crews report earning $150–$200+ per day.</li>
<li><strong>Greenhouse and nursery worker ($14–$19/hour)</strong> — More consistent year-round work with less weather exposure. Specialized knowledge in propagation or pest management pushes pay higher.</li>
<li><strong>Farm equipment operator ($16–$22/hour)</strong> — If you can drive a tractor, operate a combine, or run irrigation systems, you're in demand. Operators with CDL licenses or precision agriculture technology skills earn at the top of this range.</li>
<li><strong>Livestock and ranch hand ($14–$20/hour)</strong> — Daily animal care, fence maintenance, pasture management, and calving or lambing assistance. Ranch positions in the West often include housing as part of the compensation package.</li>
<li><strong>Crew lead / farm foreman ($35,000–$55,000/year)</strong> — The first step into management. You'll coordinate daily work, train new employees, and serve as the bridge between the farm owner and the crew.</li>
<li><strong>Farm manager / assistant manager ($40,000–$65,000+/year)</strong> — Responsible for planning, budgeting, and overseeing operations. Experienced managers at larger operations can earn $70,000–$90,000 or more, especially when bonuses or profit-sharing are included.</li>
<li><strong>Specialty roles ($15–$25+/hour)</strong> — Beekeepers, irrigation technicians, soil scientists, farm-to-table coordinators, and agricultural educators often command premium pay because of specialized knowledge.</li>
</ul>

<h2>What Affects Your Pay</h2>

<p>Two farm hands doing similar work can earn very different wages depending on several factors:</p>

<ul>
<li><strong>Region and cost of living.</strong> A farm hand in California's Central Valley typically earns more per hour than one in rural Arkansas — but housing costs tell a different story. Always compare wages against local living costs, not just the national average.</li>
<li><strong>Farm type and size.</strong> Larger commercial operations tend to offer higher base wages and benefits. Smaller organic or sustainable farms may pay slightly less in cash but often provide housing, meals, and a more hands-on learning experience.</li>
<li><strong>Organic vs. conventional.</strong> Organic and regenerative farms frequently pay a premium because the work is more labor-intensive (less reliance on chemical inputs means more hand weeding, manual pest management, and careful crop rotation).</li>
<li><strong>Seasonality and overtime.</strong> During planting and harvest seasons, overtime hours are common — and they add up fast. Some seasonal workers earn the bulk of their annual income in a concentrated 3–4 month period.</li>
<li><strong>Experience and certifications.</strong> A pesticide applicator license, CDL, organic certification knowledge, or irrigation system expertise can bump your pay by $2–$5 per hour or more.</li>
<li><strong>Whether housing is included.</strong> This is the single biggest variable. A job paying $14/hour with free housing can be worth more than one paying $19/hour where you're covering $1,200/month in rent.</li>
</ul>

<h2>The Hidden Value: Compensation Beyond Your Paycheck</h2>

<p>This is where farm compensation gets genuinely interesting — and where most salary comparison websites get it completely wrong. They only look at the cash wage. In agriculture, non-cash benefits can add thousands of dollars to your effective compensation.</p>

<ul>
<li><strong>On-farm housing ($500–$1,500/month value).</strong> Many farms — especially ranches and live-in apprenticeship programs — provide housing at no cost or heavily subsidized. This alone can be worth $6,000–$18,000 per year.</li>
<li><strong>Meals and produce ($100–$400/month value).</strong> Farm kitchens, community meals, and access to fresh produce are common perks. When you're eating food you helped grow, your grocery bill drops dramatically.</li>
<li><strong>Education and mentorship.</strong> Apprenticeship programs and training-focused farms are investing in your future earning potential. The knowledge you gain — soil science, crop planning, animal husbandry, business management — has real career value.</li>
<li><strong>Land access.</strong> Some farms offer workers a plot for personal growing, which can supplement your income through farmers market sales or simply eliminate your produce budget.</li>
<li><strong>Health insurance and retirement.</strong> Larger operations and farm cooperatives increasingly offer health benefits, especially for year-round employees.</li>
</ul>

<p>Here's the real math example: A farm hand earning $15/hour with free housing and meals might net more disposable income than an urban worker earning $22/hour who pays $1,800/month for a shared apartment and $400/month on food. Before you compare salaries, compare lifestyles.</p>

<h2>How Pay Grows Over Time: The Farm Career Ladder</h2>

<p>Agriculture rewards loyalty and skill development. Here's a realistic trajectory for someone starting from scratch:</p>

<ul>
<li><strong>Year 1: Entry-level farm hand ($13–$16/hour).</strong> You're learning the basics — how to use tools, read the soil, work with animals, and keep pace with experienced workers. Focus on absorbing everything you can.</li>
<li><strong>Years 2–3: Experienced worker ($16–$20/hour).</strong> You can work independently, operate equipment, and handle specialized tasks. You're now training newer workers and taking on more responsibility.</li>
<li><strong>Years 3–5: Crew lead / foreman ($35,000–$55,000/year).</strong> You're managing a team, coordinating daily operations, and making decisions. This is a significant jump in both responsibility and pay.</li>
<li><strong>Years 5+: Farm manager ($50,000–$75,000+/year).</strong> You're running an operation — budgets, crop planning, equipment purchasing, staff management, and marketing. Top farm managers at large operations earn six figures.</li>
</ul>

<p>Specialization accelerates this timeline. Workers who pursue certifications in organic production, precision agriculture technology, or livestock management can jump to higher-paying roles faster. And for those with entrepreneurial ambitions, the skills you build working on other people's farms are exactly what you need to eventually start your own operation.</p>

<h2>Seasonal vs. Year-Round: How Employment Type Affects Earnings</h2>

<p>Your annual income depends heavily on whether you work seasonally or year-round:</p>

<ul>
<li><strong>Year-round positions</strong> provide stability and typically include benefits. You'll earn a consistent paycheck, but the work varies dramatically by season — from intense planting and harvest periods to slower winter maintenance work.</li>
<li><strong>Seasonal workers</strong> may earn higher hourly wages during peak periods but face gaps between seasons. Some experienced seasonal workers "follow the harvest," moving between regions to work nearly year-round: citrus in Florida during winter, berries in the Pacific Northwest in summer, apples in the Northeast in fall.</li>
<li><strong>Combining seasonal farm work with off-season employment</strong> is a common and practical strategy. Many seasonal farm workers take on greenhouse work, food processing, landscaping, or snow removal jobs during the off-season.</li>
</ul>

<p>For a first-time farm worker, a seasonal position is often the best way to test the waters without a long-term commitment. If you love the work, transitioning to a year-round role is a natural next step.</p>

<h2>Negotiating Your Farm Pay</h2>

<p>Yes, you can negotiate in agriculture — especially when labor is in short supply. Here's how to approach it:</p>

<ul>
<li><strong>Wait for the offer.</strong> Don't bring up pay during the application or interview. Let the employer make the first number, then respond thoughtfully.</li>
<li><strong>Know the local market.</strong> Research what similar positions pay in your area. Being able to say "I've seen similar roles in the region offering $17–$19/hour" gives you credibility.</li>
<li><strong>Negotiate the whole package, not just the wage.</strong> Sometimes employers can't budge on hourly pay but can offer better housing, more days off, educational opportunities, or a produce allowance. These non-wage benefits are often more flexible.</li>
<li><strong>Highlight your relevant skills.</strong> Mechanical ability, CDL license, bilingual communication, or previous agricultural experience all justify higher pay. Make sure the employer knows what you bring beyond basic labor.</li>
<li><strong>Be respectful and realistic.</strong> Small family farms operate on thin margins. Understand the business context and frame your ask as a partnership, not a demand.</li>
</ul>

<h2>The Bottom Line</h2>

<p>Farming won't make you rich in the traditional sense. But the combination of fair wages, low or zero housing costs, fresh food access, meaningful outdoor work, and genuine community creates a quality of life that many higher-paying careers can't match.</p>

<p>The key is to look beyond the hourly number. When you factor in total compensation — housing, meals, learning opportunities, and lifestyle benefits — agricultural careers are often more financially viable than they appear at first glance. And with farm wages rising and labor demand growing, there's never been a better time to get started.</p>

<p>Ready to see what's out there? <a href="/">Browse farm, garden, and ranch jobs on PlayInDirtJobs</a> and compare real opportunities with real pay information.</p>
`,
  },
  {
    slug: "how-to-get-a-farm-job-with-no-experience",
    title: "How to Get a Farm Job With No Experience",
    category: "Getting Started",
    excerpt: "Breaking into agriculture without a background in farming is more achievable than you think. Here's a practical roadmap for landing your first farm job.",
    metaTitle: "How to Get a Farm Job With No Experience | The Almanac",
    metaDescription: "Learn how to land your first farm job with no prior experience. Practical tips on building skills, finding entry-level positions, and making a strong impression on farm employers.",
    date: "2026-03-01",
    author: "PlayInDirtJobs",
    readTime: 8,
    featured: true,
    heroImage: {
      src: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&h=630&fit=crop",
      alt: "Person working in a green farm field at sunrise",
      credit: "Todd Quackenbush",
      creditUrl: "https://unsplash.com/@toddquackenbush",
    },
    relatedSlugs: [
      "what-to-expect-your-first-week-on-a-farm",
      "farm-apprenticeship-programs",
    ],
    content: `
<p>Every farmer started somewhere — and most didn't grow up on a farm. Whether you're leaving a desk job, fresh out of school, or simply ready for a career that gets your hands in the soil, the agriculture industry needs you. Here's how to make it happen.</p>

<h2>Why Farms Hire People Without Experience</h2>

<p>The agriculture industry faces a persistent labor shortage. According to the USDA, the farm labor workforce has been declining for decades, and many operations struggle to fill positions — especially smaller organic and sustainable farms that rely on hand labor rather than heavy machinery.</p>

<p>This means farmers are often willing to train the right person. What matters most isn't a farming resume — it's your attitude, physical readiness, and willingness to learn.</p>

<h2>Skills That Transfer to Farm Work</h2>

<p>You probably already have more relevant skills than you realize:</p>

<ul>
<li><strong>Physical fitness and endurance</strong> — Farm work is demanding but rewarding. If you exercise regularly or have worked labor-intensive jobs, you're ahead of the curve.</li>
<li><strong>Problem-solving</strong> — Things break, weather changes, and plants don't read textbooks. Adaptability is gold on a farm.</li>
<li><strong>Reliability</strong> — Showing up on time, every time, matters more than any certification. Animals need feeding, crops need watering — rain or shine.</li>
<li><strong>Basic mechanical aptitude</strong> — Can you use hand tools? Follow assembly instructions? You'll pick up farm equipment faster than you think.</li>
<li><strong>Cooking and food handling</strong> — Many farms provide meals or have community kitchens. Kitchen skills are a genuine asset.</li>
</ul>

<h2>Where to Look for Entry-Level Farm Jobs</h2>

<p>The best entry-level farm positions for beginners include:</p>

<ul>
<li><strong>Farm hand / general laborer</strong> — The most common entry point. You'll learn a bit of everything: planting, weeding, harvesting, feeding animals, and maintaining equipment.</li>
<li><strong>Harvest crew member</strong> — Seasonal positions with clear start and end dates. Great for testing the waters without a long-term commitment.</li>
<li><strong>Farm apprenticeship</strong> — Structured learning programs where you work in exchange for training, housing, and sometimes a stipend. These are specifically designed for people with no experience.</li>
<li><strong>Greenhouse or nursery assistant</strong> — Less physically intense than field work but still hands-on. Good for learning plant care fundamentals.</li>
<li><strong>WWOOFing (World Wide Opportunities on Organic Farms)</strong> — Volunteer on organic farms worldwide in exchange for room and board. Not a paid position, but an excellent way to build experience quickly.</li>
</ul>

<h2>How to Stand Out When Applying</h2>

<p>When you don't have farm experience, your application needs to communicate something else: genuine motivation and practical readiness.</p>

<ol>
<li><strong>Write a real cover letter.</strong> Explain why you want to farm, not just that you need a job. Farmers invest time training new people and want to know you'll stick around.</li>
<li><strong>Mention relevant physical activity.</strong> Hiking, sports, manual labor jobs, gardening — anything that shows you can handle the physical demands.</li>
<li><strong>Be specific about what you want to learn.</strong> "I'm interested in sustainable agriculture" is fine. "I want to learn about cover cropping and soil health on an organic vegetable farm" is much better.</li>
<li><strong>Offer flexibility.</strong> Can you start soon? Willing to work weekends during harvest? Open to living on-site? These things matter enormously to farmers.</li>
<li><strong>Start a garden.</strong> Even a few containers on a balcony show initiative. Mention it in your application — it demonstrates genuine interest, not just job-seeking.</li>
</ol>

<h2>Preparing for Your First Farm Job</h2>

<p>Before your first day, invest in a few practical preparations:</p>

<ul>
<li><strong>Gear up.</strong> Sturdy boots (waterproof if possible), work gloves, sun hat, and layers for changing weather. You don't need expensive gear — just functional.</li>
<li><strong>Build your stamina.</strong> If you're not used to physical labor, start walking, stretching, and doing bodyweight exercises a few weeks before your start date.</li>
<li><strong>Learn the basics.</strong> Watch YouTube videos on the type of farming you'll be doing. Read about the crops or animals on the farm. Showing up with basic knowledge impresses employers.</li>
<li><strong>Ask questions in advance.</strong> What should you bring? What's the daily schedule? Is housing provided? Good communication before day one sets the tone for a great working relationship.</li>
</ul>

<h2>The Bottom Line</h2>

<p>Agriculture is one of the few industries where passion and work ethic can outweigh formal credentials. Farms need people who show up ready to work and eager to learn. If that's you, your lack of experience is a smaller barrier than you think.</p>

<p>Start browsing entry-level farm positions on <a href="/">PlayInDirtJobs</a> and take the first step toward a career that's as rewarding as it is real.</p>
`,
  },
  {
    slug: "seasonal-farm-work-complete-guide-to-harvest-jobs",
    title: "Seasonal Farm Work: A Complete Guide to Harvest Jobs",
    category: "Seasonal Guide",
    excerpt: "Harvest season means thousands of temporary farm jobs across America. Learn when, where, and how to find the best seasonal agricultural positions.",
    metaTitle: "Seasonal Farm Work: Complete Guide to Harvest Jobs | The Almanac",
    metaDescription: "Everything you need to know about seasonal farm work and harvest jobs in America. Timing, pay, what to expect, and how to find the best seasonal agricultural positions.",
    date: "2026-02-20",
    author: "PlayInDirtJobs",
    readTime: 10,
    featured: false,
    heroImage: {
      src: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=630&fit=crop",
      alt: "Workers harvesting crops in golden afternoon light",
      credit: "Tim Mossholder",
      creditUrl: "https://unsplash.com/@timmossholder",
    },
    relatedSlugs: [
      "how-to-get-a-farm-job-with-no-experience",
      "what-to-expect-your-first-week-on-a-farm",
    ],
    content: `
<p>Every year, America's farms need thousands of temporary workers to plant, tend, and harvest crops. Seasonal farm work offers a unique opportunity: earn good money, experience life on a working farm, and explore different parts of the country — all without a permanent commitment.</p>

<h2>When Is Harvest Season?</h2>

<p>There's no single harvest season in America. Different crops ripen at different times, and the country's diverse climate zones mean something is always being harvested somewhere:</p>

<ul>
<li><strong>Spring (March–May):</strong> Strawberries in California and Florida, asparagus in Washington and Michigan, early vegetables in the Southeast. This is also prime planting season for summer crops.</li>
<li><strong>Summer (June–August):</strong> Blueberries across the Northeast and Pacific Northwest, stone fruits (peaches, cherries, plums) in California, Georgia, and Michigan, and sweet corn throughout the Midwest.</li>
<li><strong>Fall (September–November):</strong> The big one. Apple orchards in Washington, New York, and Michigan. Grape harvest in California wine country. Pumpkins, squash, and root vegetables nationwide. Cranberry bogs in Wisconsin and Massachusetts.</li>
<li><strong>Winter (December–February):</strong> Citrus in Florida, California, and Texas. Winter vegetables in the South. Greenhouse operations year-round in northern states.</li>
</ul>

<h2>Types of Seasonal Farm Jobs</h2>

<p>Seasonal positions vary widely depending on the farm and crop:</p>

<ul>
<li><strong>Harvest crew:</strong> The most common seasonal role. Picking, cutting, sorting, and packing crops. Physical and fast-paced, often paid by piece rate (per bin or pound harvested).</li>
<li><strong>Planting crew:</strong> Transplanting seedlings, direct sowing, and preparing beds. Typically spring work on vegetable and flower farms.</li>
<li><strong>CSA (Community Supported Agriculture) helper:</strong> Washing, bunching, and packing produce for weekly farm share boxes. Often includes field work too.</li>
<li><strong>Farmers market assistant:</strong> Setting up booths, selling produce, and interacting with customers. A good option if you enjoy people as much as plants.</li>
<li><strong>Vineyard/orchard worker:</strong> Pruning, thinning, harvesting, and sorting. Wine grape harvest ("crush") is particularly well-known as a seasonal opportunity.</li>
</ul>

<h2>What to Expect: Pay, Housing, and Hours</h2>

<p><strong>Pay</strong> varies significantly by region, crop, and arrangement. Hourly wages typically range from $13–$20/hour, though piece-rate workers on high-value crops can earn considerably more. Some farms offer overtime during peak harvest.</p>

<p><strong>Housing</strong> is frequently included, especially for positions in rural areas. This can range from shared bunkhouses to private cabins. Some farms also provide meals or access to farm produce. When housing is included, it significantly boosts your effective earnings.</p>

<p><strong>Hours</strong> are long during peak season — expect 8–10 hour days, often starting at dawn. Weekends may be required during critical harvest windows. The upside: the work is seasonal, so the intensity is temporary.</p>

<h2>How to Find Seasonal Farm Work</h2>

<ol>
<li><strong>Start early.</strong> The best positions fill 2–3 months before the season begins. If you want a fall apple harvest job, start looking in June or July.</li>
<li><strong>Use specialized job boards.</strong> General job sites bury farm positions. <a href="/">PlayInDirtJobs</a> focuses exclusively on agricultural work, including seasonal positions.</li>
<li><strong>Contact farms directly.</strong> Many smaller farms don't post online. Look up farms in areas you're interested in, check their websites, and send a brief email introducing yourself.</li>
<li><strong>Consider WWOOF or farm stays.</strong> If you want to try farm work before committing to a paid season, volunteer programs let you experience farm life with minimal risk.</li>
<li><strong>Network at farmers markets.</strong> Talk to farmers at your local market. They know who's hiring and can connect you with opportunities.</li>
</ol>

<h2>Making the Most of Seasonal Work</h2>

<p>Seasonal farm work can be a one-time experience or the start of something bigger. Many full-time farm managers and farm owners started with a single season. Here's how to maximize the opportunity:</p>

<ul>
<li><strong>Ask questions constantly.</strong> You're getting paid to learn one of humanity's oldest skills. Take advantage of it.</li>
<li><strong>Be the reliable one.</strong> Show up early, stay positive, and finish what you start. Farmers remember this — and they'll invite you back or recommend you to others.</li>
<li><strong>Document your experience.</strong> Take notes on what you learn. Future farm employers will appreciate specific knowledge about crops, techniques, and equipment.</li>
<li><strong>Build relationships.</strong> The agricultural community is tightly connected. One good season can open doors to opportunities across the country.</li>
</ul>

<h2>Is Seasonal Farm Work Right for You?</h2>

<p>Seasonal farm work isn't for everyone — it's physically demanding, the hours are long, and the conditions can be challenging. But for the right person, it offers something rare: meaningful work outdoors, tangible results you can see and taste, and a deep connection to the land and food system.</p>

<p>If you're curious, there's only one way to find out. Browse <a href="/">seasonal positions on PlayInDirtJobs</a> and start your agricultural adventure.</p>
`,
  },
  {
    slug: "farm-apprenticeship-programs",
    title: "Farm Apprenticeship Programs: What to Know Before You Apply",
    category: "Career Advice",
    excerpt: "Farm apprenticeships offer structured training, mentorship, and hands-on experience. Here's how they work and how to find the right program for you.",
    metaTitle: "Farm Apprenticeship Programs: What to Know Before You Apply | The Almanac",
    metaDescription: "A comprehensive guide to farm apprenticeship programs in America. Learn what to expect, how to find programs, what questions to ask, and how to choose the right apprenticeship.",
    date: "2026-02-15",
    author: "PlayInDirtJobs",
    readTime: 9,
    featured: false,
    heroImage: {
      src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=630&fit=crop",
      alt: "Mentor teaching apprentice in a vegetable garden",
      credit: "Markus Spiske",
      creditUrl: "https://unsplash.com/@markusspiske",
    },
    relatedSlugs: [
      "how-to-get-a-farm-job-with-no-experience",
      "organic-vs-regenerative-farming",
    ],
    content: `
<p>If you want to learn farming but don't know where to start, a farm apprenticeship might be your best path. These structured programs pair you with experienced farmers who teach you the trade while you contribute meaningful labor. It's the oldest form of agricultural education — and it still works.</p>

<h2>What Is a Farm Apprenticeship?</h2>

<p>A farm apprenticeship is a training arrangement where you work on a farm in exchange for education, mentorship, and typically some combination of housing, meals, and a stipend. Unlike casual farm volunteering, apprenticeships follow a structured curriculum designed to build specific skills over a defined period — usually 3 to 12 months.</p>

<p>The best programs are intentional about teaching. You won't just weed rows and wash carrots (though you'll do plenty of that). You'll learn crop planning, soil management, pest identification, equipment operation, and the business side of farming.</p>

<h2>What Apprenticeships Typically Include</h2>

<ul>
<li><strong>Hands-on training:</strong> Daily farm work under experienced supervision. This is the core of any apprenticeship — learning by doing.</li>
<li><strong>Structured education:</strong> Workshops, reading assignments, farm tours, or classroom sessions on topics like soil science, crop rotation, and sustainable practices.</li>
<li><strong>Housing:</strong> Most apprenticeships provide on-farm housing. This ranges from shared apartments to private cabins to tent platforms, depending on the farm.</li>
<li><strong>Meals:</strong> Many farms provide meals or share produce. Some offer full meal plans; others give you access to farm products for cooking.</li>
<li><strong>Stipend:</strong> Compensation varies widely. Some programs pay $200–$800/month; others pay closer to minimum wage. A few offer no cash stipend but provide room, board, and extensive education.</li>
</ul>

<h2>Types of Farm Apprenticeships</h2>

<p>Apprenticeships vary by farm type, focus area, and structure:</p>

<ul>
<li><strong>Vegetable farming:</strong> The most common type. Learn to grow diverse crops from seed to harvest. Covers bed preparation, succession planting, pest management, and post-harvest handling.</li>
<li><strong>Livestock and dairy:</strong> Work with cattle, goats, sheep, pigs, or poultry. Learn animal husbandry, rotational grazing, milking, and processing.</li>
<li><strong>Permaculture design:</strong> Focus on whole-system farm design, food forests, water management, and integrated growing systems.</li>
<li><strong>Market farming:</strong> Emphasis on the business side — learning to grow, harvest, price, and sell produce profitably at farmers markets and to restaurants.</li>
<li><strong>Specialty crops:</strong> Mushrooms, herbs, cut flowers, hops, or other niche products. Great for learning a specific trade within agriculture.</li>
</ul>

<h2>How to Find the Right Program</h2>

<ol>
<li><strong>Define what you want to learn.</strong> Are you interested in vegetables, animals, or a specific farming philosophy? Narrowing your focus helps you find a better fit.</li>
<li><strong>Research the farm's reputation.</strong> Look for reviews from past apprentices. Ask the farm for references. A good apprenticeship invests in teaching — not just getting cheap labor.</li>
<li><strong>Ask specific questions.</strong> How many hours per week is the work commitment? What's the educational curriculum? How many apprentices are on the farm? What's the mentor-to-apprentice ratio?</li>
<li><strong>Visit if possible.</strong> Spending a day on the farm before committing gives you a realistic sense of the culture, workload, and living conditions.</li>
<li><strong>Check the timeline.</strong> Most apprenticeships have application deadlines months in advance. Spring/summer programs often accept applications in winter.</li>
</ol>

<h2>Red Flags to Watch For</h2>

<p>Not all apprenticeships are created equal. Watch out for:</p>

<ul>
<li><strong>No structured curriculum.</strong> If the farm can't tell you what you'll learn, you might just be providing free labor.</li>
<li><strong>Excessive hours with no education.</strong> Working 50+ hours/week with no time for learning or reflection defeats the purpose.</li>
<li><strong>Vague compensation.</strong> Get the details in writing. What exactly is provided — housing, food, stipend? Under what conditions?</li>
<li><strong>Isolation without support.</strong> Some farms are very remote. Make sure there's a plan for emergencies, transportation, and social connection.</li>
</ul>

<h2>Making the Most of Your Apprenticeship</h2>

<p>An apprenticeship is what you make of it. The apprentices who get the most out of the experience are the ones who ask questions, take initiative, and stay curious even when the work gets repetitive.</p>

<p>Keep a farm journal. Document what you plant, when you plant it, and what happens. This record will be invaluable when you start your own farm or apply for your next position.</p>

<p>Ready to explore apprenticeship opportunities? Browse <a href="/farm-apprenticeships">farm apprenticeships on PlayInDirtJobs</a>.</p>
`,
  },
  {
    slug: "organic-vs-regenerative-farming",
    title: "Organic vs Regenerative Farming: Understanding the Difference",
    category: "Industry Insights",
    excerpt: "Both organic and regenerative farming prioritize sustainability, but they take fundamentally different approaches. Here's what sets them apart — and what it means for farm workers.",
    metaTitle: "Organic vs Regenerative Farming: What's the Difference? | The Almanac",
    metaDescription: "Understand the key differences between organic and regenerative farming. Learn how each approach works, their certifications, and what these distinctions mean for agricultural careers.",
    date: "2026-02-10",
    author: "PlayInDirtJobs",
    readTime: 7,
    featured: false,
    heroImage: {
      src: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=630&fit=crop",
      alt: "Healthy soil with cover crops growing in rows",
      credit: "Dylan de Jonge",
      creditUrl: "https://unsplash.com/@dylandejonge",
    },
    relatedSlugs: [
      "farm-apprenticeship-programs",
      "how-to-get-a-farm-job-with-no-experience",
    ],
    content: `
<p>If you're entering the agricultural workforce — or just trying to understand what modern farming looks like — you'll encounter two terms constantly: organic and regenerative. Both represent a commitment to farming that's better for the planet, but they approach that goal differently.</p>

<h2>What Is Organic Farming?</h2>

<p>Organic farming is defined by what it avoids. Certified organic farms cannot use synthetic pesticides, herbicides, fertilizers, or genetically modified organisms (GMOs). They follow strict standards set by the USDA National Organic Program (NOP), and they must pass annual inspections to maintain their certification.</p>

<p>Key principles of organic farming:</p>

<ul>
<li><strong>No synthetic chemicals.</strong> Pest and disease management relies on biological controls, crop rotation, and approved organic inputs.</li>
<li><strong>No GMOs.</strong> Seeds, feed, and inputs must be non-genetically modified.</li>
<li><strong>Soil health through inputs.</strong> Compost, cover crops, and approved amendments build fertility.</li>
<li><strong>Certification required.</strong> The USDA Organic label is legally regulated. Farms must complete a three-year transition period and pass annual audits.</li>
</ul>

<h2>What Is Regenerative Farming?</h2>

<p>Regenerative farming is defined by what it builds. Rather than simply avoiding harm, regenerative agriculture actively improves the land — rebuilding soil organic matter, increasing biodiversity, improving water cycles, and sequestering carbon.</p>

<p>Key principles of regenerative farming:</p>

<ul>
<li><strong>Soil health is everything.</strong> Practices like no-till, cover cropping, composting, and diverse rotations are designed to build living soil ecosystems.</li>
<li><strong>Minimize soil disturbance.</strong> Reduced or no tillage protects soil structure, mycorrhizal networks, and microbial communities.</li>
<li><strong>Maximize biodiversity.</strong> Polycultures, hedgerows, and integrated livestock increase ecosystem resilience.</li>
<li><strong>Holistic management.</strong> The farm is viewed as a complete system — soil, plants, animals, water, and people are all interconnected.</li>
<li><strong>Certification is emerging.</strong> Programs like the Regenerative Organic Certified (ROC) label are gaining traction but aren't yet as established as USDA Organic.</li>
</ul>

<h2>Key Differences</h2>

<p><strong>Approach:</strong> Organic is primarily about restriction — what you can't use. Regenerative is primarily about restoration — what you're building. A farm can be organic without being regenerative (using approved inputs without improving soil health), and a farm can practice regenerative methods without organic certification.</p>

<p><strong>Certification:</strong> USDA Organic is well-established with clear legal standards. Regenerative certifications exist (ROC, Savory Institute verification) but are newer and less standardized.</p>

<p><strong>Soil focus:</strong> While organic farming encourages soil health, regenerative farming makes it the central operating principle. Regenerative practitioners measure success by soil carbon levels, water infiltration rates, and biological diversity in the soil.</p>

<p><strong>Animals:</strong> Regenerative agriculture often integrates livestock as a tool for soil improvement through managed grazing. Organic farming has livestock standards but doesn't inherently require animal integration.</p>

<h2>What This Means for Farm Workers</h2>

<p>As a job seeker, understanding these distinctions helps you find work aligned with your values and interests:</p>

<ul>
<li><strong>Organic farms</strong> tend to be well-established with documented systems. You'll learn standardized practices and gain experience that's recognized industry-wide.</li>
<li><strong>Regenerative farms</strong> are often on the cutting edge, experimenting with innovative practices. You'll learn systems thinking and may be involved in building new methods.</li>
<li><strong>Many farms practice both.</strong> The most progressive operations pursue regenerative organic certification — combining the rigor of organic standards with the ambition of regenerative outcomes.</li>
</ul>

<p>Neither approach is "better" — they're complementary philosophies. The best farm for you depends on what you want to learn and how you want to contribute to the food system.</p>

<p>Explore both <a href="/organic-farm-jobs">organic farm jobs</a> and regenerative positions on <a href="/">PlayInDirtJobs</a>.</p>
`,
  },
  {
    slug: "what-to-expect-your-first-week-on-a-farm",
    title: "What to Expect Your First Week on a Farm",
    category: "Getting Started",
    excerpt: "Your first week on a farm will be intense, humbling, and deeply rewarding. Here's an honest look at what the experience is really like.",
    metaTitle: "What to Expect Your First Week on a Farm | The Almanac",
    metaDescription: "An honest guide to your first week working on a farm. What the daily schedule looks like, common challenges, what to bring, and how to make a great first impression.",
    date: "2026-02-05",
    author: "PlayInDirtJobs",
    readTime: 6,
    featured: false,
    heroImage: {
      src: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&h=630&fit=crop",
      alt: "Early morning sunrise over a farm with a barn in the background",
      credit: "Dose Media",
      creditUrl: "https://unsplash.com/@dose",
    },
    relatedSlugs: [
      "how-to-get-a-farm-job-with-no-experience",
      "seasonal-farm-work-complete-guide-to-harvest-jobs",
    ],
    content: `
<p>You've landed the farm job, packed your bags, and you're ready to go. But what will those first days actually look like? Here's an honest, practical preview of your first week working on a farm — from people who've been there.</p>

<h2>Day 1: Orientation and Overwhelm</h2>

<p>Your first day will be a whirlwind of new information. Expect a farm tour, introductions to the team, and a crash course in the farm's layout, tools, and daily rhythms. You'll learn where things are stored, how to use basic equipment, and the farm's rules and expectations.</p>

<p>Don't worry about remembering everything. Everyone expects a learning curve. The most important thing on day one is to listen carefully, ask questions when you're unsure, and show that you're eager to learn.</p>

<h2>The Daily Schedule</h2>

<p>Farm days start early. A typical schedule might look like this:</p>

<ul>
<li><strong>6:00–6:30 AM:</strong> Wake up. Coffee or breakfast.</li>
<li><strong>7:00 AM:</strong> Morning meeting or animal chores. If the farm has livestock, morning feeding and watering come first — animals don't sleep in.</li>
<li><strong>7:30 AM–12:00 PM:</strong> Morning work block. This is usually the most productive time — cooler temperatures and fresh energy. Planting, weeding, harvesting, or building projects.</li>
<li><strong>12:00–1:00 PM:</strong> Lunch break. On many farms, this is a communal meal. Take the full break — you'll need the energy.</li>
<li><strong>1:00–5:00 PM:</strong> Afternoon work. Often lighter or more detail-oriented tasks: washing produce, transplanting seedlings, irrigation management, or tool maintenance.</li>
<li><strong>5:00–6:00 PM:</strong> Evening chores. Closing up greenhouses, feeding animals, watering if needed.</li>
</ul>

<p>Some farms work longer hours during peak season, while others maintain a strict 8-hour day. Ask about the schedule before you start so you can plan accordingly.</p>

<h2>The Physical Reality</h2>

<p>Let's be direct: your body will hurt. Even if you're physically fit, farm work uses muscles you didn't know you had. Bending, lifting, squatting, carrying, and repetitive hand motions will leave you sore — especially in the first week.</p>

<p>This is normal and it gets better. Within two to three weeks, your body adapts remarkably. Until then:</p>

<ul>
<li><strong>Stretch every morning and evening.</strong> Your back and hips will thank you.</li>
<li><strong>Stay hydrated.</strong> Drink water constantly, not just when you're thirsty. Farm dehydration is real and sneaks up fast.</li>
<li><strong>Eat well.</strong> Your body needs fuel. Don't skip meals.</li>
<li><strong>Sleep early.</strong> When you're waking at 6 AM and working physically all day, 10 PM bedtimes aren't embarrassing — they're essential.</li>
</ul>

<h2>Common First-Week Challenges</h2>

<p><strong>Pace anxiety.</strong> You'll be slower than experienced workers. That's expected. Focus on doing tasks correctly rather than quickly — speed comes naturally with repetition.</p>

<p><strong>Information overload.</strong> Plant names, tool names, field names, technique names — it's a lot. Keep a small notebook in your pocket and jot things down. Nobody will think it's weird; they'll think it's smart.</p>

<p><strong>Social adjustment.</strong> Farm teams are often small and close-knit. If you're living on the farm, you'll spend a lot of time with the same people. Be friendly, respect shared spaces, and contribute to communal tasks like cooking and cleaning.</p>

<p><strong>Weather exposure.</strong> You'll work in rain, heat, cold, and mud. There's no "calling out" because it's drizzling. Dress in layers, invest in rain gear, and accept that you'll get dirty. That's literally the job.</p>

<h2>How to Make a Great First Impression</h2>

<ul>
<li><strong>Show up early.</strong> Even five minutes early signals reliability.</li>
<li><strong>Say yes to tasks.</strong> Your first week isn't the time to be selective. Enthusiastically tackle whatever needs doing, even if it's unglamorous.</li>
<li><strong>Ask before you act.</strong> When you're unsure about anything — how to use a tool, where to put something, how much to harvest — ask. It's far better to ask than to make an avoidable mistake.</li>
<li><strong>Clean up after yourself.</strong> Put tools back where they belong. Leave work areas tidier than you found them. This single habit will earn you enormous respect.</li>
<li><strong>Stay off your phone.</strong> Farm work requires presence and attention. Save the scrolling for breaks.</li>
</ul>

<h2>What You'll Gain</h2>

<p>By the end of your first week, you'll be tired, sore, and probably sunburned. You'll also have a sense of accomplishment that's hard to find anywhere else. You'll have eaten food you helped grow, learned skills that humans have practiced for millennia, and connected with the land in a way that desk work simply can't offer.</p>

<p>The first week is the hardest. After that, you'll wonder why you didn't do this sooner.</p>

<p>Ready to find your first farm position? Browse opportunities on <a href="/">PlayInDirtJobs</a>.</p>
`,
  },
];

export function getAlmanacArticle(slug: string): AlmanacArticle | undefined {
  return almanacArticles.find((a) => a.slug === slug);
}

export function getAlmanacArticles(category?: string): AlmanacArticle[] {
  if (!category) return almanacArticles;
  return almanacArticles.filter((a) => a.category === category);
}

export function getFeaturedArticles(): AlmanacArticle[] {
  return almanacArticles.filter((a) => a.featured);
}

export function getAlmanacCategories(): string[] {
  return [...new Set(almanacArticles.map((a) => a.category))];
}
