import Script from "next/script";

export function GoogleAnalytics({
  sendPageView = true,
  loadStrategy = "lazyOnload",
}: {
  sendPageView?: boolean;
  loadStrategy?: "afterInteractive" | "lazyOnload";
}) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) {
    return null;
  }

  return (
    <>
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){window.dataLayer.push(arguments);}
            window.gtag('js', new Date());
            window.gtag('config', ${JSON.stringify(measurementId)}, { send_page_view: ${sendPageView} });
          `,
        }}
      />
      <Script
        strategy={loadStrategy}
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
      />
    </>
  );
}
