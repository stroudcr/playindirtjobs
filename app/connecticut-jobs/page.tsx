import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "CT";
const STATE_SLUG = "connecticut";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function ConnecticutJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
