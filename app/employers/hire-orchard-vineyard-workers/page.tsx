import { EmployerNichePage } from "../_components/EmployerNichePage";
import { buildNicheMetadata, employerNiches } from "../content";

const config = employerNiches.orchard;

export const metadata = buildNicheMetadata(config);

export default function HireOrchardVineyardWorkersPage() {
  return <EmployerNichePage config={config} />;
}
