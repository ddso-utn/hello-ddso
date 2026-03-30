import { createHash } from "crypto";
import { networkInterfaces, platform } from "os";

export const STUDENT_ID_REGEX = /^\d{6}-\d$/;
export const COURSE_REGEX = /^[A-Z]\d{4}$/;
export const JWT_SECRET = "hello-ddso-secret-key";
export const JWT_EXPIRY = "1h";

export function getOS() {
  const p = platform();
  if (p === "win32") return "windows";
  if (p === "darwin") return "mac";
  return "linux";
}

export function computeHash({ name, surname, studentId, course, os }) {
  const raw = `${name}|${surname}|${studentId}|${course}|${os}`;
  return createHash("sha256").update(raw).digest("hex");
}

export function validateInputs({ name, surname, studentId, course }) {
  const errors = [];
  if (!name || name.trim() === "") errors.push("Name cannot be empty.");
  if (!surname || surname.trim() === "") errors.push("Surname cannot be empty.");
  if (!STUDENT_ID_REGEX.test(studentId))
    errors.push(`Student ID must match format 123456-7, got: "${studentId}"`);
  if (!COURSE_REGEX.test(course))
    errors.push(`Course must match format K1234 (e.g. A1234), got: "${course}"`);
  return errors;
}
