import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "GA";
const STATE_SLUG = "georgia";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function GeorgiaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
