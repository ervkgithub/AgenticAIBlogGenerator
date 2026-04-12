import { render, screen } from "@testing-library/react";
import { CheckoutApp } from "../src/App";

describe("CheckoutApp", () => {
  it("renders subtotal and shipping eta", () => {
    render(
      <CheckoutApp
        cartCount={2}
        shippingEta="Arrives tomorrow"
        subtotal={220}
        trustSignals={["Secure payments"]}
      />
    );

    expect(screen.getByText("2 items ready to ship")).toBeInTheDocument();
    expect(screen.getByText("Arrives tomorrow")).toBeInTheDocument();
  });
});
