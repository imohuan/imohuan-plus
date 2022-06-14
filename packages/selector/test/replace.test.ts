import { describe, expect, it } from "vitest";

import { defaultReplaces } from "../src/core/config";
import { parseReplace } from "../src/core/query";

describe("replace", () => {
  it("replace function test", async () => {
    expect(parseReplace(".hello:eq(3) .ddd:eq(-1)::text", defaultReplaces)).toBe(
      ".hello:nth-of-type(3) .ddd:nth-last-of-type(1)::text"
    );

    expect(parseReplace(".hello:eq(2n+1) .ddd:eq(2n+1)::text", defaultReplaces)).toBe(
      ".hello:nth-of-type(2n+1) .ddd:nth-of-type(2n+1)::text"
    );

    expect(parseReplace(".hello:ed(3) .ddd:ed(-1)::text", defaultReplaces)).toBe(
      ".hello:nth-child(3) .ddd:nth-last-child(1)::text"
    );

    expect(parseReplace(".hello:ed(2n+1) .ddd:ed(2n+1)::text", defaultReplaces)).toBe(
      ".hello:nth-child(2n+1) .ddd:nth-child(2n+1)::text"
    );
  });
});
