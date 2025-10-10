"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  Save,
  Power,
  PowerOff,
  ExternalLink
} from "lucide-react";
import { JOB_CATEGORIES, JOB_TYPES, FARM_TYPES, BENEFITS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

interface Job {
  id: string;
  slug: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: string;
  jobType: string[];
  farmType: string[];
  categories: string[];
  tags: string[];
  benefits: string[];
  companyEmail: string;
  companyLogo?: string;
  companyWebsite?: string;
  applyUrl?: string;
  applyEmail?: string;
  featured: boolean;
  active: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export default function ManageJobPage() {
  const params = useParams();
  const router = useRouter();
  const editToken = params.editToken as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<Partial<Job>>({});

  useEffect(() => {
    fetchJob();
  }, [editToken]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/manage/${editToken}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Job not found. The management link may be invalid or expired.");
        } else {
          setError("Failed to load job details.");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setJob(data.job);
      setFormData(data.job);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching job:", err);
      setError("Failed to load job details.");
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof Job, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleInputChange(field, newArray);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/manage/${editToken}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update job");
      }

      const data = await response.json();
      setJob(data.job);
      setFormData(data.job);
      setSuccess("Job updated successfully!");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err: any) {
      console.error("Error updating job:", err);
      setError(err.message || "Failed to update job. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActiveStatus = async () => {
    if (!job) return;

    setToggling(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = job.active ? "deactivate" : "reactivate";
      const response = await fetch(`/api/manage/${editToken}/${endpoint}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to ${endpoint} job`);
      }

      const data = await response.json();
      setJob(prev => prev ? { ...prev, active: data.job.active } : null);
      setFormData(prev => ({ ...prev, active: data.job.active }));
      setSuccess(data.message);
      setTimeout(() => setSuccess(""), 5000);
    } catch (err: any) {
      console.error("Error toggling job status:", err);
      setError(err.message || "Failed to update job status. Please try again.");
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-earth-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-forest-light">Loading job details...</p>
        </div>
      </main>
    );
  }

  if (error && !job) {
    return (
      <main className="min-h-screen bg-earth-cream flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-forest mb-4">Error</h1>
          <p className="text-forest-light mb-6">{error}</p>
          <Link href="/" className="btn btn-primary">
            Go to Homepage
          </Link>
        </div>
      </main>
    );
  }

  if (!job) return null;

  const daysRemaining = Math.ceil((new Date(job.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysRemaining <= 0;

  return (
    <main className="min-h-screen bg-earth-cream py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-forest mb-2">
                Manage Your Job Posting
              </h1>
              <p className="text-forest-light">
                Edit details, track performance, and control visibility
              </p>
            </div>

            <Link
              href={`/jobs/${job.slug}`}
              target="_blank"
              className="btn bg-white border border-border hover:bg-gray-50 text-forest inline-flex items-center gap-2"
            >
              View Live Posting
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-forest">Views</h3>
            </div>
            <p className="text-3xl font-bold text-forest">{job.views}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-forest">Days Remaining</h3>
            </div>
            <p className="text-3xl font-bold text-forest">
              {isExpired ? "Expired" : daysRemaining}
            </p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              {job.active ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
              <h3 className="font-semibold text-forest">Status</h3>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-forest">
                {job.active ? "Active" : "Inactive"}
              </p>
              <button
                onClick={toggleActiveStatus}
                disabled={toggling || isExpired}
                className={`btn btn-sm ${
                  job.active
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                } flex items-center gap-2`}
              >
                {toggling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : job.active ? (
                  <>
                    <PowerOff className="w-4 h-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4" />
                    Reactivate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {isExpired && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800">
              <strong>Note:</strong> This job posting has expired. Contact support to renew your listing.
            </p>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="card p-6 md:p-8">
          <h2 className="text-2xl font-bold text-forest mb-6">Edit Job Details</h2>

          {/* Basic Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="input w-full"
                placeholder="e.g., Organic Farm Manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company || ""}
                onChange={(e) => handleInputChange("company", e.target.value)}
                className="input w-full"
                placeholder="e.g., Green Valley Farm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="input w-full"
                placeholder="e.g., Portland, OR"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Job Description *
              </label>
              <textarea
                required
                rows={8}
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="input w-full"
                placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity special..."
              />
            </div>

            {/* Salary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Min Salary
                </label>
                <input
                  type="number"
                  value={formData.salaryMin || ""}
                  onChange={(e) => handleInputChange("salaryMin", parseInt(e.target.value) || null)}
                  className="input w-full"
                  placeholder="30000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Max Salary
                </label>
                <input
                  type="number"
                  value={formData.salaryMax || ""}
                  onChange={(e) => handleInputChange("salaryMax", parseInt(e.target.value) || null)}
                  className="input w-full"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Type
                </label>
                <select
                  value={formData.salaryType || "annual"}
                  onChange={(e) => handleInputChange("salaryType", e.target.value)}
                  className="input w-full"
                >
                  <option value="annual">Annual</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Categories * (Max 3)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {JOB_CATEGORIES.map((cat) => (
                  <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData.categories || []).includes(cat.value)}
                      onChange={() => handleArrayToggle("categories", cat.value)}
                      disabled={(formData.categories?.length || 0) >= 3 && !(formData.categories || []).includes(cat.value)}
                      className="rounded text-primary"
                    />
                    <span className="text-sm text-forest">
                      {cat.emoji} {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Job Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {JOB_TYPES.map((type) => (
                  <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData.jobType || []).includes(type.value)}
                      onChange={() => handleArrayToggle("jobType", type.value)}
                      className="rounded text-primary"
                    />
                    <span className="text-sm text-forest">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Farm Type */}
            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Farm Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FARM_TYPES.map((type) => (
                  <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData.farmType || []).includes(type.value)}
                      onChange={() => handleArrayToggle("farmType", type.value)}
                      className="rounded text-primary"
                    />
                    <span className="text-sm text-forest">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Benefits
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {BENEFITS.map((benefit) => (
                  <label key={benefit.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData.benefits || []).includes(benefit.value)}
                      onChange={() => handleArrayToggle("benefits", benefit.value)}
                      className="rounded text-primary"
                    />
                    <span className="text-sm text-forest">
                      {benefit.emoji} {benefit.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Company Info */}
            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Company Email *
              </label>
              <input
                type="email"
                required
                value={formData.companyEmail || ""}
                onChange={(e) => handleInputChange("companyEmail", e.target.value)}
                className="input w-full"
                placeholder="contact@farm.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Company Website
              </label>
              <input
                type="url"
                value={formData.companyWebsite || ""}
                onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                className="input w-full"
                placeholder="https://yourfarm.com"
              />
            </div>

            {/* Application */}
            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Application URL
              </label>
              <input
                type="url"
                value={formData.applyUrl || ""}
                onChange={(e) => handleInputChange("applyUrl", e.target.value)}
                className="input w-full"
                placeholder="https://yourfarm.com/apply"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Application Email
              </label>
              <input
                type="email"
                value={formData.applyEmail || ""}
                onChange={(e) => handleInputChange("applyEmail", e.target.value)}
                className="input w-full"
                placeholder="jobs@farm.com"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-border">
            <button
              type="submit"
              disabled={saving || isExpired}
              className="btn btn-primary w-full md:w-auto flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-forest-light">
          <p>Posted {formatDate(new Date(job.createdAt))} • Last updated {formatDate(new Date(job.updatedAt))}</p>
          <p className="mt-2">Keep this link secure - it's your only way to manage this posting</p>
        </div>
      </div>
    </main>
  );
}
