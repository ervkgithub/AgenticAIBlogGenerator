import styled from "styled-components";

export function ActivityChart({ data }) {
  const maxValue = Math.max(...data.map((point) => point.value), 100);

  return (
    <ChartWrap>
      {data.map((point) => (
        <BarGroup key={point.label}>
          <Bar $height={(point.value / maxValue) * 100} />
          <BarLabel>{point.label}</BarLabel>
        </BarGroup>
      ))}
    </ChartWrap>
  );
}

const ChartWrap = styled.div`
  min-height: 290px;
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  align-items: end;
  gap: 14px;
`;

const BarGroup = styled.div`
  display: grid;
  gap: 12px;
  justify-items: center;
  height: 100%;
`;

const Bar = styled.div`
  width: 100%;
  min-height: 28px;
  height: ${({ $height }) => `${$height}%`};
  border-radius: 18px 18px 8px 8px;
  background: linear-gradient(180deg, #41d9ff 0%, #0a7ca0 100%);
  box-shadow: inset 0 0 18px rgba(255, 255, 255, 0.15);
`;

const BarLabel = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.8rem;
`;
