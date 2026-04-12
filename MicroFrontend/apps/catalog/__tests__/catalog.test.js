import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { CatalogApp } from "../src/App";
describe("CatalogApp", () => {
    it("renders section title and item names", () => {
        render(_jsx(CatalogApp, { items: [{ id: "1", name: "Router", category: "Network", price: 249, trend: "up" }], sectionTitle: "Trending products" }));
        expect(screen.getByText("Trending products")).toBeInTheDocument();
        expect(screen.getByText("Router")).toBeInTheDocument();
    });
});
