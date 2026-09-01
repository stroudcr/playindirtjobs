import { SENSITIVE_ANALYTICS_ROOTS } from "@/lib/analytics-paths";

export function AnalyticsPrivacyGuard() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) return null;

  const script = `
    (function () {
      var measurementId = ${JSON.stringify(measurementId)};
      var roots = ${JSON.stringify(SENSITIVE_ANALYTICS_ROOTS)};
      var disableKey = "ga-disable-" + measurementId;
      var isSensitive = function (value) {
        try {
          var pathname = new URL(value || window.location.href, window.location.href).pathname;
          return roots.some(function (root) {
            return pathname === root || pathname.indexOf(root + "/") === 0;
          });
        } catch (_) {
          return true;
        }
      };
      var applyGuard = function (value) {
        window[disableKey] = isSensitive(value);
      };

      applyGuard(window.location.href);
      ["pushState", "replaceState"].forEach(function (method) {
        var original = window.history[method];
        window.history[method] = function () {
          if (arguments.length > 2 && arguments[2] != null) applyGuard(arguments[2]);
          return original.apply(this, arguments);
        };
      });
      window.addEventListener("popstate", function () {
        applyGuard(window.location.href);
      }, true);
    })();
  `;

  return (
    <script
      id="analytics-route-privacy-guard"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
