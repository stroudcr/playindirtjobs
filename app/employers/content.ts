import type { Metadata } from "next";
import { getUrl } from "@/lib/metadata";

export type EmployerFaq = {
  question: string;
  answer: string;
};

export type EmployerNicheConfig = {
  slug: string;
  source: string;
  shortName: string;
  navLabel: string;
  title: string;
  description: string;
  heroBody: string;
  browseHref: string;
  browseLabel: string;
  hiringTitle: string;
  hiringBody: string[];
  roles: string[];
  checklist: Array<{
    title: string;
    body: string;
  }>;
  faqs: EmployerFaq[];
};

export const employerNiches = {
  greenhouse: {
    slug: "employers/hire-greenhouse-nursery-workers",
    source: "employer_greenhouse",
    shortName: "Greenhouse & nursery",
    navLabel: "Greenhouse and nursery workers",
    title: "Hire Greenhouse and Nursery Workers",
    description:
      "Post greenhouse and nursery jobs nationwide for $15, or choose a $25 Featured listing. Every listing stays active for 60 days.",
    heroBody:
      "Create a clear listing for propagation, production, irrigation, fulfillment, or garden-center roles. Direct applicants to the email address or application page you choose.",
    browseHref: "/gardening-jobs",
    browseLabel: "See gardening and nursery jobs",
    hiringTitle: "Make the growing environment clear from the start",
    hiringBody: [
      "Greenhouse and nursery work can change quickly with weather, inventory, and the growing cycle. A useful posting tells candidates whether the role is seasonal or year-round, how much time is spent indoors or outdoors, and what a typical shift includes.",
      "Name the plants, systems, and tools the employee will work with. If the job involves propagation, irrigation controls, pesticide application, order fulfillment, customer service, or lifting requirements, put those details near the top of the listing.",
    ],
    roles: [
      "Greenhouse grower or technician",
      "Nursery production worker",
      "Propagation specialist",
      "Irrigation technician",
      "Inventory and order-fulfillment worker",
      "Garden-center sales associate",
    ],
    checklist: [
      {
        title: "Season and schedule",
        body: "State the expected start and end dates, weekly hours, weekend rotation, and any peak-season overtime.",
      },
      {
        title: "Growing conditions",
        body: "Explain heat, humidity, outdoor exposure, standing, lifting, and other physical parts of the work.",
      },
      {
        title: "Plants and systems",
        body: "List relevant crops, propagation methods, irrigation controls, equipment, licenses, or software experience.",
      },
      {
        title: "Customer-facing work",
        body: "Note whether the role includes plant advice, retail sales, loading orders, deliveries, or wholesale customer support.",
      },
    ],
    faqs: [
      {
        question: "Can I post both greenhouse and retail nursery roles?",
        answer:
          "Yes. PlayInDirtJobs accepts agriculture-related production, horticulture, fulfillment, and garden-center roles. Use one listing for each distinct position so its title, schedule, and requirements are clear.",
      },
      {
        question: "Can I include required licenses or technical experience?",
        answer:
          "Yes. Add pesticide credentials, irrigation knowledge, equipment experience, plant expertise, or other requirements to the job description.",
      },
      {
        question: "How long will my nursery job stay active?",
        answer:
          "Basic and Featured listings both remain active for 60 days from publication. There are no recurring charges for that listing.",
      },
      {
        question: "How do candidates apply?",
        answer:
          "You choose the public application method when posting. Candidates can be directed to an application email address or an application page on your website.",
      },
    ],
  },
  orchard: {
    slug: "employers/hire-orchard-vineyard-workers",
    source: "employer_orchard",
    shortName: "Orchard & vineyard",
    navLabel: "Orchard and vineyard workers",
    title: "Hire Orchard and Vineyard Workers",
    description:
      "Post orchard and vineyard jobs nationwide for $15, or choose a $25 Featured listing. Every listing stays active for 60 days.",
    heroBody:
      "Describe the season, crop, equipment, and day-to-day work in one agriculture-focused listing. Candidates apply through the email address or application page you provide.",
    browseHref: "/farming-jobs",
    browseLabel: "See current farming jobs",
    hiringTitle: "Turn a seasonal timeline into a useful job posting",
    hiringBody: [
      "Orchard and vineyard staffing follows the crop calendar. Give candidates exact dates whenever possible and explain whether you need a short harvest crew, a pruning team, an equipment operator, or a year-round production employee.",
      "Worksite details matter. Include the crop and acreage, terrain, weather exposure, machinery, expected pace, transportation between blocks, and whether housing is available. If compensation varies by experience or production, explain the basis clearly.",
    ],
    roles: [
      "Orchard or vineyard crew member",
      "Harvest worker",
      "Pruning and canopy-management worker",
      "Tractor or equipment operator",
      "Irrigation technician",
      "Orchard or vineyard manager",
    ],
    checklist: [
      {
        title: "Crop calendar",
        body: "Give specific dates for pruning, thinning, harvest, and any chance that the assignment may be extended.",
      },
      {
        title: "Equipment and licenses",
        body: "Name tractors, platforms, sprayers, forklifts, trucks, and any driver or applicator credentials required.",
      },
      {
        title: "Pay structure",
        body: "State the rate or range, pay period, overtime expectations, and whether any work is paid by production.",
      },
      {
        title: "Housing and transportation",
        body: "Say whether housing, worksite transportation, meals, or other practical benefits are included or available.",
      },
    ],
    faqs: [
      {
        question: "Can I post short harvest or pruning positions?",
        answer:
          "Yes. Seasonal and temporary agriculture roles are welcome. Include exact dates, expected hours, compensation, and worksite details so candidates can evaluate the assignment.",
      },
      {
        question: "Can I list housing or transportation?",
        answer:
          "Yes. You can identify available benefits and explain housing, transportation, meals, equipment, or other arrangements in the description.",
      },
      {
        question: "What does a Featured listing change?",
        answer:
          "A Featured listing is highlighted, carries a Featured label, and is displayed ahead of Basic listings in job result lists. It remains active for the same 60-day period.",
      },
      {
        question: "Can applicants use our existing hiring system?",
        answer:
          "Yes. Add the application page from your website or hiring system, and the listing will direct candidates there.",
      },
    ],
  },
  csa: {
    slug: "employers/hire-vegetable-csa-workers",
    source: "employer_csa",
    shortName: "Vegetable & CSA",
    navLabel: "Vegetable farm and CSA workers",
    title: "Hire Vegetable Farm and CSA Workers",
    description:
      "Post vegetable farm and CSA jobs nationwide for $15, or choose a $25 Featured listing. Every listing stays active for 60 days.",
    heroBody:
      "Set expectations for field, wash-pack, distribution, and market work before candidates apply. Choose your plan, preview the listing, and send applications to your preferred destination.",
    browseHref: "/organic-farm-jobs",
    browseLabel: "See current organic farm jobs",
    hiringTitle: "Show candidates the full rhythm of the week",
    hiringBody: [
      "A vegetable farm role may move from transplanting and cultivation to harvest, wash-pack, CSA distribution, and market setup in the same week. Describe that rhythm so candidates understand the mix of field work, food handling, driving, and customer contact.",
      "Be direct about the season, start times, weekend markets, lifting, pace, and weather exposure. If the position includes produce shares, meals, housing, training, or advancement into crew leadership, include those details alongside compensation.",
    ],
    roles: [
      "Diversified vegetable farm crew member",
      "Harvest and wash-pack worker",
      "CSA packing and distribution coordinator",
      "Farmers-market crew member",
      "Field crew leader",
      "Vegetable production manager",
    ],
    checklist: [
      {
        title: "Weekly work mix",
        body: "Explain the balance of planting, weeding, harvest, wash-pack, delivery, and market responsibilities.",
      },
      {
        title: "Season dates and hours",
        body: "List the intended start and end dates, typical start time, weekly hours, and weekend commitments.",
      },
      {
        title: "Food and vehicle duties",
        body: "Call out food-safety practices, packing standards, delivery routes, and any driver-license requirement.",
      },
      {
        title: "Farm benefits",
        body: "Describe produce shares, meals, housing, learning opportunities, equipment, or other benefits actually offered.",
      },
    ],
    faqs: [
      {
        question: "Can I post a role that combines field and farmers-market work?",
        answer:
          "Yes. Describe the different responsibilities, typical weekly schedule, transportation needs, and customer-facing work in the listing.",
      },
      {
        question: "Can I advertise an apprenticeship or internship?",
        answer:
          "Yes. Agriculture apprenticeships and internships may be posted. Clearly state compensation, schedule, learning component, duration, and any included housing or meals.",
      },
      {
        question: "Are listings visible outside my state?",
        answer:
          "Yes. Listings can be viewed nationwide. Your job location is shown on the listing so candidates can evaluate travel or relocation needs.",
      },
      {
        question: "How much does it cost to post?",
        answer:
          "A 60-day Basic listing costs $15. A 60-day Featured listing costs $25 and receives highlighting, a Featured label, and placement ahead of Basic listings in job result lists.",
      },
    ],
  },
  farm: {
    slug: "employers/hire-farm-workers",
    source: "employer_farm",
    shortName: "Farm workers",
    navLabel: "Farm workers",
    title: "Hire Farm Workers",
    description:
      "Post farm jobs nationwide for $15, or choose a $25 Featured listing. Every listing stays active for 60 days.",
    heroBody:
      "Post seasonal, full-time, part-time, management, equipment, livestock, or apprenticeship roles with the location and application method candidates need.",
    browseHref: "/farming-jobs",
    browseLabel: "See current farming jobs",
    hiringTitle: "Describe the real work, not just the job title",
    hiringBody: [
      "The title “farm worker” can mean crop production, livestock care, equipment operation, repairs, deliveries, or all of the above. Strong listings explain what the employee will do on a normal day and how those duties change through the season.",
      "Include the operation type, location, compensation, schedule, physical requirements, experience level, and benefits. Candidates also need to know whether the role is seasonal or ongoing and whether they should apply by email or through your website.",
    ],
    roles: [
      "General farm hand",
      "Equipment operator",
      "Livestock-care worker",
      "Harvest worker",
      "Farm manager or crew leader",
      "Farm apprentice or intern",
    ],
    checklist: [
      {
        title: "Daily responsibilities",
        body: "List the crops, animals, equipment, maintenance, delivery, or customer duties that make up the role.",
      },
      {
        title: "Experience level",
        body: "Separate skills that are required on day one from tasks you are prepared to teach on the job.",
      },
      {
        title: "Schedule and season",
        body: "State weekly hours, early mornings or weekends, intended dates, and how the schedule changes during busy periods.",
      },
      {
        title: "Compensation and benefits",
        body: "Provide the pay rate or range and explain any housing, meals, equipment, insurance, or learning opportunities offered.",
      },
    ],
    faqs: [
      {
        question: "What types of farm jobs can I post?",
        answer:
          "You can post agriculture-related full-time, part-time, seasonal, temporary, contract, apprenticeship, and internship roles, including crop, livestock, equipment, management, retail, and farm-support work.",
      },
      {
        question: "Can I edit or close a listing early?",
        answer:
          "Yes. The management link sent to the employer email can be used to update or deactivate an active listing.",
      },
      {
        question: "Does PlayInDirtJobs guarantee applications or a hire?",
        answer:
          "No. PlayInDirtJobs provides the listing and application path but does not guarantee a number of views, applications, or hiring outcomes.",
      },
      {
        question: "What information do I need before I post?",
        answer:
          "Prepare the job title, company and location, responsibilities, compensation, schedule, requirements, benefits, and either an application email address or application URL.",
      },
    ],
  },
} satisfies Record<string, EmployerNicheConfig>;

export const employerNicheList = Object.values(employerNiches);

export function buildNicheMetadata(config: EmployerNicheConfig): Metadata {
  const url = getUrl(config.slug);

  return {
    title: `${config.title} | PlayInDirtJobs`,
    description: config.description,
    keywords: [
      config.title.toLowerCase(),
      `post ${config.shortName.toLowerCase()} jobs`,
      "agriculture job posting",
      "agricultural job board for employers",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${config.title} | PlayInDirtJobs`,
      description: config.description,
      url,
      siteName: "PlayInDirtJobs",
      type: "website",
      images: [
        {
          url: "/images/PlayInDirtX.png",
          width: 1200,
          height: 630,
          alt: `${config.title} with PlayInDirtJobs`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.title} | PlayInDirtJobs`,
      description: config.description,
      images: ["/images/PlayInDirtX.png"],
    },
  };
}
