import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "MA";
const STATE_SLUG = "massachusetts";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function MassachusettsJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
