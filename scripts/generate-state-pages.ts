/**
 * Rebuild the 50 state route wrappers around the shared StateJobsPage.
 * Usage: npx tsx scripts/generate-state-pages.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { US_STATES_WITHOUT_DC } from "../lib/constants";

function statePageTemplate(stateCode: string, stateName: string, stateSlug: string) {
  const componentName = `${stateName.replace(/\s+/g, "")}JobsPage`;

  return `import { StateJobsPage, createStateJobsMetadata } from "@/components/StateJobsPage";

export const revalidate = 300;

const STATE_CODE = "${stateCode}";
const STATE_SLUG = "${stateSlug}";

export const metadata = createStateJobsMetadata(STATE_CODE, STATE_SLUG);

export default function ${componentName}() {
  return <StateJobsPage stateCode={STATE_CODE} stateSlug={STATE_SLUG} />;
}
`;
}

const appDirectory = path.join(process.cwd(), "app");

for (const state of US_STATES_WITHOUT_DC) {
  const stateSlug = state.name.toLowerCase().replace(/\s+/g, "-");
  const directory = path.join(appDirectory, `${stateSlug}-jobs`);
  const filePath = path.join(directory, "page.tsx");

  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(filePath, statePageTemplate(state.code, state.name, stateSlug), "utf8");
}

console.log(`Rebuilt ${US_STATES_WITHOUT_DC.length} state job pages.`);
