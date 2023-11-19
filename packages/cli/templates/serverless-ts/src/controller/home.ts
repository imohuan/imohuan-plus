import { Controller, Get, Inject, Param, Provide } from "@midwayjs/decorator";
import { Context } from "@midwayjs/faas";

// import { Validate } from "@midwayjs/validate";
// import { JwtPassportMiddleware } from "../plugin/jwt.middleware";
import { HomeService } from "../service/home.service";

@Provide()
@Controller("/")
export class HomeController {
  @Inject()
  ctx: Context;

  @Inject()
  homeService: HomeService;

  @Get("/")
  async get() {
    return { message: "hello world" };
  }

  @Get("/home/:id")
  async home(@Param("id") id: string) {
    return { id, message: this.homeService.hello() };
  }
}
