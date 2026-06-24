import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";

const cypressBin = path.resolve("node_modules", "cypress", "bin", "cypress");

const baseUrl = process.env.CYPRESS_BASE_URL || "http://localhost:3000";
const timeoutMs = 90_000;
const startedAt = Date.now();
const childEnv = { ...process.env };

delete childEnv.ELECTRON_RUN_AS_NODE;

let devServer;

function request(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode || 0);
    });

    req.on("error", () => resolve(0));
    req.setTimeout(2_000, () => {
      req.destroy();
      resolve(0);
    });
  });
}

async function waitForServer() {
  while (Date.now() - startedAt < timeoutMs) {
    const status = await request(baseUrl);

    if (status >= 200 && status < 500) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(`Timed out waiting for ${baseUrl}`);
}

function run(command, args, options = {}) {
  return spawn(command, args, {
    stdio: "inherit",
    shell: false,
    ...options,
  });
}

async function main() {
  const existingStatus = await request(baseUrl);
  const hasExistingServer = existingStatus >= 200 && existingStatus < 500;

  if (!hasExistingServer) {
    devServer = run(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "dev"], {
      env: {
        ...childEnv,
        PORT: new URL(baseUrl).port || "3000",
      },
    });

    await waitForServer();
  }

  const cypress = run(process.execPath, [cypressBin, "run", ...process.argv.slice(2)], {
    env: childEnv,
  });

  cypress.on("exit", (code) => {
    if (devServer) {
      devServer.kill();
    }

    process.exit(code ?? 1);
  });
}

process.on("SIGINT", () => {
  if (devServer) {
    devServer.kill();
  }

  process.exit(130);
});

main().catch((error) => {
  if (devServer) {
    devServer.kill();
  }

  console.error(error);
  process.exit(1);
});
