import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "IL";
const STATE_SLUG = "illinois";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function IllinoisJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
