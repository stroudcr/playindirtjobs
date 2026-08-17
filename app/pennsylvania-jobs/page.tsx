import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "PA";
const STATE_SLUG = "pennsylvania";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function PennsylvaniaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
