import { getWorkshops } from "@/lib/workshops";
import { getUrl } from "@/lib/metadata";
import { createSitemapXml, xmlResponse } from "@/lib/sitemap-xml";
export const dynamic = "force-dynamic";
export async function GET() {
  const workshops = await getWorkshops();
  return xmlResponse(
    createSitemapXml(
      workshops.map((workshop) => ({
        url: getUrl(`/workshops/${workshop.slug}`),
        lastModified: workshop.updatedAt,
      })),
    ),
    300,
  );
}
