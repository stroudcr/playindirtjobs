import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "NJ";
const STATE_SLUG = "new-jersey";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function NewJerseyJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
