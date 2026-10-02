const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname);
const README_PATH = path.join(ROOT, "README.md");
const REPO_OWNER = "jesuscc1993";
const REPO_NAME = "user-css";
const MAIN_REPO_BRANCH = "develop";

const isExcluded = (name) => name.startsWith(".") || name.startsWith("_");

const getSubDirectories = (dirPath) =>
  fs
    .readdirSync(dirPath)
    .filter((name) => !isExcluded(name))
    .filter((name) => fs.statSync(path.join(dirPath, name)).isDirectory());

const getRawUrl = (site, project) =>
  `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/refs/heads/${MAIN_REPO_BRANCH}/${site}/${project}/${project}.user.css`;

const getInstallBadge = (site, project) =>
  `[![Install style](https://img.shields.io/badge/Install-style-0c73b8.svg)](${getRawUrl(site, project)})`;

const findSiteProjects = (dir, relPath) =>
  getSubDirectories(dir).flatMap((name) => {
    const subDir = path.join(dir, name);
    return fs.existsSync(path.join(subDir, `${name}.user.css`))
      ? [{ site: relPath, project: name }]
      : findSiteProjects(subDir, relPath ? `${relPath}/${name}` : name);
  });

const getSites = () => {
  const bySite = new Map();

  for (const { site, project } of findSiteProjects(ROOT, "")) {
    if (!bySite.has(site)) {
      bySite.set(site, []);
    }
    bySite.get(site).push(project);
  }

  return [...bySite.entries()]
    .map(([site, projects]) => ({ site, projects: projects.sort() }))
    .sort((a, b) => a.site.localeCompare(b.site));
};

const buildTable = (sites) => {
  const columns = ["Site", "Style", "Install"];

  const rows = sites.map(({ site, projects }) => [
    `[${site}](${site})`,
    projects.map((project) => `[${project}](${site}/${project})`).join("<br>"),
    projects.map((project) => getInstallBadge(site, project)).join("<br>"),
  ]);

  const widths = columns.map((column, index) =>
    Math.max(column.length, ...rows.map((row) => row[index].length)),
  );

  const buildLine = (cells) =>
    `| ${cells.map((cell, index) => cell.padEnd(widths[index])).join(" | ")} |`;

  const header = buildLine(columns);
  const separator = buildLine(widths.map((width) => "-".repeat(width)));
  const body = rows.map(buildLine);

  return [header, separator, ...body].join("\n");
};

const updateReadme = () => {
  const readme = fs.readFileSync(README_PATH, "utf8");
  const listHeadingIndex = readme.indexOf("# List");
  if (listHeadingIndex === -1) {
    throw new Error('Could not find "# List" heading in README.md');
  }

  const beforeTable = readme.slice(0, listHeadingIndex + "# List".length);
  const table = buildTable(getSites());

  fs.writeFileSync(README_PATH, `${beforeTable}\n\n${table}\n`);
};

updateReadme();
