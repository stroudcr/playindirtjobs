import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "AK";
const STATE_SLUG = "alaska";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function AlaskaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
