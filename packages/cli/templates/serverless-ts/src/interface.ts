import { Rule, RuleType } from "@midwayjs/validate";

export class Paging {
  @Rule(RuleType.number().required())
  page: number;
  @Rule(RuleType.number())
  size: number;
  @Rule(RuleType.object())
  where: any;
  @Rule(RuleType.object())
  order: any;
  mode?: "like" | "none";
}
