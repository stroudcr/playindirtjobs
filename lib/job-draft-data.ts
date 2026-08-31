export interface WizardData {
  title: string;
  company: string;
  city: string;
  state: string;
  postalCode: string;
  remote: boolean;
  description: string;
  salaryMin: string;
  salaryMax: string;
  salaryType: "annual" | "hourly";
  jobType: string[];
  farmType: string[];
  categories: string[];
  tags: string[];
  benefits: string[];
  managementEmail: string;
  companyWebsite: string;
  companyLogo: string;
  applyUrl: string;
  applyEmail: string;
}

export type WizardDataInput = Partial<Omit<WizardData, "salaryMin" | "salaryMax">> & {
  salaryMin?: string | number | null;
  salaryMax?: string | number | null;
};

export const DEFAULT_WIZARD_DATA: WizardData = {
  title: "",
  company: "",
  city: "",
  state: "",
  postalCode: "",
  remote: false,
  description: "",
  salaryMin: "",
  salaryMax: "",
  salaryType: "annual",
  jobType: [],
  farmType: [],
  categories: [],
  tags: [],
  benefits: [],
  managementEmail: "",
  companyWebsite: "",
  companyLogo: "",
  applyUrl: "",
  applyEmail: "",
};

export function normalizeDraftData(data: WizardDataInput): Partial<WizardData> {
  const normalized: Partial<WizardData> = { ...data } as Partial<WizardData>;
  if (Object.prototype.hasOwnProperty.call(data, "salaryMin")) {
    normalized.salaryMin = data.salaryMin == null ? "" : String(data.salaryMin);
  }
  if (Object.prototype.hasOwnProperty.call(data, "salaryMax")) {
    normalized.salaryMax = data.salaryMax == null ? "" : String(data.salaryMax);
  }
  return normalized;
}
