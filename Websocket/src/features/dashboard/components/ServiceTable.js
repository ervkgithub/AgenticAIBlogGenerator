import styled from "styled-components";

export function ServiceTable({ services }) {
  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Status</th>
            <th>Latency</th>
            <th>Load</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.name}>
              <td>{service.name}</td>
              <td>
                <StatusBadge $status={service.status}>{service.status}</StatusBadge>
              </td>
              <td>{service.responseTime}</td>
              <td>{service.load}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrap>
  );
}

const TableWrap = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    text-align: left;
    padding: 12px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  }

  th {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 999px;
  text-transform: capitalize;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${({ $status }) =>
    $status === "healthy" ? "rgba(83, 242, 161, 0.12)" : "rgba(255, 203, 107, 0.14)"};
  color: ${({ theme, $status }) =>
    $status === "healthy" ? theme.colors.green : theme.colors.amber};
`;
