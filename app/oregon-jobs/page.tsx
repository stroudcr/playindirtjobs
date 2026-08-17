import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "OR";
const STATE_SLUG = "oregon";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function OregonJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
