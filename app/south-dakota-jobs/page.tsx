import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "SD";
const STATE_SLUG = "south-dakota";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function SouthDakotaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
