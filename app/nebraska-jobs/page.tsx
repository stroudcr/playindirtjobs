import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "NE";
const STATE_SLUG = "nebraska";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function NebraskaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
