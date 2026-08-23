import type { Metadata } from "next";
import { ProvenancedLink } from "@/components/content/provenanced-link";
import { ProvenancedText } from "@/components/content/provenanced-text";
import { projectEntries } from "@/content/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2">
        {projectEntries.map((project) => (
          <li
            key={project.id}
            className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
          >
            <h2 className="font-semibold">
              <ProvenancedText field={project.name} />
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              <ProvenancedText field={project.summary} />
            </p>
            <p className="mt-3 text-sm">
              <ProvenancedLink field={project.href}>View project</ProvenancedLink>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
