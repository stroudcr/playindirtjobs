import { z } from "zod";

export const jobSchema = z.object({
  // Basic info
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  company: z.string().min(2, "Company name must be at least 2 characters").max(100),
  location: z.string().min(2, "Location must be at least 2 characters").max(200),
  description: z.string().min(100, "Description must be at least 100 characters").max(5000),

  // Salary
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),

  // Job details
  jobType: z.array(z.string()).min(1, "Select at least one job type"),
  farmType: z.array(z.string()).min(1, "Select at least one farm type"),
  categories: z.array(z.string()).min(1, "Select at least one category").max(3, "Maximum 3 categories"),
  tags: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),

  // Company info
  companyEmail: z.string().email("Invalid email address"),
  companyWebsite: z.string().url("Invalid URL").optional().or(z.literal("")),
  companyLogo: z.string().url("Invalid logo URL").optional().or(z.literal("")),

  // Application
  applyUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  applyEmail: z.string().email("Invalid email").optional().or(z.literal("")),
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
