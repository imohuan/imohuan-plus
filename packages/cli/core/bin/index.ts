#!/usr/bin/env esno
import importLocal from "import-local";
import { logger } from "@imohuan-plus/log";
import { core } from "../src";

if (importLocal(__filename)) {
  logger.info("cli", "正在使用 imohuan-cli 本地版本");
} else {
  core(process.argv.slice(2));
}
