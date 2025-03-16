import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chatbot from "../chatbot";
import "@testing-library/jest-dom";

// Test suite for the Chatbot component
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
    expect(loadingText).toBeInTheDocument();

    // Wait for the AI response to appear (simulating async response)
    await waitFor(() => {
      const aiResponse = screen.getByText(/Sorry, something went wrong. Please try again later./i);
      expect(aiResponse).toBeInTheDocument(); // Check that the AI response is displayed
    });
  });

  test("should disable send button when input is empty", () => {
    render(<Chatbot />);

    // Open the chat window
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));

    // Check if the send button is disabled when the input is empty
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  test("should enable send button when input has text", () => {
    render(<Chatbot />);

    // Open the chat window
    fireEvent.click(screen.getByRole("button", { name: /open chat/i }));

    // Type a message in the input field
    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "Hello" } });

    // Check if the send button is enabled when there is text in the input
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).not.toBeDisabled();
  });
});
