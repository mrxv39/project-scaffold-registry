import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Projects from "../Projects.jsx";

// Helper to mock fetch
function mockFetchImpl(impl) {
  global.fetch = vi.fn(impl);
}

describe("Projects page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("can create a project from the UI", async () => {
    const created = { id: 1, name: "New Project", status: "active", category: "", tags: [] };
    // Track calls and simulate fetch for GET and POST
    let fetchCall = 0;
    global.fetch = vi.fn((url, opts) => {
      fetchCall++;
      // First call: initial GET
      if (fetchCall === 1) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve([]),
        });
      }
      // Second call: POST
      if (fetchCall === 2) {
        expect(url).toMatch(/\/api\/projects/);
        expect(opts.method).toBe("POST");
        const body = JSON.parse(opts.body);
        expect(body.name).toBe("New Project");
        return Promise.resolve({
          ok: true,
          status: 201,
          json: () => Promise.resolve(created),
        });
      }
      // Third call: GET after POST
      if (fetchCall === 3) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve([created]),
        });
      }
      throw new Error("Unexpected fetch call");
    });

    render(<Projects />);
    // Wait for empty state
    await waitFor(() => expect(screen.getByText(/no projects yet/i)).toBeInTheDocument());
    // Type project name and submit
    await userEvent.type(screen.getByPlaceholderText(/project name/i), "New Project");
    await userEvent.click(screen.getByRole("button", { name: /add project/i }));
    // Should show the new project after POST and GET
    await waitFor(() => expect(screen.getByText("New Project")).toBeInTheDocument());
    // Ensure fetch was called for POST
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/projects/),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("renders a list of projects", async () => {
    const projects = [
      { id: 1, name: "Alpha", status: "active", category: "A", tags: ["x"] },
      { id: 2, name: "Beta", status: "archived", category: "B", tags: ["y"] },
    ];
    mockFetchImpl(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(projects),
      })
    );
    render(<Projects />);
    for (const p of projects) {
      await waitFor(() => expect(screen.getByText(p.name)).toBeInTheDocument());
    }
  });

  it("shows DB unavailable and disables form", async () => {
    mockFetchImpl(() =>
      Promise.resolve({
        ok: false,
        status: 503,
        text: () => Promise.resolve(JSON.stringify({ status: "db_unavailable" })),
      })
    );
    render(<Projects />);
    await waitFor(() => expect(screen.getByText(/Failed to load projects/i)).toBeInTheDocument());
    // Should show error, and form submit should be disabled
    const button = screen.getByRole("button", { name: /add project/i });
    expect(button).toBeDisabled();
  });

  it("handles empty project list", async () => {
    mockFetchImpl(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      })
    );
    render(<Projects />);
    await waitFor(() => expect(screen.getByText(/no projects yet/i)).toBeInTheDocument());
  });
});
