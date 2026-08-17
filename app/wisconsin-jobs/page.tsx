import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "WI";
const STATE_SLUG = "wisconsin";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function WisconsinJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
