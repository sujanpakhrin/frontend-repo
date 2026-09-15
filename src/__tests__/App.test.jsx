import { render, screen, waitFor } from "@testing-library/react";
import { jest } from "@jest/globals";
import App from "../App";

describe("App", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("displays users returned by the backend API", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          name: "Sujan",
          email: "sujan@example.com",
        },
        {
          id: 2,
          name: "Kenny",
          email: "kenny@example.com",
        },
      ],
    });

    render(<App />);

    expect(screen.getByText("Loading users...")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("Sujan — sujan@example.com")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Kenny — kenny@example.com")
      ).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/users"
    );
  });

  test("displays an error when the API request fails", async () => {
    fetch.mockRejectedValue(new Error("API failure"));

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText("Unable to load users from the backend.")
      ).toBeInTheDocument();
    });
  });
});
