import type { Session } from "@keinbudget/auth";
import { subscriptionContract } from "@keinbudget/contracts";
import { implement, ORPCError } from "@orpc/server";
import { container } from "../../container";
import type {
  CreateSubscriptionInput,
  RemoveSubscriptionInput,
} from "./subcriptions.types";
import type { SubscriptionService } from "./subscriptions.service";
import { ABO_SERVICE } from "./subscriptions.tokens";

type AppContext = { session: Session | null };

const imp = implement(subscriptionContract).$context<AppContext>();

const authMiddleware = imp.middleware(({ context, next }) => {
  if (!context.session) throw new ORPCError("UNAUTHORIZED");
  return next({ context: { session: context.session } });
});

const authed = imp.use(authMiddleware);
const service = container.resolve<SubscriptionService>(ABO_SERVICE);

export const subscriptionsRPCRouter = authed.router({
  all: authed.all.handler(async ({ context }) =>
    service.findAll(context.session.user.id),
  ),
  monthlyCosts: authed.monthlyCosts.handler(async ({ context }) =>
    service.calculateMonthlyCosts(context.session.user.id),
  ),
  stats: authed.stats.handler(async ({ context }) =>
    service.calculateStats(context.session.user.id),
  ),
  create: authed.create.handler(async ({ context, input }) =>
    service.create(context.session.user.id, input as CreateSubscriptionInput),
  ),
  remove: authed.remove.handler(async ({ context, input }) =>
    service.remove(context.session.user.id, input as RemoveSubscriptionInput),
  ),
});
