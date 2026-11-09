import React from "react";
import { render, screen, fireEvent, waitFor, within, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import i18n from "@/i18n";
import { resetMockDatabase } from "@/api/mock";
import { AdminUsers } from "./Users";

// The real dialog uses antd portals; render it inline so the walkthrough can be
// driven by Testing Library without portal/responsive polyfills.
vi.mock("@/components/Modal", () => ({
  Modal: ({ open, title, children }) =>
    open ? (
      <div role="dialog" aria-label={title}>
        {children}
      </div>
    ) : null,
}));

const LINKS_KEY = "links";

const reset = () => {
  resetMockDatabase();
  localStorage.removeItem(LINKS_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.setItem("i18nextLng", "en");
};

const renderRoster = async () => {
  render(<AdminUsers />);
  await screen.findByText("Manage accounts");
  await screen.findByText("Sophal");
};

const studentCard = (name) => screen.getByText(name).closest("article");

const openCreate = async () => {
  fireEvent.click(screen.getByRole("button", { name: /add user/i }));
  return screen.findByRole("dialog", { name: "Create account" });
};

const fill = (label, value, scope = screen) => {
  fireEvent.change(scope.getByLabelText(label), { target: { value } });
};

beforeEach(async () => {
  reset();
  await i18n.changeLanguage("en");
});

afterEach(async () => {
  cleanup();
  vi.restoreAllMocks();
  await i18n.changeLanguage("en");
});

describe("admin student roster walkthrough", () => {
  it("registers a student, flags missing fields, and rejects a duplicate identity", async () => {
    await renderRoster();
    const dialog = await openCreate();

    fireEvent.submit(dialog.querySelector("form"));

    await waitFor(() =>
      expect(screen.getByText("Please enter the student's name.")).toBeInTheDocument()
    );
    expect(screen.getByText("Please enter a sign-in identity.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a year level.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a class.")).toBeInTheDocument();

    fill("Full name", "New Learner", within(dialog));
    fill("Email", "new.learner@example.com", within(dialog));
    fill("Year level", "Grade 1", within(dialog));
    fill("Class", "1A", within(dialog));
    fireEvent.submit(dialog.querySelector("form"));

    await screen.findByText("New Learner");

    const duplicateDialog = await openCreate();
    fill("Full name", "Duplicate Learner", within(duplicateDialog));
    fill("Email", "NEW.LEARNER@EXAMPLE.COM", within(duplicateDialog));
    fill("Year level", "Grade 1", within(duplicateDialog));
    fill("Class", "1A", within(duplicateDialog));
    fireEvent.submit(duplicateDialog.querySelector("form"));

    await screen.findByText("That sign-in identity is already registered.");
  });

  it("finds students by search and class, then clears every filter in one action", async () => {
    await renderRoster();

    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "student" } });
    const classFilter = await screen.findByLabelText("Class");
    expect(screen.getByText("Sophal")).toBeInTheDocument();
    expect(screen.getByText("Sophea")).toBeInTheDocument();
    expect(screen.getByText("Dara")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/search by name/i), { target: { value: "sophal" } });
    expect(screen.getByText("Sophal")).toBeInTheDocument();
    expect(screen.queryByText("Sophea")).toBeNull();
    expect(screen.queryByText("Dara")).toBeNull();

    fireEvent.change(screen.getByLabelText(/search by name/i), { target: { value: "" } });
    fireEvent.change(classFilter, { target: { value: "2A" } });
    expect(screen.getByText("Sophea")).toBeInTheDocument();
    expect(screen.queryByText("Sophal")).toBeNull();

    fireEvent.change(screen.getByLabelText(/search by name/i), { target: { value: "nobody" } });
    expect(screen.getByText("No accounts match your filters.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(screen.getByText("Sophal")).toBeInTheDocument();
    expect(screen.getByText("Sophea")).toBeInTheDocument();
    expect(screen.getByText("Dara")).toBeInTheDocument();
    expect(screen.getByLabelText("Role")).toHaveValue("all");
  });

  it("corrects a student's details", async () => {
    await renderRoster();

    fireEvent.click(within(studentCard("Sophal")).getByRole("button", { name: "Edit" }));
    const dialog = await screen.findByRole("dialog", { name: "Edit account" });

    fill("Full name", "Sophal Updated", within(dialog));
    fireEvent.submit(dialog.querySelector("form"));

    await screen.findByText("Sophal Updated");
    expect(screen.queryByText("Sophal")).toBeNull();
  });

  it("states that removal is permanent, cancels safely, then removes on confirm", async () => {
    await renderRoster();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

    fireEvent.click(
      within(studentCard("Sophal")).getByRole("button", { name: "Delete user Sophal" })
    );

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    const prompt = confirmSpy.mock.calls[0][0];
    expect(prompt).toMatch(/permanently/i);
    expect(prompt).toMatch(/cannot be undone/i);
    expect(prompt).toMatch(/can be recovered/i);
    expect(screen.getByText("Sophal")).toBeInTheDocument();

    confirmSpy.mockReturnValue(true);
    fireEvent.click(
      within(studentCard("Sophal")).getByRole("button", { name: "Delete user Sophal" })
    );

    await waitFor(() => expect(screen.queryByText("Sophal")).toBeNull());
  });

  it("deactivates without removing and keeps delete as a separate action", async () => {
    await renderRoster();

    fireEvent.click(within(studentCard("Sophal")).getByRole("button", { name: "Deactivate" }));

    await waitFor(() =>
      expect(within(studentCard("Sophal")).getByText("Inactive")).toBeInTheDocument()
    );
    expect(
      within(studentCard("Sophal")).getByRole("button", { name: "Delete user Sophal" })
    ).toBeInTheDocument();
    expect(
      within(studentCard("Sophal")).getByRole("button", { name: "Activate" })
    ).toBeInTheDocument();
  });

  it("renders in Arabic with right-to-left direction", async () => {
    await i18n.changeLanguage("ar");
    render(<AdminUsers />);

    await screen.findByText("إدارة الحسابات");
    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("ar");
  });
});
