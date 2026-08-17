import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "LA";
const STATE_SLUG = "louisiana";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function LouisianaJobsPage() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
