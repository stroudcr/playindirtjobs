import { EmployerNichePage } from "../_components/EmployerNichePage";
import { buildNicheMetadata, employerNiches } from "../content";

const config = employerNiches.csa;

export const metadata = buildNicheMetadata(config);

export default function HireVegetableCsaWorkersPage() {
  return <EmployerNichePage config={config} />;
}
