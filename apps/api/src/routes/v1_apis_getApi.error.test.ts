import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from "vitest";

import { RouteHarness } from "@/pkg/testutil/route-harness";
import { newId } from "@unkey/id";
import { V1ApisGetApiResponse } from "./v1_apis_getApi";

let h: RouteHarness;
beforeAll(async () => {
  h = await RouteHarness.init();
});
beforeEach(async () => {
  await h.seed();
});
afterEach(async () => {
  await h.teardown();
});
afterAll(async () => {
  await h.stop();
});
test("api does not exist", async () => {
  const apiId = newId("api");

  const root = await h.createRootKey(["*"]);

  const res = await h.get<V1ApisGetApiResponse>({
    url: `/v1/apis.getApi?apiId=${apiId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${root.key}`,
    },
  });

  expect(res.status).toEqual(404);
  expect(res.body).toMatchObject({
    error: {
      code: "NOT_FOUND",
      docs: "https://unkey.dev/docs/api-reference/errors/code/NOT_FOUND",
      message: `api ${apiId} not found`,
    },
  });
});
