import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from "vitest";

import { RouteHarness } from "@/pkg/testutil/route-harness";
import { newId } from "@unkey/id";
import { type V1KeysUpdateKeyRequest, type V1KeysUpdateKeyResponse } from "./v1_keys_updateKey";

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
test("when the key does not exist", async () => {
  const keyId = newId("key");

  const root = await h.createRootKey([`api.${h.resources.userApi.id}.update_key`]);

  const res = await h.post<V1KeysUpdateKeyRequest, V1KeysUpdateKeyResponse>({
    url: "/v1/keys.updateKey",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${root.key}`,
    },
    body: {
      keyId,
      enabled: false,
    },
  });
  expect(res.status).toEqual(404);
  expect(res.body).toMatchObject({
    error: {
      code: "NOT_FOUND",
      docs: "https://unkey.dev/docs/api-reference/errors/code/NOT_FOUND",
      message: `key ${keyId} not found`,
    },
  });
});
