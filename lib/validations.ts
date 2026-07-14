import { z } from "zod";

import { FARM_TYPES, JOB_CATEGORIES, JOB_TYPES, US_STATES } from "@/lib/constants";

const categoryIds = new Set<string>(JOB_CATEGORIES.map((item) => item.id));
const jobTypeIds = new Set<string>(JOB_TYPES.map((item) => item.id));
const farmTypeIds = new Set<string>(FARM_TYPES.map((item) => item.id));
const stateCodes = new Set<string>(US_STATES.map((item) => item.code));

const optionalUrl = z.union([z.string().url("Enter a complete URL beginning with http:// or https://"), z.literal(""), z.null()]).optional();
const optionalEmail = z.union([z.string().email("Enter a valid email address"), z.literal(""), z.null()]).optional();

const sharedJobFields = {
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(100),
  company: z.string().trim().min(2, "Company name must be at least 2 characters").max(100),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(100),
  state: z.string().trim().toUpperCase().refine((value) => stateCodes.has(value), "Select a valid state"),
  postalCode: z.string().trim().max(10).optional().nullable(),
  remote: z.boolean().optional().default(false),
  description: z.string().trim().min(100, "Description must be at least 100 characters").max(5_000),
  salaryMin: z.number().int().min(0).optional().nullable(),
  salaryMax: z.number().int().min(0).optional().nullable(),
  salaryType: z.enum(["annual", "hourly"]).optional().default("annual"),
  jobType: z.array(z.string().refine((value) => jobTypeIds.has(value), "Invalid job type")).min(1, "Select at least one job type"),
  farmType: z.array(z.string().refine((value) => farmTypeIds.has(value), "Invalid farm type")).min(1, "Select at least one farm type"),
  categories: z.array(z.string().refine((value) => categoryIds.has(value), "Invalid category")).min(1, "Select at least one category").max(3, "Maximum 3 categories"),
  tags: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  companyWebsite: optionalUrl,
  companyLogo: optionalUrl,
  applyUrl: optionalUrl,
  applyEmail: optionalEmail,
};

function addJobRefinements<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema
    .refine((data) => Boolean(data.applyUrl || data.applyEmail), {
      message: "Add an application URL or public application email",
      path: ["applyUrl"],
    })
    .refine(
      (data) =>
        typeof data.salaryMin !== "number" ||
        typeof data.salaryMax !== "number" ||
        data.salaryMin <= data.salaryMax,
      {
        message: "Minimum compensation must be less than maximum compensation",
        path: ["salaryMax"],
      }
    );
}

// Legacy management routes still accept companyEmail until all token-managed jobs expire.
export const jobSchema = addJobRefinements(
  z.object({
    ...sharedJobFields,
    companyEmail: z.string().trim().toLowerCase().email("Enter a valid management email"),
  })
);

export const postingSchema = addJobRefinements(
  z.object({
    ...sharedJobFields,
    managementEmail: z.string().trim().toLowerCase().email("Enter a valid management email"),
  })
);

export const draftJobDataSchema = z
  .object({
    title: z.string().max(100).optional(),
    company: z.string().max(100).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(2).optional(),
    postalCode: z.string().max(10).optional(),
    remote: z.boolean().optional(),
    description: z.string().max(5_000).optional(),
    salaryMin: z.union([z.number().int().min(0), z.string().max(12), z.null()]).optional(),
    salaryMax: z.union([z.number().int().min(0), z.string().max(12), z.null()]).optional(),
    salaryType: z.enum(["annual", "hourly"]).optional(),
    jobType: z.array(z.string()).max(JOB_TYPES.length).optional(),
    farmType: z.array(z.string()).max(FARM_TYPES.length).optional(),
    categories: z.array(z.string()).max(3).optional(),
    tags: z.array(z.string()).max(20).optional(),
    benefits: z.array(z.string()).max(20).optional(),
    managementEmail: z.string().max(320).optional(),
    companyWebsite: z.string().max(2_000).optional(),
    companyLogo: z.string().max(2_000).optional(),
    applyUrl: z.string().max(2_000).optional(),
    applyEmail: z.string().max(320).optional(),
  })
  .strict();

export type JobFormData = z.infer<typeof jobSchema>;
export type PostingData = z.infer<typeof postingSchema>;
export type DraftJobData = z.infer<typeof draftJobDataSchema>;

export const jobUpdateSchema = jobSchema;
export type JobUpdateData = z.infer<typeof jobUpdateSchema>;
