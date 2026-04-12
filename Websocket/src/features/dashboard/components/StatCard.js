import styled from "styled-components";

export function StatCard({ label, value }) {
  return (
    <Card>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Card>
  );
}

const Card = styled.article`
  padding: 22px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: linear-gradient(180deg, rgba(16, 39, 61, 0.9), rgba(7, 18, 29, 0.9));
  box-shadow: ${({ theme }) => theme.shadows.panel};
`;

const Label = styled.p`
  margin: 0 0 10px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
`;

const Value = styled.strong`
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1;
`;
