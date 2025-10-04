"use client";

import { useState } from "react";
import { JOB_CATEGORIES, JOB_TYPES, FARM_TYPES, BENEFITS, TAGS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salaryMin: "",
    salaryMax: "",
    jobType: [] as string[],
    farmType: [] as string[],
    categories: [] as string[],
    tags: [] as string[],
    benefits: [] as string[],
    companyEmail: "",
    companyWebsite: "",
    companyLogo: "",
    applyUrl: "",
    applyEmail: "",
  });

  const handleCheckboxChange = (field: string, value: string) => {
    const currentValues = formData[field as keyof typeof formData] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    setFormData({ ...formData, [field]: newValues });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Prepare data
      const submitData = {
        ...formData,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
      };

      // Store in session storage for preview
      sessionStorage.setItem("jobDraft", JSON.stringify(submitData));

      // Redirect to preview
      router.push("/post-job/preview");
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-earth-cream py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4">
            Post a Job
          </h1>
          <p className="text-xl text-forest-light">
            Find the perfect candidate for your farm, garden, or ranch
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-forest mb-6">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-forest mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Farm Hand - Organic Vegetable Farm"
                  className="input"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-forest mb-2">
                  Company/Farm Name *
                </label>
                <input
                  type="text"
                  id="company"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., Green Valley Farm"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-forest mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Portland, Oregon"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-forest mb-2">
                  Job Description * (minimum 100 characters)
                </label>
                <textarea
                  id="description"
                  required
                  rows={10}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, requirements, and what makes your farm special..."
                  className="input resize-y"
                />
                <p className="text-sm text-forest-light mt-1">
                  {formData.description.length} characters
                </p>
              </div>
            </div>
          </div>

          {/* Salary */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-forest mb-6">Compensation</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium text-forest mb-2">
                  Minimum Salary (Annual)
                </label>
                <input
                  type="number"
                  id="salaryMin"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                  placeholder="35000"
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="salaryMax" className="block text-sm font-medium text-forest mb-2">
                  Maximum Salary (Annual)
                </label>
                <input
                  type="number"
                  id="salaryMax"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                  placeholder="45000"
                  className="input"
                />
              </div>
            </div>
            <p className="text-sm text-forest-light mt-2">
              Leave blank if you prefer not to disclose
            </p>
          </div>

          {/* Categories */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-forest mb-4">Categories * (max 3)</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {JOB_CATEGORIES.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-primary/5 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.id)}
                    onChange={() => handleCheckboxChange("categories", category.id)}
                    disabled={!formData.categories.includes(category.id) && formData.categories.length >= 3}
                    className="w-5 h-5"
                  />
                  <span className="text-2xl">{category.emoji}</span>
                  <span className="font-medium text-forest">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Job Type */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-forest mb-4">Job Type *</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {JOB_TYPES.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-primary/5 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.jobType.includes(type.id)}
                    onChange={() => handleCheckboxChange("jobType", type.id)}
                    className="w-5 h-5"
                  />
                  <span className="font-medium text-forest">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Farm Type */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-forest mb-4">Farm Type *</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {FARM_TYPES.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-primary/5 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.farmType.includes(type.id)}
                    onChange={() => handleCheckboxChange("farmType", type.id)}
                    className="w-5 h-5"
                  />
                  <span className="text-xl">{type.emoji}</span>
                  <span className="font-medium text-forest">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-forest mb-4">Benefits (optional)</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {BENEFITS.map((benefit) => (
                <label
                  key={benefit.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-primary/5 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.benefits.includes(benefit.id)}
                    onChange={() => handleCheckboxChange("benefits", benefit.id)}
                    className="w-5 h-5"
                  />
                  <span className="text-xl">{benefit.emoji}</span>
                  <span className="font-medium text-forest">{benefit.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Company Information */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-forest mb-6">Company Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="companyEmail" className="block text-sm font-medium text-forest mb-2">
                  Company Email * (for job management)
                </label>
                <input
                  type="email"
                  id="companyEmail"
                  required
                  value={formData.companyEmail}
                  onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                  placeholder="jobs@greenvally.com"
                  className="input"
                />
                <p className="text-sm text-forest-light mt-1">
                  We&apos;ll send a magic link to this email to manage your posting
                </p>
              </div>

              <div>
                <label htmlFor="companyWebsite" className="block text-sm font-medium text-forest mb-2">
                  Company Website (optional)
                </label>
                <input
                  type="url"
                  id="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                  placeholder="https://greenvalleyfarm.com"
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-forest mb-6">Application Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="applyUrl" className="block text-sm font-medium text-forest mb-2">
                  Application URL
                </label>
                <input
                  type="url"
                  id="applyUrl"
                  value={formData.applyUrl}
                  onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                  placeholder="https://yourwebsite.com/apply"
                  className="input"
                />
              </div>

              <div className="text-center text-forest-light">OR</div>

              <div>
                <label htmlFor="applyEmail" className="block text-sm font-medium text-forest mb-2">
                  Application Email
                </label>
                <input
                  type="email"
                  id="applyEmail"
                  value={formData.applyEmail}
                  onChange={(e) => setFormData({ ...formData, applyEmail: e.target.value })}
                  placeholder="apply@greenvally.com"
                  className="input"
                />
              </div>

              <p className="text-sm text-forest-light">
                * At least one application method is required
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="btn bg-white border border-border hover:bg-gray-50 text-forest"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Preview Job →"
              )}
            </button>
          </div>

          {errors.submit && (
            <p className="text-red-500 text-center">{errors.submit}</p>
          )}
        </form>
      </div>
    </main>
  );
}
