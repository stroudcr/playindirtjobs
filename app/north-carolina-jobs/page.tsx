import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "NC";
const STATE_SLUG = "north-carolina";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function NorthCarolinaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
