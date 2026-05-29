// build-lambda.js
// Script untuk mem-bundle backend menjadi satu file lambda.js + package lambda-backend.zip
const { build } = require("esbuild");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const outDir = path.resolve(__dirname, "dist-lambda");

async function main() {
  // 1. Bersihkan folder dist-lambda (kecuali node_modules agar npm install lebih cepat)
  if (fs.existsSync(path.join(outDir, "lambda.js"))) {
    fs.rmSync(path.join(outDir, "lambda.js"));
  }
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log("🔨 Building lambda bundle with esbuild...");

  await build({
    entryPoints: ["src/lambda.ts"],
    bundle: true,
    outfile: path.join(outDir, "lambda.js"),
    platform: "node",
    target: "node20",
    format: "cjs",
    // Packages yang harus di-sertakan di zip (di-install manual ke dist-lambda)
    external: [
      "@prisma/client",
      "@prisma/client-runtime-utils",
      "@prisma/adapter-pg",
      "pg",
      "pg-native",
    ],
    minify: false,
    sourcemap: false,
    logLevel: "info",
  });

  console.log("✅ Bundle selesai: dist-lambda/lambda.js");

  // 2. Buat package.json minimal di dist-lambda
  const distPkg = {
    name: "lambda-backend",
    version: "1.0.0",
    main: "lambda.js",
    dependencies: {
      "@prisma/adapter-pg": "^7.8.0",
      "pg": "^8.20.0",
    }
  };
  fs.writeFileSync(
    path.join(outDir, "package.json"),
    JSON.stringify(distPkg, null, 2)
  );

  // 3. Copy dependencies dari parent node_modules (menghindari masalah frozen lockfile)
  console.log("📦 Copying production dependencies from parent node_modules...");
  const parentModules = path.resolve(__dirname, "../../node_modules");
  const destModules = path.join(outDir, "node_modules");
  if (!fs.existsSync(destModules)) fs.mkdirSync(destModules, { recursive: true });

  // Paket yang perlu di-copy (karena di-external-kan dari bundle)
  const pkgsToCopy = [
    "@prisma/client",
    "@prisma/client-runtime-utils",
    "@prisma/adapter-pg",
    "pg",
  ];

  for (const pkg of pkgsToCopy) {
    // Handle scoped packages (e.g. @prisma/client)
    const parts = pkg.split("/");
    const srcPkg = path.join(parentModules, ...parts);
    const dstPkg = path.join(destModules, ...parts);
    if (fs.existsSync(srcPkg)) {
      // Buat parent dir untuk scoped packages
      fs.mkdirSync(path.dirname(dstPkg), { recursive: true });
      if (!fs.existsSync(dstPkg)) {
        fs.cpSync(srcPkg, dstPkg, { recursive: true });
      }
      console.log(`  ✅ Copied ${pkg}`);
    } else {
      console.warn(`  ⚠️  ${pkg} tidak ditemukan di ${srcPkg}`);
    }
  }

  // Copy pg sub-dependencies (pg-types, etc.)
  const pgDeps = ["pg-cloudflare", "pg-connection-string", "pg-int8", "pg-pool", "pg-protocol", "pg-types", "pgpass", "packet-reader"];
  for (const dep of pgDeps) {
    const srcDep = path.join(parentModules, dep);
    const dstDep = path.join(destModules, dep);
    if (fs.existsSync(srcDep) && !fs.existsSync(dstDep)) {
      fs.cpSync(srcDep, dstDep, { recursive: true });
    }
  }

  // 4. Copy Prisma generated client
  const generatedSrc = path.resolve(__dirname, "src/generated");
  const generatedDst = path.join(outDir, "generated");
  if (fs.existsSync(generatedSrc)) {
    fs.cpSync(generatedSrc, generatedDst, { recursive: true });
    console.log("✅ Copied generated Prisma client");
  } else {
    console.warn("⚠️  src/generated tidak ditemukan, skip copy");
  }

  // 5. Hapus zip lama dan buat yang baru
  const zipPath = path.resolve(__dirname, "lambda-backend.zip");
  if (fs.existsSync(zipPath)) fs.rmSync(zipPath);
  console.log("📦 Membuat lambda-backend.zip...");
  execSync("zip -r ../lambda-backend.zip .", { cwd: outDir, stdio: "inherit" });
  console.log("✅ lambda-backend.zip siap di apps/backend/");
}

main().catch((err) => {
  console.error("❌ Build gagal:", err);
  process.exit(1);
});
