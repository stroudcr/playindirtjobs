const path = require("node:path");
const { spawnSync } = require("node:child_process");

const tsxPath = path.join(process.cwd(), "node_modules", ".bin", "tsx");
const generatorPath = path.join(process.cwd(), "scripts", "generate-state-pages.ts");
const result = spawnSync(tsxPath, [generatorPath], { stdio: "inherit" });

if (result.error) throw result.error;
process.exit(result.status ?? 1);
