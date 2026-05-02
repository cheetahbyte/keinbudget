import type { Session } from "@keinbudget/auth";
import { categoryContract } from "@keinbudget/contracts";
import { implement, ORPCError } from "@orpc/server";
import { container } from "../../container";
import type { CategoryService } from "./categories.service";
import { CATEGORY_SERVICE } from "./categories.tokens";
import type {
  CreateCategoryInput,
  RemoveCategoryInput,
} from "./categories.types";

type AppContext = { session: Session | null };

const imp = implement(categoryContract).$context<AppContext>();

const authMiddleware = imp.middleware(({ context, next }) => {
  if (!context.session) throw new ORPCError("UNAUTHORIZED");
  return next({ context: { session: context.session } });
});

const authed = imp.use(authMiddleware);
const service = container.resolve<CategoryService>(CATEGORY_SERVICE);

export const categoriesRPCRouter = authed.router({
  all: authed.all.handler(async ({ context }) =>
    service.findAll(context.session.user.id),
  ),
  create: authed.create.handler(async ({ context, input }) =>
    service.create(context.session.user.id, input as CreateCategoryInput),
  ),
  remove: authed.remove.handler(async ({ context, input }) =>
    service.remove(context.session.user.id, input as RemoveCategoryInput),
  ),
});
