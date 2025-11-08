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
  { id: "marketing", label: "Marketing", emoji: "📢" },
  { id: "retail", label: "Retail", emoji: "🛒" },
  { id: "kitchen", label: "Kitchen", emoji: "🍳" },
  { id: "other", label: "Other", emoji: "✨" },
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
  { id: "agritourism", label: "Agritourism", emoji: "🏞️" },
  { id: "organic", label: "Organic", emoji: "🌿" },
  { id: "conventional", label: "Conventional", emoji: "🌾" },
  { id: "permaculture", label: "Permaculture", emoji: "♻️" },
  { id: "regenerative", label: "Regenerative", emoji: "🌍" },
  { id: "biodynamic", label: "Biodynamic", emoji: "🌙" },
  { id: "csa", label: "CSA", emoji: "🥬" },
  { id: "garden", label: "Garden", emoji: "🌺" },
  { id: "ranch", label: "Ranch", emoji: "🤠" },
  { id: "small-scale", label: "Small-scale", emoji: "🏡" },
  { id: "large-scale", label: "Large-scale", emoji: "🗺️" },
  { id: "indoor", label: "Indoor", emoji: "🏢" },
  { id: "other", label: "Other", emoji: "✨" },
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

// US States for location dropdown
export const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
] as const;

// State helper functions for SEO-friendly URLs and data normalization
export function getStateName(input: string): string {
  const state = US_STATES.find(
    (s) => s.code.toLowerCase() === input.toLowerCase() ||
           s.name.toLowerCase() === input.toLowerCase()
  );
  return state?.name || input;
}

export function getStateCode(input: string): string {
  const state = US_STATES.find(
    (s) => s.code.toLowerCase() === input.toLowerCase() ||
           s.name.toLowerCase() === input.toLowerCase()
  );
  return state?.code || input;
}

export function getStateSlug(input: string): string {
  const stateName = getStateName(input);
  return stateName.toLowerCase().replace(/\s+/g, '-');
}

export function getStateFromSlug(slug: string): { code: string; name: string } | null {
  const name = slug.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const state = US_STATES.find(s => s.name.toLowerCase() === name.toLowerCase());
  return state ? { code: state.code, name: state.name } : null;
}

// Get only the 50 states (excluding DC)
export const US_STATES_WITHOUT_DC = US_STATES.filter(state => state.code !== 'DC');

// Pricing (in cents)
export const PRICING = {
  BASIC: 500, // $5
  FEATURED: 1500, // $15
  BUNDLE_5: 19900, // $199 (save $26)
} as const;
