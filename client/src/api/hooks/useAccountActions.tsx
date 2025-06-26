import useAccountsStore from "../stores/accounts";

function useAccountActions() {
  return useAccountsStore((s) => s.actions);
}

export default useAccountActions;
