import { Inject, Provide } from "@midwayjs/decorator";
import { Context } from "@midwayjs/faas";
// import { ValidateService } from "@midwayjs/validate";

@Provide()
export class HomeService {
  @Inject()
  ctx: Context;

  constructor() {}

  hello() {
    return "hello world";
  }
}
