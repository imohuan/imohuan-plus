import { join } from "path";

import { ILifeCycle } from "@midwayjs/core";
import { Configuration } from "@midwayjs/decorator";
import * as jwt from "@midwayjs/jwt";
import * as upload from "@midwayjs/upload";
import * as validate from "@midwayjs/validate";
import * as faas from "@midwayjs/faas";

@Configuration({
  conflictCheck: true,
  imports: [faas, jwt, validate, upload],
  importConfigs: [join(__dirname, "./config/")]
})
export class ContainerLifeCycle implements ILifeCycle {
  async onReady() {}
}
