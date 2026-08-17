import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "UT";
const STATE_SLUG = "utah";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function UtahJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
