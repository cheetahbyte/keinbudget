// @ts-ignore
export async function load({fetch, params}) {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users/me`, { credentials: "include" })
    let user = await res.json()
    return {
        user
    };
}