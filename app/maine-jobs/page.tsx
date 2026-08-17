import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "ME";
const STATE_SLUG = "maine";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function MaineJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
