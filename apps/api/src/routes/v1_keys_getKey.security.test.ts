import { randomUUID } from "crypto";
import { RouteHarness } from "@/pkg/testutil/route-harness";
import { runSharedRoleTests } from "@/pkg/testutil/test_route_roles";
import { schema } from "@unkey/db";
import { sha256 } from "@unkey/hash";
import { newId } from "@unkey/id";
import { KeyV1 } from "@unkey/keys";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";
import { type V1KeysGetKeyResponse } from "./v1_keys_getKey";

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
runSharedRoleTests({
  prepareRequest: async (rh) => {
    const keyId = newId("key");
    const key = new KeyV1({ prefix: "test", byteLength: 16 }).toString();
    await rh.db.insert(schema.keys).values({
      id: keyId,
      keyAuthId: rh.resources.userKeyAuth.id,
      hash: await sha256(key),
      start: key.slice(0, 8),
      workspaceId: rh.resources.userWorkspace.id,
      createdAt: new Date(),
    });
    return {
      method: "GET",
      url: `/v1/keys.getKey?keyId=${keyId}`,
    };
  },
});

describe("correct roles", () => {
  test.each([
    { name: "legacy", roles: ["*"] },
    { name: "legacy and more", roles: ["*", randomUUID()] },
    { name: "wildcard api", roles: ["api.*.read_key", "api.*.read_api"] },
    {
      name: "wildcard mixed",
      roles: ["api.*.read_key", (apiId: string) => `api.${apiId}.read_api`],
    },
    {
      name: "wildcard mixed 2",
      roles: ["api.*.read_api", (apiId: string) => `api.${apiId}.read_key`],
    },
    { name: "wildcard and more", roles: ["api.*.read_key", "api.*.read_api", randomUUID()] },
    {
      name: "specific apiId",
      roles: [
        (apiId: string) => `api.${apiId}.read_key`,
        (apiId: string) => `api.${apiId}.read_api`,
      ],
    },
    {
      name: "specific apiId and more",
      roles: [
        (apiId: string) => `api.${apiId}.read_key`,
        (apiId: string) => `api.${apiId}.read_api`,
        randomUUID(),
      ],
    },
  ])("$name", async ({ roles }) => {
    const keyId = newId("key");
    const key = new KeyV1({ prefix: "test", byteLength: 16 }).toString();
    await h.db.insert(schema.keys).values({
      id: keyId,
      keyAuthId: h.resources.userKeyAuth.id,
      hash: await sha256(key),
      start: key.slice(0, 8),
      workspaceId: h.resources.userWorkspace.id,
      createdAt: new Date(),
    });

    const root = await h.createRootKey(
      roles.map((role) => (typeof role === "string" ? role : role(h.resources.userApi.id))),
    );

    const res = await h.get<V1KeysGetKeyResponse>({
      url: `/v1/keys.getKey?keyId=${keyId}`,
      headers: {
        Authorization: `Bearer ${root.key}`,
      },
    });
    expect(res.status).toEqual(200);
  });
});
