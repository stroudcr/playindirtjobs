import { Suspense } from "react";

import { PostJobWizard } from "@/components/PostJobWizard";

export default function PostJobPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-earth-cream py-12">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="card h-72 animate-pulse bg-white" />
          </div>
        </main>
      }
    >
      <PostJobWizard />
    </Suspense>
  );
}
