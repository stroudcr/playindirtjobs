import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "CA";
const STATE_SLUG = "california";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function CaliforniaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
