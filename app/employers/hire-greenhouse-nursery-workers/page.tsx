import { EmployerNichePage } from "../_components/EmployerNichePage";
import { buildNicheMetadata, employerNiches } from "../content";

const config = employerNiches.greenhouse;

export const metadata = buildNicheMetadata(config);

export default function HireGreenhouseNurseryWorkersPage() {
  return <EmployerNichePage config={config} />;
}
