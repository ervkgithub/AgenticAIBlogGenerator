import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { ServiceTable } from "../src/features/dashboard/components/ServiceTable";
import { theme } from "../src/styles/theme";

describe("ServiceTable", () => {
  it("shows service state rows", () => {
    render(
      <ThemeProvider theme={theme}>
        <ServiceTable
          services={[
            {
              name: "Notification Hub",
              status: "warning",
              responseTime: "240 ms",
              load: "81%"
            }
          ]}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/notification hub/i)).toBeInTheDocument();
    expect(screen.getByText(/warning/i)).toBeInTheDocument();
    expect(screen.getByText(/240 ms/i)).toBeInTheDocument();
  });
});
