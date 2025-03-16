import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chatbot from "../chatbot";

// Custom function to check if an element is in the document
const toBeInTheDocument = (element: HTMLElement | null) => {
  if (!element) throw new Error("Element is not in the document");
};

describe("Chatbot", () => {
  test("should display loading text when sending message", async () => {
    render(<Chatbot />);

    // Open the chat window
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));

    // Find the input field and type a user message
    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "Hello" } });

    // Click the send button
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    // Check if the loading text is shown
    const loadingText = screen.getByText("Sending...");
    toBeInTheDocument(loadingText); // Manually check if the element is in the document

    // Wait for the AI response (simulating the async behavior)
    await waitFor(() => {
      const aiResponse = screen.getByText(/Sorry, something went wrong. Please try again later./i);
      toBeInTheDocument(aiResponse); // Check that the AI response is displayed
    });
  });
});
