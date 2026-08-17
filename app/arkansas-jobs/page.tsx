import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "AR";
const STATE_SLUG = "arkansas";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function ArkansasJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
