// C:\Users\Usuario\projects\project-scaffold-registry\web\src\test\Projects.test.jsx

import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
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

    let fetchCall = 0;
    global.fetch = vi.fn((url, opts) => {
      fetchCall++;

      // 1) initial GET
      if (fetchCall === 1) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve([]),
        });
      }

      // 2) POST
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

      // 3) GET after POST
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
    await waitFor(() => expect(screen.getByText(/no projects yet/i)).toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText(/project name/i), "New Project");
    await userEvent.click(screen.getByRole("button", { name: /add project/i }));

    await waitFor(() => expect(screen.getByText("New Project")).toBeInTheDocument());

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

  it("can edit a project name and category", async () => {
    const initialProject = { id: 1, name: "Alpha", category: "A", status: "active", tags: [] };
    const updatedProject = { ...initialProject, name: "Beta", category: "B" };

    const fetchMock = vi
      .fn()
      // Initial GET
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [initialProject],
      })
      // PATCH
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => updatedProject,
      })
      // GET after PATCH
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [updatedProject],
      });

    global.fetch = fetchMock;

    render(<Projects />);

    // Wait for project row
    expect(await screen.findByText("Alpha")).toBeInTheDocument();

    // If your UI still has an Edit button, click it. If not, the row might already be in edit mode.
    const maybeEditBtn = screen.queryByRole("button", { name: /edit/i });
    if (maybeEditBtn) await userEvent.click(maybeEditBtn);

    // Grab the <li> that contains the editable inputs (has Alpha / A)
    const alphaInput = screen.getByDisplayValue("Alpha");
    const li = alphaInput.closest("li");
    expect(li).toBeTruthy();

    const row = within(li);

    const nameInput = row.getByDisplayValue("Alpha");
    const categoryInput = row.getByDisplayValue("A");

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Beta");

    await userEvent.clear(categoryInput);
    await userEvent.type(categoryInput, "B");

    const saveBtn = row.getByRole("button", { name: /save/i });
    await userEvent.click(saveBtn);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/projects/1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ name: "Beta", category: "B" }),
      })
    );

    // After refresh, updated data should appear
    expect(await screen.findByText("Beta")).toBeInTheDocument();
    // Your UI prints Category: X somewhere; keep it flexible:
    expect(screen.getByText(/Category:\s*B/i)).toBeInTheDocument();
  });

  it("disables editing if DB unavailable", async () => {
    // Component shows "Failed to load projects" for 503 load
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: async () => JSON.stringify({ status: "db_unavailable" }),
    });

    render(<Projects />);

    expect(await screen.findByText(/failed to load projects/i)).toBeInTheDocument();

    // No edit buttons should be present (or accessible) when list didn't load
    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();

    // Form should be disabled (as per your existing test behavior)
    const addBtn = screen.getByRole("button", { name: /add project/i });
    expect(addBtn).toBeDisabled();
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
