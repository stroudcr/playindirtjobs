import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "VA";
const STATE_SLUG = "virginia";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function VirginiaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
