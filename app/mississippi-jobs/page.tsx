import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "MS";
const STATE_SLUG = "mississippi";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function MississippiJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
