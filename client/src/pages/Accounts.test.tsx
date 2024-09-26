import {render, fireEvent} from "@solidjs/testing-library"

import { AccountsPage } from "./Accounts"

describe("<AccountsPage />", () => {
    test("it will renter the header", () => {
        const {getByPlaceholderText, getByText} = render(() => <AccountsPage/>)
        expect(getByText("Your Accounts")).toBeInTheDocument();
    })
})