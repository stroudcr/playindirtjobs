import { describe, expect, it } from "vitest";

import { verifyClaimDomain } from "./domain-verification";

describe("verifyClaimDomain", () => {
  it("approves matching registrable work and company domains", () => {
    const result = verifyClaimDomain({
      workEmail: "hiring@greenhouse.example.com",
      companyWebsite: "https://www.example.com/about",
      applyUrl: null,
    });

    expect(result.autoApprove).toBe(true);
    expect(result.evidence.matchedSource).toBe("companyWebsite");
    expect(result.evidence.matchedDomain).toBe("example.com");
  });

  it("can match the employer application URL", () => {
    const result = verifyClaimDomain({
      workEmail: "jobs@orchard.co.uk",
      companyWebsite: null,
      applyUrl: "https://careers.orchard.co.uk/openings/12",
    });

    expect(result.autoApprove).toBe(true);
    expect(result.evidence.matchedDomain).toBe("orchard.co.uk");
  });

  it("never approves a public email provider", () => {
    const result = verifyClaimDomain({
      workEmail: "owner@gmail.com",
      companyWebsite: "https://gmail.com",
      applyUrl: null,
    });

    expect(result.autoApprove).toBe(false);
    expect(result.evidence.publicEmailProvider).toBe(true);
  });

  it("recognizes country-specific public email provider domains", () => {
    const result = verifyClaimDomain({
      workEmail: "owner@yahoo.fr",
      companyWebsite: "https://yahoo.fr",
      applyUrl: null,
    });

    expect(result.autoApprove).toBe(false);
    expect(result.evidence.publicEmailProvider).toBe(true);
  });

  it("leaves mismatches and invalid URLs for review", () => {
    const result = verifyClaimDomain({
      workEmail: "hiring@farm.example",
      companyWebsite: "not a url",
      applyUrl: "https://third-party-jobs.com/role",
    });

    expect(result.autoApprove).toBe(false);
    expect(result.evidence.matchedDomain).toBeNull();
  });
});
