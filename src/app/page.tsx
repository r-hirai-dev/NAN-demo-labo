import type { Metadata } from "next";
import { ProvenancedText } from "@/components/content/provenanced-text";
import { profile } from "@/content/profile";
import { skillCategories } from "@/content/skills";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="home-heading">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Personal Engineering Lab
        </p>
        <h1 id="home-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          <ProvenancedText field={profile.handle} />
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          <ProvenancedText field={profile.tagline} />
        </p>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
          <ProvenancedText field={profile.introduction} />
        </p>
      </section>

      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="text-xl font-semibold">
          Skills
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {skillCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
            >
              <h3 className="font-medium">
                <ProvenancedText field={category.category} />
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {category.items.map((item, index) => (
                  <li
                    key={index}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800"
                  >
                    <ProvenancedText field={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
