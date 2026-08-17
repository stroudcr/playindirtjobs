import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "NV";
const STATE_SLUG = "nevada";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function NevadaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
