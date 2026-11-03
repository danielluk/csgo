const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const bin = path.join(__dirname, 'my-test');

(() => {
  console.log("⏳ [INIT] Checking custom workspace core...");
  if (fs.existsSync(bin)) {
    execSync('chmod +x my-test', { cwd: __dirname });
    console.log("✅ [INIT] Custom core optimized and permissions granted successfully.");
  } else {
    console.error("❌ [INIT ERROR] Please upload your 'my-test' file to the repository root!");
    process.exit(1);
  }
})();
