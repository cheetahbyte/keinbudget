import { flagsClient, getFrontendFlags } from "@unleash/nextjs";

export default async function Test() {
  const { toggles } = await getFrontendFlags();
  const flags = flagsClient(toggles);
  if (flags.isEnabled("sign_up")) return "Flag an";
  else return "Flag aus";
}
