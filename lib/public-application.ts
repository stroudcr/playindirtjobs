import "server-only";

const EMAIL_ADDRESS = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

export type PublicApplicationDestination = {
  url: URL;
  type: "url" | "email";
};

export function getPublicApplicationDestination(job: {
  applyUrl: string | null;
  applyEmail: string | null;
}): PublicApplicationDestination | null {
  if (job.applyUrl) {
    try {
      const url = new URL(job.applyUrl);
      if (
        (url.protocol === "http:" || url.protocol === "https:") &&
        !url.username &&
        !url.password
      ) {
        return { url, type: "url" };
      }
    } catch {
      // Fall through to a valid public application email when available.
    }
  }

  const email = job.applyEmail?.trim();
  if (
    email &&
    EMAIL_ADDRESS.test(email) &&
    !email.includes("\r") &&
    !email.includes("\n")
  ) {
    return { url: new URL(`mailto:${email}`), type: "email" };
  }

  return null;
}
