import "reflect-metadata";
import { container } from "tsyringe";
import { CategoryRepo } from "./features/categories/categories.repo";
import { CategoryService } from "./features/categories/categories.service";
import { CATEGORY_REPO, CATEGORY_SERVICE } from "./features/categories/categories.tokens";
import { ABO_REPO, ABO_SERVICE } from "./features/subscriptions/subscriptions.tokens";
import { SubscriptionRepo } from "./features/subscriptions/subscriptions.repo";
import { SubscriptionService } from "./features/subscriptions/subscriptions.service";

container.register(CATEGORY_REPO, { useClass: CategoryRepo });
container.register(CATEGORY_SERVICE, { useClass: CategoryService });
container.register(ABO_REPO, { useClass: SubscriptionRepo });
container.register(ABO_SERVICE, { useClass: SubscriptionService });

export { container };
