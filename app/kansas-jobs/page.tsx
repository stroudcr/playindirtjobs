import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "KS";
const STATE_SLUG = "kansas";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function KansasJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
