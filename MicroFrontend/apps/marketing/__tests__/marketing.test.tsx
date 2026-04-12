import { render, screen } from "@testing-library/react";
import { MarketingApp } from "../src/App";

describe("MarketingApp", () => {
  it("renders the marketing headline and action", () => {
    render(
      <MarketingApp
        featuredHighlights={["A", "B", "C"]}
        headline="Independent marketing deployment"
        primaryActionHref="#"
        primaryActionLabel="Launch"
        supportingCopy="Team-owned experience."
      />
    );

    expect(screen.getByText("Independent marketing deployment")).toBeInTheDocument();
    expect(screen.getByText("Launch")).toBeInTheDocument();
  });
});
