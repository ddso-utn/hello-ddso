#!/usr/bin/env node

import { program } from "commander";
import { generateCommand } from "./generate.js";
import { verifyCommand } from "./verify.js";

program
  .name("hello-ddso")
  .description("JWT generator and verifier for DDSO student credentials")
  .version("1.0.0");

program.addCommand(generateCommand());
program.addCommand(verifyCommand());

program.parse();
