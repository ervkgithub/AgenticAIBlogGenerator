import styled from "styled-components";
import { useDashboardStream } from "./useDashboardStream";
import { StatCard } from "./components/StatCard";
import { ActivityChart } from "./components/ActivityChart";
import { ServiceTable } from "./components/ServiceTable";
import { RegionGrid } from "./components/RegionGrid";

const metricsConfig = [
  { key: "activeSessions", label: "Active Sessions", suffix: "" },
  { key: "throughput", label: "Throughput/hr", suffix: "" },
  { key: "errorRate", label: "Error Rate", suffix: "%" },
  { key: "satisfaction", label: "Satisfaction", suffix: "%" }
];

export default function DashboardPage() {
  const { data, isConnected } = useDashboardStream();

  return (
    <Shell>
      <HeroPanel>
        <HeroCopy>
          <Eyebrow>SPA Dashboard</Eyebrow>
          <Title>PulseOps real-time command center</Title>
          <Subtitle>
            Track live traffic, service health, occupancy, and operational trends
            from one responsive Next.js dashboard.
          </Subtitle>
        </HeroCopy>

        <ConnectionBadge $connected={isConnected}>
          <span />
          {isConnected ? "Live stream connected" : "Reconnecting"}
        </ConnectionBadge>
      </HeroPanel>

      <StatsGrid>
        {metricsConfig.map((metric) => (
          <StatCard
            key={metric.key}
            label={metric.label}
            value={`${data.metrics[metric.key]}${metric.suffix}`}
          />
        ))}
        <StatCard label="Queue Depth" value={data.metrics.queueDepth} />
      </StatsGrid>

      <ContentGrid>
        <FeaturePanel>
          <PanelHeader>
            <div>
              <PanelEyebrow>Traffic</PanelEyebrow>
              <PanelTitle>Live activity pulse</PanelTitle>
            </div>
            <PanelMeta>
              Last refresh{" "}
              {data.generatedAt
                ? new Date(data.generatedAt).toLocaleTimeString()
                : "--:--:--"}
            </PanelMeta>
          </PanelHeader>
          <ActivityChart data={data.timeline} />
        </FeaturePanel>

        <FeaturePanel>
          <PanelHeader>
            <div>
              <PanelEyebrow>Reliability</PanelEyebrow>
              <PanelTitle>Service health board</PanelTitle>
            </div>
          </PanelHeader>
          <ServiceTable services={data.services} />
        </FeaturePanel>
      </ContentGrid>

      <FeaturePanel>
        <PanelHeader>
          <div>
            <PanelEyebrow>Locations</PanelEyebrow>
            <PanelTitle>Regional occupancy overview</PanelTitle>
          </div>
        </PanelHeader>
        <RegionGrid regions={data.regions} />
      </FeaturePanel>
    </Shell>
  );
}

const Shell = styled.main`
  padding: 32px;
  display: grid;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const HeroPanel = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 32px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    linear-gradient(135deg, rgba(16, 39, 61, 0.94), rgba(7, 18, 29, 0.86)),
    ${({ theme }) => theme.colors.panel};
  box-shadow: ${({ theme }) => theme.shadows.panel};

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 24px;
  }
`;

const HeroCopy = styled.div`
  max-width: 720px;
`;

const Eyebrow = styled.p`
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: ${({ theme }) => theme.colors.cyan};
  font-size: 0.72rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.8rem);
  line-height: 0.95;
`;

const Subtitle = styled.p`
  margin: 16px 0 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1rem;
  max-width: 620px;
  line-height: 1.6;
`;

const ConnectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 999px;
  background: ${({ $connected, theme }) =>
    $connected ? "rgba(83, 242, 161, 0.12)" : "rgba(255, 111, 145, 0.14)"};
  border: 1px solid
    ${({ $connected, theme }) =>
      $connected ? "rgba(83, 242, 161, 0.32)" : "rgba(255, 111, 145, 0.3)"};
  color: ${({ $connected, theme }) =>
    $connected ? theme.colors.green : theme.colors.red};
  font-weight: 600;

  span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 18px currentColor;
  }
`;

const StatsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ContentGrid = styled.section`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturePanel = styled.section`
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.panel};
  backdrop-filter: blur(14px);
  box-shadow: ${({ theme }) => theme.shadows.panel};
  padding: 24px;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
`;

const PanelEyebrow = styled.p`
  margin: 0 0 6px;
  color: ${({ theme }) => theme.colors.cyan};
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
`;

const PanelMeta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
`;
