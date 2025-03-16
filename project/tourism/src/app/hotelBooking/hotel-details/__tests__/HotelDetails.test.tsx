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

  test("calculates total cost correctly", async () => {
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
    await waitFor(() => expect(screen.getByText(/Total Cost: ₹/)).toBeInTheDocument());
  });

  test("displays error when booking with missing details", async () => {
    render(<HotelDetailsContent />);
  
    // Check if "Book Now" button is initially disabled
    const bookNowButton = screen.getByRole("button", { name: "Book Now" });
    expect(bookNowButton).toBeDisabled();
  
    // Ensure fields are empty to trigger validation
    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "" },
    });
  
    // Simulate clicking "Calculate Total Cost" (if required to enable booking)
    const calculateButton = screen.getByRole("button", { name: "Calculate Total Cost" });
    fireEvent.click(calculateButton);
  
    // Check if "Book Now" button is now enabled
    await waitFor(() => {
      expect(bookNowButton).not.toBeDisabled();
    });
  
    // Click "Book Now"
    fireEvent.click(bookNowButton);
  
    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText((text) =>
          text.includes("Please fill in all fields and calculate the total cost")
        )
      ).toBeInTheDocument();
    });
  });
  

  test("handles booking successfully", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        redirected: false,
        json: () => Promise.resolve({ total_cost: 500 }),
      } as Response)
    );
  
    // Mock the alert function
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
  
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
    await waitFor(() => expect(screen.getByText(/Total Cost: ₹/)).toBeInTheDocument());
  
    const bookNowButton = screen.queryByText("Book Now");
    expect(bookNowButton).toBeInTheDocument();
  
    fireEvent.click(bookNowButton!);
  
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  
    // Ensure alert was called with the correct message
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Booking successful! Total cost: ₹500.00');
    });
  
    // Optionally: Check if the "Booking successful" message appears in the DOM if you refactor the component to display this message instead of using an alert.
    screen.debug();
  
    alertMock.mockRestore();  // Clean up the mock
  });
  });