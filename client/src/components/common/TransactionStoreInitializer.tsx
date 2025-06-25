import { useEffect } from "react";
import { ApiClient } from "~/api/api";
import { useToken } from "~/api/hooks";
import { TransactionService } from "~/api/services/transactions.service";
import { useTransactionStore } from "~/api/stores/transactions";
import { apiClientWithToken } from "~/api/utils";

export function TransactionStoreInitializer() {
  const token = useToken();
  const initService = useTransactionStore((s) => s.actions.initService);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want the token as dependency here
  useEffect(() => {
    const client = token
      ? apiClientWithToken(new ApiClient(), token)
      : new ApiClient();
    const service = new TransactionService(client);
    initService(service);
  }, [token]);

  return null;
}
