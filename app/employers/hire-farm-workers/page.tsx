import { EmployerNichePage } from "../_components/EmployerNichePage";
import { buildNicheMetadata, employerNiches } from "../content";

const config = employerNiches.farm;

export const metadata = buildNicheMetadata(config);

export default function HireFarmWorkersPage() {
  return <EmployerNichePage config={config} />;
}
