import { sha256 } from "@unkey/hash";
import { newId } from "@unkey/id";
import { KeyV1 } from "@unkey/keys";
import {
  type Api,
  type Database,
  type KeyAuth,
  Permission,
  Role,
  type Workspace,
  createConnection,
  eq,
  schema,
} from "../db";
import { databaseEnv } from "./env";

export type Resources = {
  unkeyWorkspace: Workspace;
  unkeyApi: Api;
  unkeyKeyAuth: KeyAuth;
  userWorkspace: Workspace;
  userApi: Api;
  userKeyAuth: KeyAuth;
};

export abstract class Harness {
  public readonly db: Database;
  public resources: Resources;

  constructor() {
    const env = databaseEnv.parse(process.env);
    this.db = createConnection({
      host: env.DATABASE_HOST,
      username: env.DATABASE_USERNAME,
      password: env.DATABASE_PASSWORD,
    });
    this.resources = this.createResources();
  }

  public async teardown(): Promise<void> {
    await this.db
      .delete(schema.workspaces)
      .where(eq(schema.workspaces.id, this.resources.userWorkspace.id))
      .catch((err) => {
        console.error(err);
      });
    await this.db
      .delete(schema.workspaces)
      .where(eq(schema.workspaces.id, this.resources.unkeyWorkspace.id))
      .catch((err) => {
        console.error(err);
      });
  }
  /**
   * Create a new root key with optional roles
   */
  async createRootKey(permissions?: string[]) {
    const rootKey = new KeyV1({ byteLength: 16, prefix: "unkey" }).toString();
    const start = rootKey.slice(0, 10);
    const keyId = newId("test");
    const hash = await sha256(rootKey);

    await this.db.insert(schema.keys).values({
      id: keyId,
      keyAuthId: this.resources.unkeyKeyAuth.id,
      hash,
      start,
      workspaceId: this.resources.unkeyWorkspace.id,
      forWorkspaceId: this.resources.userWorkspace.id,
      createdAt: new Date(),
    });
    if (permissions && permissions.length > 0) {
      const create: Permission[] = permissions.map((name) => ({
        id: newId("test"),
        name,
        key: name,
        description: null,
        workspaceId: this.resources.unkeyWorkspace.id,
        createdAt: new Date(),
        updatedAt: null,
      }));

      await this.db.insert(schema.permissions).values(create);
      await this.db.insert(schema.keysPermissions).values(
        create.map((p) => ({
          keyId,
          permissionId: p.id,
          workspaceId: this.resources.unkeyWorkspace.id,
        })),
      );
    }
    return {
      id: keyId,
      key: rootKey,
    };
  }

  public async createKey(opts?: {
    roles: {
      name: string;
      permissions?: string[];
    }[];
  }): Promise<{ keyId: string; key: string }> {
    /**
     * Prepare the key we'll use
     */
    const key = new KeyV1({ prefix: "test", byteLength: 16 }).toString();
    const keyId = newId("test");
    await this.db.insert(schema.keys).values({
      id: keyId,
      keyAuthId: this.resources.userKeyAuth.id,
      hash: await sha256(key),
      start: key.slice(0, 8),
      workspaceId: this.resources.userWorkspace.id,
      createdAt: new Date(),
    });

    for (const role of opts?.roles ?? []) {
      const { id: roleId } = await this.optimisticUpsertRole(
        this.resources.userWorkspace.id,
        role.name,
      );
      await this.db.insert(schema.keysRoles).values({
        keyId,
        roleId,
        workspaceId: this.resources.userWorkspace.id,
      });

      for (const permissionName of role.permissions ?? []) {
        const permission = await this.optimisticUpsertPermission(
          this.resources.userWorkspace.id,
          permissionName,
        );
        await this.db
          .insert(schema.rolesPermissions)
          .values({
            roleId,
            permissionId: permission.id,
            workspaceId: this.resources.userWorkspace.id,
          })
          .onDuplicateKeyUpdate({
            set: {
              roleId,
              permissionId: permission.id,
              workspaceId: this.resources.userWorkspace.id,
            },
          });
      }
    }

    return {
      keyId,
      key,
    };
  }

  private async optimisticUpsertPermission(workspaceId: string, name: string): Promise<Permission> {
    let permission: Permission = {
      id: newId("test"),
      name,
      workspaceId,
      createdAt: new Date(),
      updatedAt: null,
      description: null,
    };
    await this.db
      .insert(schema.permissions)
      .values(permission)
      .catch(async (err) => {
        // it's a duplicate

        const found = await this.db.query.permissions.findFirst({
          where: (table, { and, eq }) =>
            and(eq(table.workspaceId, workspaceId), eq(table.name, name)),
        });
        if (!found) {
          throw err;
        }
        permission = found;
      });

    return permission;
  }

  private async optimisticUpsertRole(workspaceId: string, name: string): Promise<Role> {
    let role: Role = {
      id: newId("test"),
      name,
      workspaceId,
      createdAt: new Date(),
      updatedAt: null,
      description: null,
    };
    await this.db
      .insert(schema.roles)
      .values(role)
      .catch(async (err) => {
        // it's a duplicate

        const found = await this.db.query.roles.findFirst({
          where: (table, { and, eq }) =>
            and(eq(table.workspaceId, workspaceId), eq(table.name, name)),
        });
        if (!found) {
          throw err;
        }
        role = found;
      });

    return role;
  }

  public createResources(): Resources {
    const unkeyWorkspace: Workspace = {
      id: newId("test"),
      name: "unkey",
      tenantId: newId("test"),
      plan: "enterprise",
      features: {},
      betaFeatures: {},
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      trialEnds: null,
      subscriptions: null,
      planLockedUntil: null,
      planChanged: null,
      createdAt: new Date(),
      deletedAt: null,
      planDowngradeRequest: null,
    };
    const userWorkspace: Workspace = {
      id: newId("test"),
      name: "user",
      tenantId: newId("test"),
      plan: "pro",
      features: {},
      betaFeatures: {},
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      trialEnds: null,
      subscriptions: null,
      planLockedUntil: null,
      planChanged: null,
      createdAt: new Date(),
      deletedAt: null,
      planDowngradeRequest: null,
    };

    const unkeyKeyAuth: KeyAuth = {
      id: newId("test"),
      workspaceId: unkeyWorkspace.id,
      createdAt: new Date(),
      deletedAt: null,
    };
    const userKeyAuth: KeyAuth = {
      id: newId("test"),
      workspaceId: userWorkspace.id,
      createdAt: new Date(),
      deletedAt: null,
    };

    const unkeyApi: Api = {
      id: newId("test"),
      name: "unkey",
      workspaceId: unkeyWorkspace.id,
      authType: "key",
      keyAuthId: unkeyKeyAuth.id,
      ipWhitelist: null,
      createdAt: new Date(),
      deletedAt: null,
    };
    const userApi: Api = {
      id: newId("test"),
      name: "user",
      workspaceId: userWorkspace.id,
      authType: "key",
      keyAuthId: userKeyAuth.id,
      ipWhitelist: null,
      createdAt: new Date(),
      deletedAt: null,
    };

    return {
      unkeyWorkspace,
      unkeyApi,
      unkeyKeyAuth,
      userWorkspace,
      userApi,
      userKeyAuth,
    };
  }

  public async seed(): Promise<void> {
    this.resources = this.createResources();

    await this.db.insert(schema.workspaces).values(this.resources.unkeyWorkspace);
    await this.db.insert(schema.keyAuth).values(this.resources.unkeyKeyAuth);
    await this.db.insert(schema.apis).values(this.resources.unkeyApi);

    await this.db.insert(schema.workspaces).values(this.resources.userWorkspace);
    await this.db.insert(schema.keyAuth).values(this.resources.userKeyAuth);
    await this.db.insert(schema.apis).values(this.resources.userApi);
  }
}
