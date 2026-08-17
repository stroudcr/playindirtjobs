import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "WY";
const STATE_SLUG = "wyoming";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function WyomingJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
