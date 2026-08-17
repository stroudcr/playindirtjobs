import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "AL";
const STATE_SLUG = "alabama";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function AlabamaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
