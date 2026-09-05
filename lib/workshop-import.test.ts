import { describe, expect, it } from "vitest";
import { extractWorkshop } from "@/lib/workshop-import";
describe("Workshop imports", () => {
  it("extracts public event facts without inventing a registration destination or management email", () => {
    const html = `<script type="application/ld+json">${JSON.stringify({ "@graph": [{ "@type": "EducationEvent", name: "Practical propagation", description: "<p>Learn to grow cuttings.</p>", organizer: { name: "Teaching farm", url: "https://example.org" }, startDate: "2026-10-03T10:00:00-07:00", offers: { price: 65, priceCurrency: "USD", url: "javascript:alert(1)" } }] })}</script>`;
    const result = extractWorkshop(html, "https://example.org/course");
    expect(result.fields).toMatchObject({
      title: "Practical propagation",
      organization: "Teaching farm",
      tuitionCents: 6500,
      startAt: "2026-10-03T17:00:00.000Z",
    });
    expect(result.fields.managementEmail).toBeUndefined();
    expect(result.fields.registrationUrl).toBeUndefined();
    expect(result.warnings).toHaveLength(1);
  });
  it("does not assume a time zone or convert non-USD tuition", () => {
    const result = extractWorkshop(
      `<script type="application/ld+json">{"@type":"Event","name":"Workshop","startDate":"2026-10-03T10:00","offers":{"price":100,"priceCurrency":"CAD"}}</script>`,
      "https://example.org",
    );
    expect(result.fields.startAt).toBeUndefined();
    expect(result.fields.tuitionCents).toBeUndefined();
  });
  it("falls back to metadata and tolerates malformed structured data", () => {
    const result = extractWorkshop(
      `<title>Learn to grow</title><meta name="description" content="Practical growing lessons"><script type="application/ld+json">broken</script>`,
      "https://example.org",
    );
    expect(result.fields.title).toBe("Learn to grow");
    expect(result.fields.summary).toBe("Practical growing lessons");
  });
});
