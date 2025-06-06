/**
 * buildSimdGitbook.ts
 *
 * A TypeScript script that:
 * 1. Clones/updates the solana-improvement-documents repo locally.
 * 2. Parses accepted SIMDs from main.
 * 3. Fetches open PRs to identify proposed SIMDs.
 * 4. Generates a "docs" folder structured for GitBook.
 */

import { Octokit } from "octokit";
import 'dotenv/config';
import simpleGit, { SimpleGit } from "simple-git";
import fs from "fs-extra";
import path from "path";
import matter from "gray-matter";

interface SimdMetadata {
  simd?: string;
  title?: string;
  status?: string;
  githubLink?: string;
  [key: string]: any; // For any other fields
}

interface SimdData {
  metadata: SimdMetadata;
  content: string;
}

interface ProposedSimdData extends SimdData {
  prNumber: number;
  filePath: string; // original path in the PR
}

// ----------------------
// Configuration
// ----------------------
const REPO_OWNER = "solana-foundation";
const REPO_NAME = "solana-improvement-documents";
const CLONE_DIR = path.resolve("local-simd-repo");
const PROPOSALS_DIR = "proposals";
const OUTPUT_DIR = path.resolve("docs"); // final GitBook docs output

// Custom sort order for statuses (optional)
const CUSTOM_STATUS_ORDER = [
  "Activated",
  "Implemented",
  "Accepted",
  "Living",
  "Stagnant",
  "Withdrawn",
  "Review",
  "Draft",
];

// Use an environment variable for GitHub token (recommended) or hardcode for demo
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
console.log("GITHUB_TOKEN", GITHUB_TOKEN);
// GitHub repo HTTPS URL
const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}.git`;

// ----------------------
// Helper functions
// ----------------------

/**
 * Clone or update the local repository using simple-git.
 */
async function cloneOrUpdateRepo(): Promise<void> {
  if (!fs.existsSync(CLONE_DIR)) {
    console.log(`Cloning repo into: ${CLONE_DIR}`);
    const git: SimpleGit = simpleGit();
    await git.clone(REPO_URL, CLONE_DIR);
  } else {
    console.log(`Pulling latest changes in: ${CLONE_DIR}`);
    const git: SimpleGit = simpleGit(CLONE_DIR);
    // Make sure we are on main
    await git.checkout("main");
    await git.pull("origin", "main");
  }
}

/**
 * Parse a single .md file to extract front matter and content using gray-matter.
 */
function parseSimdMarkdown(fullPath: string): SimdData | null {
  try {
    const raw = fs.readFileSync(fullPath, "utf-8");
    const parsed = matter(raw);
    const metadata = parsed.data as SimdMetadata;
    const content = parsed.content;
    return { metadata, content };
  } catch (err) {
    console.error(`Error parsing ${fullPath}:`, err);
    return null;
  }
}

/**
 * Recursively gather all .md files from "proposals/" in the local repo.
 */
function getAcceptedSimdFiles(): string[] {
  const proposalsPath = path.join(CLONE_DIR, PROPOSALS_DIR);
  if (!fs.existsSync(proposalsPath)) {
    return [];
  }
  return fs
    .readdirSync(proposalsPath)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(proposalsPath, file));
}

// ----------------------
// Fetch PRs and parse changed .md files
// ----------------------

/**
 * Return all open PRs from the repository.
 */
async function getOpenPRs() {
  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  const { data } = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
    owner: REPO_OWNER,
    repo: REPO_NAME,
    state: "open",
    per_page: 100,
  });
  return data; // array of PRs
}

/**
 * For a given PR number, fetch the list of changed files, filter to .md under proposals/.
 */
async function getChangedFilesForPR(prNumber: number): Promise<ProposedSimdData[]> {
  const octokit = new Octokit({ auth: GITHUB_TOKEN });
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number: prNumber,
      per_page: 100,
    }
  );

  const results: ProposedSimdData[] = [];
  for (const fileInfo of data) {
    const filename = fileInfo.filename;
    if (
      filename.startsWith(PROPOSALS_DIR) &&
      filename.endsWith(".md") &&
      fileInfo.raw_url
    ) {
      // Download the raw content
      const rawContentRes = await fetch(fileInfo.raw_url, {
        headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {},
      });
      const rawContent = await rawContentRes.text();

      // Use try/catch for gray-matter
      try {
        const parsed = matter(rawContent);
        const metadata = parsed.data as SimdMetadata;
        const content = parsed.content;

        const simdData: ProposedSimdData = {
          prNumber,
          filePath: filename,
          metadata,
          content,
        };
        results.push(simdData);
      } catch (parseErr) {
        console.warn(
          `Skipping invalid YAML front matter in PR #${prNumber}, file: ${filename}`,
          parseErr
        );
        // Just skip, don't push to results
      }
    }
  }

  return results;
}

// ----------------------
// Build GitBook structure
// ----------------------

/**
 * Build the folder structure under "docs/" for accepted and proposed SIMDs.
 */
async function buildGitBookStructure(
  acceptedSimds: SimdData[],
  proposedSimds: ProposedSimdData[]
) {
  // 1. Clean up or create docs/ folder
  if (fs.existsSync(OUTPUT_DIR)) {
    await fs.remove(OUTPUT_DIR);
  }
  await fs.mkdir(OUTPUT_DIR);

  // ----------------
  // Use SIMD-1 as the mainReadme if available
  // ----------------
  let mainReadme = `# Solana Improvement Documents (SIMDs)

This site is auto-generated to display:

- **Accepted SIMDs** (on \`main\` branch)
- **Proposed SIMDs** (currently in open PRs)

Navigate via the left sidebar or the sections below.
`;
  const simd1 = acceptedSimds.find((s) => s.metadata.simd === "0001");
  if (simd1) {
    console.log("Using SIMD-1 content as the main README...");
    // We only use the Markdown body (ignoring the front matter from SIMD-1)
    mainReadme = simd1.content;
  } else {
    console.warn(
      "SIMD-0001 not found among accepted SIMDs. Falling back to the default main README content."
    );
  }

  // Write main README
  await fs.writeFile(path.join(OUTPUT_DIR, "README.md"), mainReadme, "utf-8");

  // 2. Accepted
  const acceptedRoot = path.join(OUTPUT_DIR, "accepted");
  await fs.mkdir(acceptedRoot);

  // Group accepted by `status`
  const acceptedByStatus: Record<string, SimdData[]> = {};
  for (const simd of acceptedSimds) {
    const status = simd.metadata.status || "Unknown";
    if (!acceptedByStatus[status]) {
      acceptedByStatus[status] = [];
    }
    acceptedByStatus[status].push(simd);
  }

  // For each status, create a subfolder and place each SIMD as a .md
  // Also add a 'githubLink' to the metadata pointing to the main-branch file
  // Then prepend a link at the top of the Markdown content.
  for (const [status, simds] of Object.entries(acceptedByStatus)) {
    const safeStatus = status.replace(/[^a-zA-Z0-9_-]/g, "_"); // sanitize folder name
    const statusFolder = path.join(acceptedRoot, safeStatus);
    await fs.mkdir(statusFolder);

    for (const simd of simds) {
      const simdNum = simd.metadata.simd || "XXXX";
      const simdFilename = `SIMD-${simdNum}.md`;
      const fullPath = path.join(statusFolder, simdFilename);

      // IMPORTANT: Derive the real file name from the proposals directory
      // so we don't accidentally create a link like "0009-anything.md".
      // In other words, find the original file from the acceptedSimdFiles array:
      // We'll store the baseName so we can create the correct link on GitHub.
      // (Alternatively, you could store this in parseSimdMarkdown, but here is a simple approach.)
      const originalMdFileName = findOriginalFileName(simdNum);

      // Build GitHub link for the main-branch proposal file
      const mainBranchUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/main/proposals/${originalMdFileName}`;
      simd.metadata.githubLink = mainBranchUrl;

      // Insert a link at the top of the file's content
      const githubLinkLine = `[View on GitHub](${mainBranchUrl})\n\n`;
      const newContent = githubLinkLine + simd.content;

      // Now embed the link in front matter
      const frontMatter = matter.stringify(newContent, simd.metadata);
      await fs.writeFile(fullPath, frontMatter, "utf-8");
    }
  }

  // 3. Proposed
  const proposedRoot = path.join(OUTPUT_DIR, "proposed");
  await fs.mkdir(proposedRoot);

  // Sort proposed SIMDs by descending SIMD number
  const allProposedSorted = proposedSimds.slice().sort((a, b) => {
    const aNum = parseInt(a.metadata.simd || "0", 10);
    const bNum = parseInt(b.metadata.simd || "0", 10);
    // Descending order
    return bNum - aNum;
  });

  // Write each proposed SIMD
  for (const simd of allProposedSorted) {
    const simdNum = simd.metadata.simd || "PR";
    const simdTitle = simd.metadata.title || "";
    const simdFilename = `SIMD-${simdNum}-PR${simd.prNumber}.md`;
    const fullPath = path.join(proposedRoot, simdFilename);

    // Add a 'githubLink' that points to the PR
    const prUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/${simd.prNumber}`;
    simd.metadata.githubLink = prUrl;

    // Insert a link at the top of the content
    const githubLinkLine = `[View on GitHub](${prUrl})\n\n`;
    const newContent = githubLinkLine + simd.content;

    const frontMatter = matter.stringify(newContent, simd.metadata);
    await fs.writeFile(fullPath, frontMatter, "utf-8");
  }

  // 4. Create SUMMARY.md for GitBook navigation
  const summaryLines: string[] = [
    "# Summary",
    "* [SIMDs Overview](README.md)",
    "## Accepted SIMDs",
  ];

  // Sort statuses via custom order (optional)
  const sortedStatuses = Object.keys(acceptedByStatus).sort((a, b) => {
    const indexA = CUSTOM_STATUS_ORDER.indexOf(a);
    const indexB = CUSTOM_STATUS_ORDER.indexOf(b);
    const rankA = indexA === -1 ? 9999 : indexA;
    const rankB = indexB === -1 ? 9999 : indexB;
    return rankA - rankB;
  });

  for (const status of sortedStatuses) {
    summaryLines.push(`  * ${status}`);
    const simds = acceptedByStatus[status];
    // Sort each status category by SIMD number (ascending)
    const sortedSimds = simds.sort((a, b) => {
      const aNum = parseInt(a.metadata.simd || "999999", 10);
      const bNum = parseInt(b.metadata.simd || "999999", 10);
      return aNum - bNum;
    });
    for (const simd of sortedSimds) {
      const simdNum = simd.metadata.simd || "XXXX";
      const simdTitle = simd.metadata.title || "";
      const safeStatus = status.replace(/[^a-zA-Z0-9_-]/g, "_");
      summaryLines.push(
        `    * [SIMD-${simdNum} - ${simdTitle}](accepted/${safeStatus}/SIMD-${simdNum}.md)`
      );
    }
  }

  // Proposed SIMDs: single list (descending order)
  summaryLines.push("## Proposed SIMDs");
  for (const simd of allProposedSorted) {
    const simdNum = simd.metadata.simd || "PR";
    const simdTitle = simd.metadata.title || "";
    const prNumber = simd.prNumber;
    summaryLines.push(
      `  * [SIMD-${simdNum} - ${simdTitle}](proposed/SIMD-${simdNum}-PR${prNumber}.md)`
    );
  }

  const summaryContent = summaryLines.join("\n");
  await fs.writeFile(path.join(OUTPUT_DIR, "SUMMARY.md"), summaryContent, "utf-8");

  console.log(`GitBook structure has been built in ${OUTPUT_DIR}/`);
}

/**
 * Finds the original file name (e.g. "0009-lockout-violation-detection.md")
 * by searching in the local proposals directory for a file whose numeric prefix
 * matches the SIMD number from front matter.
 */
function findOriginalFileName(simdNumber: string): string {
  // For example, if `simdNumber` is '0009', we look for a file that starts with '0009-'
  // or exactly "0009.md" (some SIMDs might not follow the dash naming convention).
  const proposalsPath = path.join(CLONE_DIR, PROPOSALS_DIR);
  const files = fs.readdirSync(proposalsPath);

  // Match either "0009-" or "0009.md" (some edge-case might be "0009-whatever.md").
  // This ensures we pick up the actual file name instead of forcing "-anything.md".
  const pattern = new RegExp(`^${simdNumber}(?:-|\\.)`);
  const matched = files.find((f) => f.match(pattern));
  if (!matched) {
    // fallback in case we can't find something
    // use a default pattern
    return `${simdNumber}-proposal.md`;
  }
  return matched;
}

// ----------------------
// Main Entrypoint
// ----------------------
async function main() {
  try {
    console.log("1) Clone or update the repo...");
    await cloneOrUpdateRepo();

    console.log("2) Parse accepted SIMDs from main...");
    const acceptedSimdFiles = getAcceptedSimdFiles();
    const acceptedSimds: SimdData[] = [];
    for (const file of acceptedSimdFiles) {
      try {
        console.log(`Parsing file: ${file}`);
        const data = parseSimdMarkdown(file);
        if (data) acceptedSimds.push(data);
      } catch (err) {
        console.warn(`Skipping invalid file: ${file}`, err);
      }
    }

    console.log("3) Fetch open PRs to identify proposed SIMDs...");
    const openPRs = await getOpenPRs();
    const proposedSimds: ProposedSimdData[] = [];
    for (const pr of openPRs) {
      const changed = await getChangedFilesForPR(pr.number);
      proposedSimds.push(...changed);
    }

    console.log("4) Build GitBook structure in docs/...");
    await buildGitBookStructure(acceptedSimds, proposedSimds);

    console.log("Done! You can now point GitBook to 'docs/' folder.");
  } catch (error) {
    console.error("Error in main:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
