import { GoogleAuth } from "google-auth-library";

export type GoogleIndexingNotificationType = "URL_UPDATED" | "URL_DELETED";

const INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing";
const INDEXING_ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const DEFAULT_INDEXING_SITE_URL = "https://www.playindirtjobs.com";

function getJobUrl(slug: string) {
  const siteUrl = process.env.GOOGLE_INDEXING_SITE_URL || DEFAULT_INDEXING_SITE_URL;
  const baseUrl = new URL(siteUrl);

  if (baseUrl.protocol !== "https:") {
    throw new Error("GOOGLE_INDEXING_SITE_URL must use HTTPS");
  }

  return new URL(`/jobs/${slug}`, baseUrl).toString();
}

function getCredentials() {
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    return null;
  }

  return {
    client_email: clientEmail,
    private_key: privateKey,
  };
}

export function isGoogleIndexingConfigured() {
  return getCredentials() !== null;
}

export async function notifyGoogleAboutJob(
  slug: string,
  type: GoogleIndexingNotificationType
) {
  const credentials = getCredentials();

  if (!credentials) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "Google Indexing API notification skipped because credentials are not configured"
      );
    }
    return { sent: false, reason: "not-configured" as const };
  }

  try {
    const url = getJobUrl(slug);
    const auth = new GoogleAuth({
      credentials,
      scopes: [INDEXING_SCOPE],
    });
    const client = await auth.getClient();

    await client.request({
      url: INDEXING_ENDPOINT,
      method: "POST",
      data: { url, type },
    });

    console.info("Google Indexing API notification sent", { url, type });
    return { sent: true, url, type } as const;
  } catch (error) {
    const url = `${process.env.GOOGLE_INDEXING_SITE_URL || DEFAULT_INDEXING_SITE_URL}/jobs/${slug}`;
    console.error("Google Indexing API notification failed", { url, type, error });
    return { sent: false, reason: "request-failed" as const, url, type };
  }
}

export async function notifyGoogleAboutJobs(
  slugs: string[],
  type: GoogleIndexingNotificationType
) {
  const results = [];

  for (const slug of slugs) {
    results.push(await notifyGoogleAboutJob(slug, type));
  }

  return results;
}
