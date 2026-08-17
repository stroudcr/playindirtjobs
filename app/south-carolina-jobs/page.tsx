import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "SC";
const STATE_SLUG = "south-carolina";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function SouthCarolinaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
