import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "IA";
const STATE_SLUG = "iowa";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function IowaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
