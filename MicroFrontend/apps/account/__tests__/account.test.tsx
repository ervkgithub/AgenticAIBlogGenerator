import { render, screen } from "@testing-library/react";
import { AccountApp } from "../src/App";

describe("AccountApp", () => {
  it("renders the user and next action", () => {
    render(
      <AccountApp
        completionRate={80}
        nextBestActions={["Turn on MFA"]}
        tier="Gold"
        userName="Jordan"
      />
    );

    expect(screen.getByText("Welcome back, Jordan")).toBeInTheDocument();
    expect(screen.getByText("Turn on MFA")).toBeInTheDocument();
  });
});
