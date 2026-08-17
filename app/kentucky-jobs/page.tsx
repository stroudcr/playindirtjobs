import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "KY";
const STATE_SLUG = "kentucky";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function KentuckyJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
