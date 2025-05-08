import {render, screen} from "@testing-library/react"
import { describe, it, expect, beforeEach } from "vitest"
import { useToken } from "../src/api/hooks"

function TestComponent() {
    const token = useToken()
    return <div>{token ?? "No token"}</div>
}

describe("useToken", () => {
    beforeEach(() => localStorage.clear())

    it("returns the token from localStorage", () => {
        localStorage.setItem("token", "test-token")
        render(<TestComponent/>)
        expect(screen.getByText("test-token")).toBeInTheDocument()
    })

    it("returns null if token is missing", () => {
        render(<TestComponent/>)
        expect(screen.getByText("No token")).toBeInTheDocument()
    })
})