import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "NM";
const STATE_SLUG = "new-mexico";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function NewMexicoJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
