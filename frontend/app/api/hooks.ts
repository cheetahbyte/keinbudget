import { useState, useEffect } from "react";

export function useToken() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchedToken = localStorage.getItem("token");
        setToken(fetchedToken);
    }, []);

    return token;
}