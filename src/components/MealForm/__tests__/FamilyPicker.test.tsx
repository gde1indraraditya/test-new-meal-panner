import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FamilyPicker from "../FamilyPicker";

const mockMembers = [
  { id: 1, name: "1st Child", code: "AA", emoji: "👶", isActive: true },
  { id: 2, name: "Father", code: "Papa", emoji: "👨", isActive: true },
  { id: 3, name: "Mother", code: "Mama", emoji: "👩", isActive: true },
];

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    json: () => Promise.resolve(mockMembers),
  } as Response);
});

describe("FamilyPicker", () => {
  it("renders all family members", async () => {
    render(<FamilyPicker selected={[]} onChange={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText("AA")).toBeInTheDocument();
    });
    expect(screen.getByText("Papa")).toBeInTheDocument();
    expect(screen.getByText("Mama")).toBeInTheDocument();
  });

  it("shows selected members with active style", async () => {
    render(<FamilyPicker selected={["AA", "Mama"]} onChange={vi.fn()} />);
    await waitFor(() => {
      const aaBtn = screen.getByText("AA").closest("button");
      expect(aaBtn?.className).toContain("border-blue-500");
    });
  });

  it("shows unselected members with default style", async () => {
    render(<FamilyPicker selected={["AA"]} onChange={vi.fn()} />);
    await waitFor(() => {
      const papaBtn = screen.getByText("Papa").closest("button");
      expect(papaBtn?.className).toContain("border-zinc-200");
    });
  });

  it("calls onChange with updated selection when toggled", async () => {
    const onChange = vi.fn();
    render(<FamilyPicker selected={["AA"]} onChange={onChange} />);
    await waitFor(() => {
      expect(screen.getByText("Papa")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Papa"));
    expect(onChange).toHaveBeenCalledWith(["AA", "Papa"]);
  });

  it("removes member from selection when toggled again", async () => {
    const onChange = vi.fn();
    render(<FamilyPicker selected={["AA", "Papa"]} onChange={onChange} />);
    await waitFor(() => {
      expect(screen.getByText("Papa")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Papa"));
    expect(onChange).toHaveBeenCalledWith(["AA"]);
  });

  it("renders emoji for members that have one", async () => {
    render(<FamilyPicker selected={[]} onChange={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText("👶")).toBeInTheDocument();
    });
  });
});
