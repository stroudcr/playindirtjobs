import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "MT";
const STATE_SLUG = "montana";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function MontanaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
