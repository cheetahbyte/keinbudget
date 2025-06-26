import useAccountsStore from "../stores/accounts";

function useAccount() {
  return useAccountsStore((s) => s.accounts);
}

export default useAccount;
