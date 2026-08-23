import type { Metadata } from "next";
import { ProvenancedText } from "@/components/content/provenanced-text";
import { experienceEntries } from "@/content/experience";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
      <ol className="mt-6 flex flex-col gap-8">
        {experienceEntries.map((entry) => (
          <li key={entry.id} className="border-l-2 border-slate-200 pl-4 dark:border-slate-800">
            <h2 className="text-lg font-semibold">
              <ProvenancedText field={entry.role} /> &middot; <ProvenancedText field={entry.organization} />
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <ProvenancedText field={entry.period} />
            </p>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              <ProvenancedText field={entry.summary} />
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
