import { db, eq, schema } from "@/lib/db";
import { ingestAuditLogs } from "@/lib/tinybird";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth, t } from "../trpc";

export const keySettingsRouter = t.router({
  updateEnabled: t.procedure
    .use(auth)
    .input(
      z.object({
        keyId: z.string(),
        workspaceId: z.string(),
        enabled: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const key = await db.query.keys.findFirst({
        where: (table, { eq }) => eq(table.id, input.keyId),
        with: {
          workspace: true,
        },
      });
      if (!key) {
        throw new TRPCError({ code: "NOT_FOUND", message: "key not found" });
      }
      if (key.workspace.tenantId !== ctx.tenant.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "key not found" });
      }
      await db
        .update(schema.keys)
        .set({
          enabled: input.enabled,
        })
        .where(eq(schema.keys.id, input.keyId));
      await ingestAuditLogs({
        workspaceId: key.workspace.id,
        actor: {
          type: "user",
          id: ctx.user.id,
        },
        event: "key.update",
        description: `${input.enabled ? "Enabled" : "Disabled"} ${key.id}`,
        resources: [
          {
            type: "key",
            id: key.id,
          },
        ],
        context: {
          location: ctx.audit.location,
          userAgent: ctx.audit.userAgent,
        },
      });
    }),
  updateRatelimit: t.procedure
    .use(auth)
    .input(
      z.object({
        keyId: z.string(),
        workspaceId: z.string(),
        enabled: z.boolean(),
        ratelimitType: z.enum(["fast", "consistent"]).nullable(),
        ratelimitLimit: z.number().int().positive().optional(),
        ratelimitRefillRate: z.number().int().positive().optional(),
        ratelimitRefillInterval: z.number().int().positive().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      let ratelimitType: "fast" | "consistent" | null = null;
      let ratelimitLimit: number | null = null;
      let ratelimitRefillRate: number | null = null;
      let ratelimitRefillInterval: number | null = null;

      if (input.enabled) {
        if (typeof input.ratelimitType !== "string") {
          throw new TRPCError({
            message: "ratelimitType must be a string",
            code: "BAD_REQUEST",
          });
        }
        ratelimitType = input.ratelimitType;

        if (typeof input.ratelimitLimit !== "number" || input.ratelimitLimit <= 0) {
          throw new TRPCError({
            message: "Limit must be a positive integer",
            code: "BAD_REQUEST",
          });
        }
        ratelimitLimit = input.ratelimitLimit;

        if (typeof input.ratelimitRefillRate !== "number" || input.ratelimitRefillRate <= 0) {
          throw new TRPCError({
            message: "Rate must be a positive integer",
            code: "BAD_REQUEST",
          });
        }
        ratelimitRefillRate = input.ratelimitRefillRate;
        if (
          typeof input.ratelimitRefillInterval !== "number" ||
          input.ratelimitRefillInterval <= 0
        ) {
          throw new TRPCError({
            message: "Interval must be a positive integer",
            code: "BAD_REQUEST",
          });
        }
        ratelimitRefillInterval = input.ratelimitRefillInterval;
      }
      const key = await db.query.keys.findFirst({
        where: (table, { eq }) => eq(table.id, input.keyId),
        with: {
          workspace: true,
        },
      });
      if (!key) {
        throw new TRPCError({ message: "key not found", code: "NOT_FOUND" });
      }
      if (key.workspace.tenantId !== ctx.tenant.id) {
        throw new TRPCError({ message: "key not found", code: "NOT_FOUND" });
      }
      await db
        .update(schema.keys)
        .set({
          ratelimitType,
          ratelimitLimit,
          ratelimitRefillRate,
          ratelimitRefillInterval,
        })
        .where(eq(schema.keys.id, input.keyId));
      await ingestAuditLogs({
        workspaceId: key.workspace.id,
        actor: {
          type: "user",
          id: ctx.user.id,
        },
        event: "key.update",
        description: `Changed ratelimit of ${key.id}`,
        resources: [
          {
            type: "key",
            id: key.id,
            meta: {
              "ratelimit.type": ratelimitType,
              "ratelimit.limit": ratelimitLimit,
              "ratelimit.refillRate": ratelimitRefillRate,
              "ratelimit.refillInterval": ratelimitRefillInterval,
            },
          },
        ],
        context: {
          location: ctx.audit.location,
          userAgent: ctx.audit.userAgent,
        },
      });
    }),
  updateOwnerId: t.procedure
    .use(auth)
    .input(
      z.object({
        keyId: z.string(),
        ownerId: z.string().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const key = await db.query.keys.findFirst({
        where: (table, { eq }) => eq(table.id, input.keyId),
        with: {
          workspace: true,
        },
      });
      if (!key || key.workspace.tenantId !== ctx.tenant.id) {
        throw new TRPCError({ message: "key not found", code: "NOT_FOUND" });
      }
      await db
        .update(schema.keys)
        .set({
          ownerId: input.ownerId ?? null,
        })
        .where(eq(schema.keys.id, input.keyId));
      await ingestAuditLogs({
        workspaceId: key.workspace.id,
        actor: {
          type: "user",
          id: ctx.user.id,
        },
        event: "key.update",
        description: `Changed ownerId of ${key.id} to ${input.ownerId}`,
        resources: [
          {
            type: "key",
            id: key.id,
          },
        ],
        context: {
          location: ctx.audit.location,
          userAgent: ctx.audit.userAgent,
        },
      });

      return true;
    }),
  updateName: t.procedure
    .use(auth)
    .input(
      z.object({
        keyId: z.string(),
        name: z.string().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const key = await db.query.keys.findFirst({
        where: (table, { eq }) => eq(table.id, input.keyId),
        with: {
          workspace: true,
        },
      });
      if (!key) {
        throw new TRPCError({ message: "key not found", code: "NOT_FOUND" });
      }
      if (key.workspace.tenantId !== ctx.tenant.id) {
        throw new TRPCError({ message: "key not found", code: "NOT_FOUND" });
      }
      await db
        .update(schema.keys)
        .set({
          name: input.name ?? null,
        })
        .where(eq(schema.keys.id, input.keyId));

      await ingestAuditLogs({
        workspaceId: key.workspace.id,
        actor: {
          type: "user",
          id: ctx.user.id,
        },
        event: "key.update",
        description: `Changed name of ${key.id} to ${input.name}`,
        resources: [
          {
            type: "key",
            id: key.id,
          },
        ],
        context: {
          location: ctx.audit.location,
          userAgent: ctx.audit.userAgent,
        },
      });
      return true;
    }),
  updateMetadata: t.procedure
    .use(auth)
    .input(
      z.object({
        keyId: z.string(),
        metadata: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      let meta: unknown | null = null;

      if (input.metadata === null || input.metadata === "") {
        meta = null;
      } else {
        try {
          meta = JSON.parse(input.metadata);
        } catch (e) {
          throw new TRPCError({
            message: `Metadata is not valid ${(e as Error).message}`,
            code: "BAD_REQUEST",
          });
        }
      }
      const key = await db.query.keys.findFirst({
        where: (table, { eq }) => eq(table.id, input.keyId),
        with: {
          workspace: true,
        },
      });
      if (!key) {
        throw new TRPCError({ message: "key not found", code: "NOT_FOUND" });
      }
      if (key.workspace.tenantId !== ctx.tenant.id) {
        throw new TRPCError({
          message: "key not found",
          code: "NOT_FOUND",
        });
      }
      await db
        .update(schema.keys)
        .set({
          meta: meta ? JSON.stringify(meta) : null,
        })
        .where(eq(schema.keys.id, input.keyId));
      await ingestAuditLogs({
        workspaceId: key.workspace.id,
        actor: {
          type: "user",
          id: ctx.user.id,
        },
        event: "key.update",
        description: `Updated metadata of ${key.id}`,
        resources: [
          {
            type: "key",
            id: key.id,
          },
        ],
        context: {
          location: ctx.audit.location,
          userAgent: ctx.audit.userAgent,
        },
      });
      return true;
    }),
  updateExpiration: t.procedure
    .use(auth)
    .input(
      z.object({
        keyId: z.string(),
        enableExpiration: z.boolean(),
        expiration: z.date().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      let expires: Date | null = null;
      if (input.enableExpiration) {
        if (!input.expiration) {
          throw new TRPCError({
            message: "you must enter a valid date",
            code: "BAD_REQUEST",
          });
        }
        try {
          expires = new Date(input.expiration);
        } catch (e) {
          console.error(e);
          throw new TRPCError({
            message: "you must enter a valid date",
            code: "BAD_REQUEST",
          });
        }
      }

      const key = await db.query.keys.findFirst({
        where: (table, { eq }) => eq(table.id, input.keyId),
        with: {
          workspace: true,
        },
      });
      if (!key || key.workspace.tenantId !== ctx.tenant.id) {
        throw new TRPCError({ message: "key not found", code: "NOT_FOUND" });
      }
      await db
        .update(schema.keys)
        .set({
          expires,
        })
        .where(eq(schema.keys.id, input.keyId));
      await ingestAuditLogs({
        workspaceId: key.workspace.id,
        actor: {
          type: "user",
          id: ctx.user.id,
        },
        event: "key.update",
        description: `${
          input.expiration
            ? `Changed expiration of ${key.id} to ${input.expiration.toUTCString()}`
            : `Disabled expiration for ${key.id}`
        }`,
        resources: [
          {
            type: "key",
            id: key.id,
          },
        ],
        context: {
          location: ctx.audit.location,
          userAgent: ctx.audit.userAgent,
        },
      });
      return true;
    }),
  updateRemaining: t.procedure
    .use(auth)
    .input(
      z.object({
        keyId: z.string(),
        limitEnabled: z.boolean(),
        remaining: z.number().int().positive().optional(),
        refill: z
          .object({
            interval: z.enum(["daily", "monthly", "none"]),
            amount: z.number().int().min(1).optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.limitEnabled === false || input.remaining === null) {
        input.remaining = undefined;
        input.refill = undefined;
      }
      if (input.refill?.interval === "none") {
        input.refill = undefined;
      }

      const key = await db.query.keys.findFirst({
        where: (table, { eq }) => eq(table.id, input.keyId),
        with: {
          workspace: true,
        },
      });
      if (!key) {
        throw new TRPCError({ message: "key not found", code: "NOT_FOUND" });
      }
      if (key.workspace.tenantId !== ctx.tenant.id) {
        throw new TRPCError({ message: "key not found", code: "NOT_FOUND" });
      }

      await db
        .update(schema.keys)
        .set({
          remaining: input.remaining ?? null,
          refillInterval:
            input.refill?.interval === "none" || input.refill?.interval === undefined
              ? null
              : input.refill?.interval,
          refillAmount: input.refill?.amount ?? null,
          lastRefillAt: input.refill?.interval ? new Date() : null,
        })
        .where(eq(schema.keys.id, input.keyId));

      await ingestAuditLogs({
        workspaceId: key.workspace.id,
        actor: {
          type: "user",
          id: ctx.user.id,
        },
        event: "key.update",
        description: input.limitEnabled
          ? `Changed remaining for ${key.id} to remaining=${input.remaining}, refill=${
              input.refill ? `${input.refill.amount}@${input.refill.interval}` : "none"
            }`
          : `Disabled limit for ${key.id}`,
        resources: [
          {
            type: "key",
            id: key.id,
          },
        ],
        context: {
          location: ctx.audit.location,
          userAgent: ctx.audit.userAgent,
        },
      });
      return true;
    }),
});
