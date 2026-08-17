import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "MN";
const STATE_SLUG = "minnesota";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function MinnesotaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
