import styled from "styled-components";

export function RegionGrid({ regions }) {
  return (
    <Grid>
      {regions.map((region) => (
        <Card key={region.name}>
          <RegionName>{region.name}</RegionName>
          <Occupancy>{region.occupancy}% occupied</Occupancy>
          <Meta>{region.incidents} incidents today</Meta>
          <Meter>
            <MeterFill $width={region.occupancy} />
          </Meter>
        </Card>
      ))}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: rgba(16, 39, 61, 0.7);
`;

const RegionName = styled.h3`
  margin: 0 0 12px;
  font-size: 1rem;
`;

const Occupancy = styled.p`
  margin: 0 0 6px;
  font-weight: 700;
  font-size: 1.3rem;
`;

const Meta = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Meter = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
`;

const MeterFill = styled.div`
  width: ${({ $width }) => `${$width}%`};
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #53f2a1, #41d9ff);
`;
