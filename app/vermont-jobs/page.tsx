import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "VT";
const STATE_SLUG = "vermont";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function VermontJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
