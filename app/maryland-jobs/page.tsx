import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "MD";
const STATE_SLUG = "maryland";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function MarylandJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
