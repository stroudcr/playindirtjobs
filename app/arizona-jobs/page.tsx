import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "AZ";
const STATE_SLUG = "arizona";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function ArizonaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
