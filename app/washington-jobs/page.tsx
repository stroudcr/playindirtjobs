import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "WA";
const STATE_SLUG = "washington";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function WashingtonJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
