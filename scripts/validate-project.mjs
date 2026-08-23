import { access, readFile } from "node:fs/promises";
import process from "node:process";

const ROOT_URL = new URL("../", import.meta.url);
const REQUIRED_PUBLIC_FILES = [
  ".gitignore",
  "README.md",
  "package.json",
  "docs/repository-publication-policy.md",
  "docs/product/mvp.md",
  "docs/architecture/overview.md",
  "docs/adr/README.md",
  "docs/adr/0001-static-first-aws-hosting.md",
  "docs/delivery/roadmap.md",
];
const REQUIRED_PRIVATE_PATTERNS = [
  "/.local/",
  "/AGENTS.md",
  "/CLAUDE.md",
  ".env",
  "*.tfstate",
  "*.tfvars",
];

const errors = [];
for (const path of REQUIRED_PUBLIC_FILES) {
  try {
    await access(new URL(path, ROOT_URL));
  } catch {
    errors.push(`missing required public file: ${path}`);
  }
}

const ignoreRules = new Set(
  (await readFile(new URL(".gitignore", ROOT_URL), "utf8"))
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
);
for (const pattern of REQUIRED_PRIVATE_PATTERNS) {
  if (!ignoreRules.has(pattern)) errors.push(`missing required ignore rule: ${pattern}`);
}

if (errors.length > 0) {
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Project validation passed (${REQUIRED_PUBLIC_FILES.length} public files, ${REQUIRED_PRIVATE_PATTERNS.length} privacy rules).`
  );
}
