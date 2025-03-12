import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HotelBooking from "../page"; // Adjust path if necessary
import { useRouter } from "next/navigation";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks(); // Reset mocks before each test
});

// Mock window.alert
global.alert = jest.fn();

describe("HotelBooking Component", () => {
  test("shows error when searching with an empty city", async () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });

    render(<HotelBooking />);

    fireEvent.click(screen.getByRole("button", { name: /search hotels/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("City not found!");
    });
  });

  test("shows error when city is not found", async () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ access_token: "mocked_token" }),
      }) // Authentication
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ data: [] }), // No IATA code found
      });

    render(<HotelBooking />);

    fireEvent.change(screen.getByPlaceholderText(/enter city/i), {
      target: { value: "UnknownCity" },
    });

    fireEvent.click(screen.getByRole("button", { name: /search hotels/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("City not found!");
    });
  });
});
