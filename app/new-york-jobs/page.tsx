import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "NY";
const STATE_SLUG = "new-york";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function NewYorkJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
