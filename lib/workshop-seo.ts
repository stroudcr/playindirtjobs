import { getUrl } from "@/lib/metadata";
import { type PublicWorkshop, workshopIsOpen } from "@/lib/workshop-types";

export function workshopStructuredData(workshop: PublicWorkshop) {
  const url = getUrl(`/workshops/${workshop.slug}`);
  const provider = {
    "@type": "Organization",
    name: workshop.organization,
    ...(workshop.organizerWebsite ? { url: workshop.organizerWebsite } : {}),
  };
  const offer = {
    "@type": "Offer",
    url: workshop.registrationUrl,
    price: workshop.tuitionCents / 100,
    priceCurrency: "USD",
    availability: workshopIsOpen(workshop)
      ? "https://schema.org/InStock"
      : "https://schema.org/SoldOut",
  };
  const base = {
    "@context": "https://schema.org",
    "@id": `${url}#training`,
    name: workshop.title,
    description: workshop.summary,
    url,
    image: getUrl("/images/home-hero-linocut-field.webp"),
  };
  if (workshop.format === "self-paced")
    return {
      ...base,
      "@type": "Course",
      provider,
      educationalLevel: workshop.level,
      teaches: workshop.outcomes,
      offers: offer,
      hasCourseInstance: { "@type": "CourseInstance", courseMode: "Online" },
    };
  return {
    ...base,
    "@type": "EducationEvent",
    startDate: workshop.startAt,
    ...(workshop.endAt ? { endDate: workshop.endAt } : {}),
    organizer: provider,
    offers: offer,
    eventStatus:
      workshop.status === "CANCELED"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode:
      workshop.format === "in-person"
        ? "https://schema.org/OfflineEventAttendanceMode"
        : "https://schema.org/OnlineEventAttendanceMode",
    location:
      workshop.format === "in-person"
        ? {
            "@type": "Place",
            name: workshop.venue,
            address: {
              "@type": "PostalAddress",
              streetAddress: workshop.address,
              addressLocality: workshop.city,
              addressRegion: workshop.state,
              postalCode: workshop.postalCode || undefined,
              addressCountry: "US",
            },
          }
        : { "@type": "VirtualLocation", url: workshop.registrationUrl },
  };
}
export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
