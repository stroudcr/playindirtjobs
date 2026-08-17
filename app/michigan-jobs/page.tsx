import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "MI";
const STATE_SLUG = "michigan";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function MichiganJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
