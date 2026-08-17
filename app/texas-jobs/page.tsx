import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "TX";
const STATE_SLUG = "texas";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function TexasJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
