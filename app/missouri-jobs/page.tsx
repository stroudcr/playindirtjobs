import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "MO";
const STATE_SLUG = "missouri";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function MissouriJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
