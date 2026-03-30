import { Command } from "commander";
import jwt from "jsonwebtoken";
import readlineSync from "readline-sync";
import { getOS, computeHash, validateInputs, JWT_SECRET, JWT_EXPIRY } from "./utils.js";

export function generateCommand() {
  const cmd = new Command("generate");

  cmd
    .description("Generate a signed JWT with student credentials")
    .requiredOption("-n, --name <name>", "Student first name")
    .requiredOption("-s, --surname <surname>", "Student surname")
    .requiredOption("-i, --student-id <id>", "Student identifier (e.g. 123456-7)")
    .requiredOption("-c, --course <course>", "Course code (e.g. A1234)")
    .option("-y, --no-confirm", "Skip confirmation prompt and generate directly")
    .action((opts) => {
      const { name, surname, studentId, course, confirm } = opts;

      // Validate inputs
      const errors = validateInputs({ name, surname, studentId, course });
      if (errors.length > 0) {
        console.error("\n❌ Validation errors:");
        errors.forEach((e) => console.error(`   • ${e}`));
        process.exit(1);
      }

      const os = getOS();
      const hash = computeHash({ name, surname, studentId, course, os });

      const payload = { name, surname, studentId, course, os, hash };

      // Confirmation
      if (confirm !== false) {
        console.log("\n📋 Please review the data before generating the token:\n");
        console.log(`   Name        : ${name}`);
        console.log(`   Surname     : ${surname}`);
        console.log(`   Student ID  : ${studentId}`);
        console.log(`   Course      : ${course}`);
        console.log(`   OS          : ${os}`);
        console.log(`   Hash        : ${hash}\n`);

        const ok = readlineSync.keyInYNStrict("Generate token with this data?");
        if (!ok) {
          console.log("\n⚠️  Token generation cancelled.");
          process.exit(0);
        }
      }

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

      console.log("\n✅ Token generated successfully:\n");
      console.log(token);
      console.log();
    });

  return cmd;
}
