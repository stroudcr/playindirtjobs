import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "NH";
const STATE_SLUG = "new-hampshire";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function NewHampshireJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
