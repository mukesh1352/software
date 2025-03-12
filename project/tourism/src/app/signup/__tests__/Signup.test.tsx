import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "../page"; 
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Signup Component", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  test("shows error when fields are empty and Sign Up is clicked", async () => {
    render(<Signup />);

    // Click the Sign Up button
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    // Check for error message
    expect(await screen.findByText(/both fields are required/i)).toBeInTheDocument();
  });

  test("does not show error when fields are filled", async () => {
    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.queryByText(/both fields are required/i)).not.toBeInTheDocument();
    });
  });

  test("redirects to login on successful signup", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/login"));
  });

  test("shows error on failed signup request", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: "Signup failed" }),
      })
    ) as jest.Mock;

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/signup failed/i)).toBeInTheDocument();
  });
});
