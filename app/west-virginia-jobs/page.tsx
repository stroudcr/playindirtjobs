import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "WV";
const STATE_SLUG = "west-virginia";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function WestVirginiaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
