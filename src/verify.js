import { Command } from "commander";
import jwt from "jsonwebtoken";
import { computeHash, validateInputs, JWT_SECRET } from "./utils.js";

export function verifyCommand() {
  const cmd = new Command("verify");

  cmd
    .description("Verify a JWT token against provided student credentials")
    .requiredOption("-n, --name <n>", "Student first name")
    .requiredOption("-s, --surname <surname>", "Student surname")
    .requiredOption("-i, --student-id <id>", "Student identifier (e.g. 123456-7)")
    .requiredOption("-c, --course <course>", "Course code (e.g. A1234)")
    .requiredOption("--os <os>", "Operating system (windows, mac, linux)")
    .requiredOption("-t, --token <token>", "Encoded JWT token to verify")
    .action((opts) => {
      const { name, surname, studentId, course, os, token } = opts;

      // Validate inputs
      const errors = validateInputs({ name, surname, studentId, course });
      if (errors.length > 0) {
        console.error("\n❌ Validation errors:");
        errors.forEach((e) => console.error(`   • ${e}`));
        process.exit(1);
      }

      // Decode and verify JWT (also checks expiry automatically)
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          console.error("\n❌ Token has expired (max lifetime is 1 hour).");
        } else {
          console.error(`\n❌ Token signature is invalid: ${err.message}`);
        }
        process.exit(1);
      }

      // Check each field matches
      const mismatches = [];
      const fields = { name, surname, studentId, course, os };
      for (const [key, value] of Object.entries(fields)) {
        if (decoded[key].toLowerCase().trim() !== value.toLowerCase().trim()) {
          mismatches.push(
            `   • ${key}: expected "${value}", token contains "${decoded[key]}"`
          );
        }
      }

      if (mismatches.length > 0) {
        console.error("\n❌ Token data does not match provided values:");
        mismatches.forEach((m) => console.error(m));
        process.exit(1);
      }

      // Recompute and verify hash
      const expectedHash = computeHash({
        name: decoded.name,
        surname: decoded.surname,
        studentId: decoded.studentId,
        course: decoded.course,
        os: decoded.os
      });
      if (decoded.hash !== expectedHash) {
        console.error("\n❌ Hash mismatch — token data may have been tampered with.");
        console.error(`   Expected : ${expectedHash}`);
        console.error(`   Got      : ${decoded.hash}`);
        process.exit(1);
      }

      const issuedAt = new Date(decoded.iat * 1000).toISOString();
      const expiresAt = new Date(decoded.exp * 1000).toISOString();

      console.log("\n✅ Token is valid!\n");
      console.log(`   Name        : ${decoded.name}`);
      console.log(`   Surname     : ${decoded.surname}`);
      console.log(`   Student ID  : ${decoded.studentId}`);
      console.log(`   Course      : ${decoded.course}`);
      console.log(`   OS          : ${decoded.os}`);
      console.log(`   Hash        : ${decoded.hash}`);
      console.log(`   Issued at   : ${issuedAt}`);
      console.log(`   Expires at  : ${expiresAt}`);
      console.log();
    });

  return cmd;
}
