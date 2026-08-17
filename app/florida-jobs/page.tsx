import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "FL";
const STATE_SLUG = "florida";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function FloridaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
