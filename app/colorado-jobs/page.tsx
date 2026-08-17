import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "CO";
const STATE_SLUG = "colorado";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function ColoradoJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
