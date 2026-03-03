"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <main
          style={{
            minHeight: "100vh",
            backgroundColor: "#fafaf8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", padding: "0 1rem" }}>
            <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>🌿</div>
            <h1
              style={{
                fontSize: "2rem",
                color: "#1a2e1a",
                marginBottom: "1rem",
              }}
            >
              Something Went Wrong
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#4a5e4a",
                marginBottom: "2rem",
                maxWidth: "28rem",
                margin: "0 auto 2rem",
              }}
            >
              We hit an unexpected issue. Please try again or head back to the homepage.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={reset}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "white",
                  color: "#1a2e1a",
                  border: "1px solid #e5e5e5",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Go Home
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
