import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPassword from "../page"; // Adjust the path if needed
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  global.fetch = jest.fn();
});

describe("ForgotPassword Component", () => {
  it("renders input fields and button", () => {
    render(<ForgotPassword />);

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reset Password/i })).toBeInTheDocument();
  });

  it("updates state when inputs change", () => {
    render(<ForgotPassword />);

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/New Password/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "newpassword" } });

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("newpassword");
  });

  it("displays an error message on failed request", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ detail: "Error resetting password." }),
    });

    render(<ForgotPassword />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: "newpassword" } });
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    await waitFor(() => expect(screen.getByText(/Error resetting password./i)).toBeInTheDocument());
  });

  it("redirects on successful password reset", async () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    render(<ForgotPassword />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: "newpassword" } });
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/login"));
  });

  it("shows network error on fetch failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    render(<ForgotPassword />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: "newpassword" } });
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    await waitFor(() => expect(screen.getByText(/Network error/i)).toBeInTheDocument());
  });
});
