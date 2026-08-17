import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "RI";
const STATE_SLUG = "rhode-island";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function RhodeIslandJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
