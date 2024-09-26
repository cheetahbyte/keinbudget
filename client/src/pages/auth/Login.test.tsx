import { render, fireEvent, waitFor } from '@solidjs/testing-library';
import { LoginPage } from './Login';
import Requestor from '../../common/requestor'; // Mock this
import { vi } from 'vitest';

vi.mock('../../common/requestor'); // Mock Requestor

describe("<LoginPage />", () => {
    test("it will render the form correctly", () => {
        // Render the LoginPage component
        const { getByLabelText, getByRole } = render(() => <LoginPage />);

        // Check if the email input is present
        const emailInput = getByLabelText(/email/i);
        expect(emailInput).toBeInTheDocument();

        // Check if the password input is present
        const passwordInput = getByLabelText(/password/i);
        expect(passwordInput).toBeInTheDocument();

        // Check if the login button is present using role="button"
        const submitButton = getByRole('button', { name: /login/i });
        expect(submitButton).toBeInTheDocument();
    });

    test("should update email and password on input change", () => {
        const { getByLabelText } = render(() => <LoginPage />);

        const emailInput = getByLabelText(/email/i) as HTMLFormElement;
        const passwordInput = getByLabelText(/password/i) as HTMLFormElement;

        // Simulate typing into email input
        fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput.value).toBe('test@example.com');

        // Simulate typing into password input
        fireEvent.input(passwordInput, { target: { value: 'password123' } });
        expect(passwordInput.value).toBe('password123');
    });

    test("should submit form with email and password", async () => {
        window.alert = vi.fn() // TODO: as the login is properly implemented, this is no longer needed
        Requestor.post.mockResolvedValueOnce({}); // Mock success

        const { getByLabelText, getByRole } = render(() => <LoginPage />);

        const emailInput = getByLabelText(/email/i);
        const passwordInput = getByLabelText(/password/i);
        const submitButton = getByRole('button', { name: /login/i });

        // Simulate typing into email and password fields
        fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.input(passwordInput, { target: { value: 'password123' } });

        // Simulate form submission
        fireEvent.submit(submitButton);

        // Wait for the form to submit
        await waitFor(() => {
            expect(Requestor.post).toHaveBeenCalledWith('users/login', {
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    test("should display error message on failed submission", async () => {
        // Mock the post method to reject (fail)
        Requestor.post.mockRejectedValueOnce('Invalid credentials');

        const { getByLabelText, getByRole, getByText } = render(() => <LoginPage />);

        const emailInput = getByLabelText(/email/i);
        const passwordInput = getByLabelText(/password/i);
        const submitButton = getByRole('button', { name: /login/i });

        // Simulate typing into email and password fields
        fireEvent.input(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.input(passwordInput, { target: { value: 'wrongpassword' } });

        // Simulate form submission
        fireEvent.submit(submitButton);

        // Wait for the error message to appear
        await waitFor(() => {
            // Ensure the mock function was called with correct parameters
            expect(Requestor.post).toHaveBeenCalledWith('users/login', {
                email: 'wrong@example.com',
                password: 'wrongpassword',
            });

            // Assert that the error message is displayed
            expect(getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });
    test("should alert on successful submission", async () => {
        const alertMock = vi.spyOn(window, 'alert').mockImplementation(); // Mock window alert
        Requestor.post.mockResolvedValueOnce({}); // Mock success
    
        const { getByLabelText, getByRole } = render(() => <LoginPage />);
    
        const emailInput = getByLabelText(/email/i);
        const passwordInput = getByLabelText(/password/i);
        const submitButton = getByRole('button', { name: /login/i });
    
        // Simulate typing into email and password fields
        fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.input(passwordInput, { target: { value: 'password123' } });
    
        // Simulate form submission
        fireEvent.submit(submitButton);
    
        // Wait for the success action (alert)
        await waitFor(() => {
            expect(Requestor.post).toHaveBeenCalledWith('users/login', {
                email: 'test@example.com',
                password: 'password123',
            });
    
            expect(alertMock).toHaveBeenCalledWith('success');
        });
    
        alertMock.mockRestore(); // Restore the original alert
    });
});