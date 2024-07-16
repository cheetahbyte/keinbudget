// @ts-nocheck
/** */
export async function load() {
    const req = await fetch("http://localhost:3000/accounts", {credentials: "include"})
    const resp = await req.json()
	return {
		accounts: resp
	};
}