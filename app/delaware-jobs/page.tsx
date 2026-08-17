import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "DE";
const STATE_SLUG = "delaware";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function DelawareJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
