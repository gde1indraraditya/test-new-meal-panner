import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import StarRating from "../StarRating";

describe("StarRating", () => {
  it("renders 5 stars", () => {
    const { container } = render(<StarRating value={3} />);
    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(5);
  });

  it("fills stars up to the value", () => {
    const { container } = render(<StarRating value={3} />);
    const stars = container.querySelectorAll("button");
    expect(stars[0].textContent).toBe("★");
    expect(stars[1].textContent).toBe("★");
    expect(stars[2].textContent).toBe("★");
    expect(stars[3].textContent).toBe("☆");
    expect(stars[4].textContent).toBe("☆");
  });

  it("renders all empty when value is null", () => {
    const { container } = render(<StarRating value={null} />);
    const stars = container.querySelectorAll("button");
    stars.forEach((star) => {
      expect(star.textContent).toBe("☆");
    });
  });

  it("renders all empty when value is 0", () => {
    const { container } = render(<StarRating value={0} />);
    const stars = container.querySelectorAll("button");
    stars.forEach((star) => {
      expect(star.textContent).toBe("☆");
    });
  });

  it("calls onChange when a star is clicked", () => {
    const onChange = vi.fn();
    const { container } = render(<StarRating value={null} onChange={onChange} />);
    const stars = container.querySelectorAll("button");
    fireEvent.click(stars[2]);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("does not call onChange when readonly", () => {
    const onChange = vi.fn();
    const { container } = render(<StarRating value={3} onChange={onChange} readonly />);
    const stars = container.querySelectorAll("button");
    fireEvent.click(stars[0]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not call onChange when no handler provided", () => {
    const { container } = render(<StarRating value={3} />);
    const stars = container.querySelectorAll("button");
    fireEvent.click(stars[0]);
  });
});
