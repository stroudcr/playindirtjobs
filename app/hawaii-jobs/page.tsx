import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "HI";
const STATE_SLUG = "hawaii";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function HawaiiJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
