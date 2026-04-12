import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import DashboardPage from "../src/features/dashboard/DashboardPage";
import { theme } from "../src/styles/theme";

jest.mock("../src/features/dashboard/useDashboardStream", () => ({
  useDashboardStream: () => ({
    isConnected: true,
    data: {
      generatedAt: "2026-04-13T10:00:00.000Z",
      metrics: {
        activeSessions: 178,
        throughput: 1042,
        errorRate: 1.2,
        satisfaction: 96,
        queueDepth: 18
      },
      timeline: [
        { label: "1m", value: 62 },
        { label: "2m", value: 74 },
        { label: "3m", value: 81 },
        { label: "4m", value: 69 },
        { label: "5m", value: 95 },
        { label: "6m", value: 88 },
        { label: "7m", value: 72 },
        { label: "8m", value: 79 }
      ],
      services: [
        {
          name: "Booking Engine",
          status: "healthy",
          responseTime: "120 ms",
          load: "72%"
        }
      ],
      regions: [
        { name: "North Wing", occupancy: 76, incidents: 1 },
        { name: "South Wing", occupancy: 62, incidents: 0 }
      ]
    }
  })
}));

describe("DashboardPage", () => {
  it("renders live dashboard content", () => {
    render(
      <ThemeProvider theme={theme}>
        <DashboardPage />
      </ThemeProvider>
    );

    expect(
      screen.getByRole("heading", { name: /pulseops real-time command center/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/live stream connected/i)).toBeInTheDocument();
    expect(screen.getByText("178")).toBeInTheDocument();
    expect(screen.getByText(/booking engine/i)).toBeInTheDocument();
    expect(screen.getByText(/north wing/i)).toBeInTheDocument();
  });
});
