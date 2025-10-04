// Job categories with emoji icons (solarpunk themed)
export const JOB_CATEGORIES = [
  { id: "farm-hand", label: "Farm Hand", emoji: "🌾" },
  { id: "gardener", label: "Gardener", emoji: "🌱" },
  { id: "ranch-hand", label: "Ranch Hand", emoji: "🐄" },
  { id: "agricultural-tech", label: "Agricultural Tech", emoji: "🚜" },
  { id: "permaculture", label: "Permaculture", emoji: "🌻" },
  { id: "farm-manager", label: "Farm Manager", emoji: "👨‍🌾" },
  { id: "livestock-care", label: "Livestock Care", emoji: "🐓" },
  { id: "harvest-worker", label: "Harvest Worker", emoji: "🥕" },
  { id: "nursery-worker", label: "Nursery Worker", emoji: "🪴" },
  { id: "apiculture", label: "Apiculture", emoji: "🐝" },
  { id: "viticulture", label: "Viticulture", emoji: "🍇" },
  { id: "aquaponics", label: "Aquaponics", emoji: "🐟" },
] as const;

// Job types
export const JOB_TYPES = [
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "seasonal", label: "Seasonal" },
  { id: "temporary", label: "Temporary" },
  { id: "apprenticeship", label: "Apprenticeship" },
  { id: "internship", label: "Internship" },
  { id: "contract", label: "Contract" },
] as const;

// Farm types
export const FARM_TYPES = [
  { id: "organic", label: "Organic", emoji: "🌿" },
  { id: "conventional", label: "Conventional", emoji: "🌾" },
  { id: "permaculture", label: "Permaculture", emoji: "♻️" },
  { id: "regenerative", label: "Regenerative", emoji: "🌍" },
  { id: "biodynamic", label: "Biodynamic", emoji: "🌙" },
  { id: "csa", label: "CSA", emoji: "🥬" },
  { id: "small-scale", label: "Small-scale", emoji: "🏡" },
  { id: "large-scale", label: "Large-scale", emoji: "🏭" },
] as const;

// Benefits
export const BENEFITS = [
  { id: "housing", label: "Housing Included", emoji: "🏠" },
  { id: "meals", label: "Meals Provided", emoji: "🍽️" },
  { id: "equipment", label: "Equipment Provided", emoji: "🛠️" },
  { id: "learning", label: "Learning Opportunities", emoji: "📚" },
  { id: "profit-sharing", label: "Profit Sharing", emoji: "💰" },
  { id: "health-insurance", label: "Health Insurance", emoji: "🏥" },
  { id: "flexible-hours", label: "Flexible Hours", emoji: "⏰" },
  { id: "transportation", label: "Transportation", emoji: "🚗" },
] as const;

// Tags
export const TAGS = [
  { id: "sustainable", label: "Sustainable" },
  { id: "animal-care", label: "Animal Care" },
  { id: "crop-production", label: "Crop Production" },
  { id: "machinery", label: "Machinery" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
  { id: "education", label: "Education" },
  { id: "processing", label: "Processing" },
  { id: "greenhouse", label: "Greenhouse" },
  { id: "outdoor", label: "Outdoor" },
  { id: "physical", label: "Physical Work" },
  { id: "beginner-friendly", label: "Beginner Friendly" },
] as const;

// Sort options
export const SORT_OPTIONS = [
  { id: "latest", label: "Latest" },
  { id: "highest-paid", label: "Highest Paid" },
  { id: "most-viewed", label: "Most Viewed" },
] as const;

// Pricing (in cents)
export const PRICING = {
  BASIC: 9900, // $99
  FEATURED: 24900, // $249
  BUNDLE_5: 39900, // $399 (save $96)
} as const;
