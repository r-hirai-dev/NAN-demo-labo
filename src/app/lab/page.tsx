import type { Metadata } from "next";

export const metadata: Metadata = { title: "Lab" };

export default function LabPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Lab</h1>
      <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
        This page will link to public Architecture views and selected engineering notes once that
        content is approved and published (see the Lab-related Stories under EPIC-002 and
        EPIC-003 in the delivery roadmap). It intentionally carries no links yet.
      </p>
    </div>
  );
}
