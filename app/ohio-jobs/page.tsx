import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "OH";
const STATE_SLUG = "ohio";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function OhioJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
