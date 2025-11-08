import { z } from "zod";

export const jobSchema = z.object({
  // Basic info
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  company: z.string().min(2, "Company name must be at least 2 characters").max(100),

  // Location (structured for SEO)
  city: z.string().min(2, "City must be at least 2 characters").max(100),
  state: z.string().min(2, "State is required").max(2, "Use 2-letter state code"),
  postalCode: z.string().max(10).optional().nullable(),
  remote: z.boolean().optional().default(false),

  description: z.string().min(100, "Description must be at least 100 characters").max(5000),

  // Salary
  salaryMin: z.number().min(0).optional().nullable(),
  salaryMax: z.number().min(0).optional().nullable(),

  // Job details
  jobType: z.array(z.string()).min(1, "Select at least one job type"),
  farmType: z.array(z.string()).min(1, "Select at least one farm type"),
  categories: z.array(z.string()).min(1, "Select at least one category").max(3, "Maximum 3 categories"),
  tags: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),

  // Company info
  companyEmail: z.string().email("Invalid email address"),
  companyWebsite: z.union([z.string().url("Invalid URL"), z.literal(""), z.null()]).optional(),
  companyLogo: z.union([z.string().url("Invalid logo URL"), z.literal(""), z.null()]).optional(),

  // Application
  applyUrl: z.union([z.string().url("Invalid URL"), z.literal(""), z.null()]).optional(),
  applyEmail: z.union([z.string().email("Invalid email"), z.literal(""), z.null()]).optional(),
}).refine(
  (data) => data.applyUrl || data.applyEmail,
  {
    message: "Either apply URL or apply email must be provided",
    path: ["applyUrl"],
  }
).refine(
  (data) => !data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax,
  {
    message: "Minimum salary must be less than maximum salary",
    path: ["salaryMax"],
  }
);

export type JobFormData = z.infer<typeof jobSchema>;

// Schema for updating existing jobs (same as jobSchema but used for updates)
export const jobUpdateSchema = jobSchema;

export type JobUpdateData = z.infer<typeof jobUpdateSchema>;
