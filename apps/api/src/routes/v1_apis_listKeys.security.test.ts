import { randomUUID } from "crypto";
import { RouteHarness } from "@/pkg/testutil/route-harness";
import { runSharedRoleTests } from "@/pkg/testutil/test_route_roles";
import { schema } from "@unkey/db";
import { newId } from "@unkey/id";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";
import { type V1ApisListKeysResponse } from "./v1_apis_listKeys";

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
    const apiId = newId("api");
    await rh.db.insert(schema.apis).values({
      id: apiId,
      name: randomUUID(),
      workspaceId: rh.resources.userWorkspace.id,
    });
    return {
      method: "GET",
      url: `/v1/apis.listKeys?apiId=${apiId}`,
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
    const keyAuthId = newId("keyAuth");
    await h.db.insert(schema.keyAuth).values({
      id: keyAuthId,
      workspaceId: h.resources.userWorkspace.id,
    });

    const apiId = newId("api");
    await h.db.insert(schema.apis).values({
      id: apiId,
      name: randomUUID(),
      workspaceId: h.resources.userWorkspace.id,
      authType: "key",
      keyAuthId,
    });

    const root = await h.createRootKey(
      roles.map((role) => (typeof role === "string" ? role : role(apiId))),
    );

    const res = await h.get<V1ApisListKeysResponse>({
      url: `/v1/apis.listKeys?apiId=${apiId}`,
      headers: {
        Authorization: `Bearer ${root.key}`,
      },
    });
    expect(res.status).toEqual(200);
  });
});
