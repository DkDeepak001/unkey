import { type Api, type KeyAuth, type Workspace } from "../db";
import { routeTestEnv } from "../testutil/env";
import { Harness } from "./harness";
import { StepRequest, StepResponse, headersToRecord } from "./request";

import { type UnstableDevWorker, unstable_dev } from "wrangler";
export type Resources = {
  unkeyWorkspace: Workspace;
  unkeyApi: Api;
  unkeyKeyAuth: KeyAuth;
  userWorkspace: Workspace;
  userApi: Api;
  userKeyAuth: KeyAuth;
};

export class RouteHarness extends Harness {
  private worker: UnstableDevWorker;

  private constructor(worker: UnstableDevWorker) {
    super();
    this.worker = worker;
  }

  static async init(): Promise<RouteHarness> {
    const env = routeTestEnv.parse(process.env);
    const worker = await unstable_dev("src/worker.ts", {
      local: env.WORKER_LOCATION === "local",
      logLevel: "info",
      experimental: { disableExperimentalWarning: true },
      vars: env,
    });
    return new RouteHarness(worker);
  }

  public async stop(): Promise<void> {
    await this.worker.stop();
  }

  public async do<TRequestBody = unknown, TResponseBody = unknown>(
    req: StepRequest<TRequestBody>,
  ): Promise<StepResponse<TResponseBody>> {
    const res = await this.worker.fetch(req.url, {
      method: req.method,
      headers: req.headers,
      body: JSON.stringify(req.body),
    });

    return {
      status: res.status,
      headers: headersToRecord(res.headers),
      body: (await res.json().catch((err) => {
        console.error(`${req.url} didn't return json`, err);
        return {};
      })) as TResponseBody,
    };
  }

  async get<TRes>(req: Omit<StepRequest<never>, "method">): Promise<StepResponse<TRes>> {
    return await this.do<never, TRes>({ method: "GET", ...req });
  }
  async post<TReq, TRes>(req: Omit<StepRequest<TReq>, "method">): Promise<StepResponse<TRes>> {
    return await this.do<TReq, TRes>({ method: "POST", ...req });
  }
  async put<TReq, TRes>(req: Omit<StepRequest<TReq>, "method">): Promise<StepResponse<TRes>> {
    return await this.do<TReq, TRes>({ method: "PUT", ...req });
  }
  async delete<TRes>(req: Omit<StepRequest<never>, "method">): Promise<StepResponse<TRes>> {
    return await this.do<never, TRes>({ method: "DELETE", ...req });
  }
}
