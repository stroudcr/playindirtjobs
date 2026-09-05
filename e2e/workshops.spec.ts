import { test, expect } from "@playwright/test";

test("workshops browse, location filters and empty results work", async ({
  page,
}) => {
  await page.goto("/workshops");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Learn skills you can put to work.",
  );
  await expect(page.locator("article")).toHaveCount(10);
  await expect(
    page.getByText("Complimentary listing", { exact: true }),
  ).toHaveCount(10);
  await page.getByLabel("In-person location").selectOption("WA");
  await page.getByRole("button", { name: "Find classes" }).click();
  await expect(page.locator("article")).toHaveCount(2);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await page.getByLabel("Search classes").fill("a nonexistent class 123");
  await page.getByRole("button", { name: "Find classes" }).click();
  await expect(
    page.getByRole("heading", { name: "Room for something new." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "See all workshops" }).click();
  await expect(page.locator("article")).toHaveCount(10);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("course details show real tuition, registration destination and course schema", async ({
  page,
}) => {
  await page.goto(
    "/workshops/organic-nutrient-management-vegetables-oregon-state",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Organic Nutrient Management for Vegetable Production",
  );
  await expect(
    page.locator("aside").getByText("$25", { exact: true }),
  ).toBeVisible();
  const registration = page.getByRole("link", {
    name: "Register with organizer",
  });
  await expect(registration).toHaveAttribute(
    "href",
    "https://workspace.oregonstate.edu/course/organic-nutrient-management-for-vegetable-production",
  );
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const course = schemas
    .map((value) => JSON.parse(value))
    .find((value) => value["@type"] === "Course");
  expect(course.provider.name).toBe("Oregon State University");
  expect(course.offers.price).toBe(25);
  expect(schemas.join("")).not.toContain('"@type":"JobPosting"');
  expect(schemas.join("")).not.toContain("editToken");
  expect(schemas.join("")).not.toContain("managementEmail");
  await expect(
    page.getByText(/PlayInDirtJobs gifted this first listing/),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("organizer can import, save, preview and proceed to $15 checkout without an account", async ({
  page,
}) => {
  await page.route("**/api/workshops/import", (route) =>
    route.fulfill({
      json: {
        fields: {
          title: "Hands-on propagation workshop",
          summary:
            "Learn practical propagation techniques with a working nursery grower.",
          description:
            "Spend a practical session exploring how to start new plants from cuttings and divisions. Work through demonstrations and take home a clear understanding of the growing conditions that help young plants establish.",
          organization: "Example Teaching Nursery",
          tuitionCents: 6500,
        },
        warnings: [],
      },
    }),
  );
  let checkout: Record<string, unknown> | undefined;
  await page.route("**/api/workshops/checkout", async (route) => {
    checkout = route.request().postDataJSON();
    await route.fulfill({
      json: { url: "https://checkout.stripe.com/c/pay/test-workshop" },
    });
  });
  await page.route("https://checkout.stripe.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<h1>Stripe checkout test destination</h1>",
    }),
  );
  await page.goto("/post-workshop");
  await page
    .getByLabel("Already have a course page?")
    .fill("https://example.org/propagation");
  await page.getByRole("button", { name: "Import details" }).click();
  await expect(page.getByLabel("Workshop or course title")).toHaveValue(
    "Hands-on propagation workshop",
  );
  await page.getByLabel("Learning format").selectOption("self-paced");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByLabel("What participants will learn")
    .fill(
      "Prepare healthy cuttings for propagation.\nChoose conditions for rooting and plant establishment.",
    );
  await page
    .getByLabel("Who is it for?")
    .fill("Beginning gardeners and aspiring nursery workers.");
  await expect(page.getByLabel("Attendee price (USD)")).toHaveValue("65");
  await expect(page.getByText("Saved on this device")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("What participants will learn")).toHaveValue(
    /Prepare healthy cuttings/,
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Your management email").fill("owner@example.org");
  await page
    .getByLabel("Where should people register?")
    .fill("https://example.org/enroll");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Hands-on propagation workshop" }),
  ).toBeVisible();
  await expect(page.getByText("$65 tuition")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Pay $15 & submit listing" }),
  ).toBeDisabled();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Pay $15 & submit listing" }).click();
  await expect(
    page.getByRole("heading", { name: "Stripe checkout test destination" }),
  ).toBeVisible();
  expect(checkout).toMatchObject({
    reviewed: true,
    workshop: {
      title: "Hands-on propagation workshop",
      tuitionCents: 6500,
      format: "self-paced",
      startAt: null,
      registrationUrl: "https://example.org/enroll",
    },
  });
  expect(checkout).not.toHaveProperty("amount");
});

test("workshop sitemap is public and management/admin access stays private", async ({
  request,
  baseURL,
}) => {
  const response = await request.get("/sitemaps/workshops.xml");
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  expect((xml.match(/<url>/g) || []).length).toBe(10);
  expect(xml).not.toContain("/manage/");
  const privateResponse = await request.get(
    "/manage/workshops/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  );
  expect(privateResponse.status()).toBe(404);
  expect(privateResponse.headers()["x-robots-tag"]).toContain("noindex");
  expect(privateResponse.headers()["referrer-policy"]).toBe("no-referrer");
  const mutation = await request.post("/api/admin/workshops/invalid", {
    headers: { origin: new URL(baseURL || "http://127.0.0.1:3100").origin },
    data: { action: "approve" },
  });
  expect([401, 403]).toContain(mutation.status());
});
