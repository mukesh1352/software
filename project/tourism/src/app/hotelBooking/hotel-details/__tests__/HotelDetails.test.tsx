import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HotelDetailsContent from "../page";
import "@testing-library/jest-dom";
import { useSearchParams, useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe("HotelDetailsContent", () => {
  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        const params: { [key: string]: string } = { name: "Test Hotel", cost: "100" };
        return params[key] || null;
      },
    });
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });

  test("renders hotel name and default inputs", () => {
    render(<HotelDetailsContent />);
    expect(screen.getByText("Test Hotel")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  test("calculates total cost correctly", () => {
    render(<HotelDetailsContent />);

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Number of Rooms"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("Number of Adults"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("Number of Children"), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText("Calculate Total Cost"));
    expect(screen.getByText(/Total Cost: ₹/)).toBeInTheDocument();
  });

  test("displays error when booking with missing details", async () => {
    render(<HotelDetailsContent />);
    fireEvent.click(screen.getByText("Book Now"));
    expect(screen.getByText("Please fill in all fields and calculate the total cost.")).toBeInTheDocument();
  });

  test("handles booking successfully", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ total_cost: 500 }),
      })
    );

    render(<HotelDetailsContent />);

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Number of Rooms"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("Number of Adults"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("Number of Children"), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText("Calculate Total Cost"));
    await waitFor(() => screen.getByText(/Total Cost: ₹/));

    fireEvent.click(screen.getByText("Book Now"));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await waitFor(() => screen.getByText("Booking successful! Total cost: ₹500.00"));
  });

  test("handles booking failure", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: "Booking failed" }),
      })
    );

    render(<HotelDetailsContent />);
    fireEvent.click(screen.getByText("Book Now"));

    await waitFor(() => screen.getByText("Booking failed: Booking failed"));
  });
});
