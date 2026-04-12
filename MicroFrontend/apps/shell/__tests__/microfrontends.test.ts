import { remoteDefinitions } from "../lib/microfrontends";

describe("remoteDefinitions", () => {
  it("registers four independently hosted microfrontends", () => {
    expect(remoteDefinitions).toHaveLength(4);
    expect(remoteDefinitions.map((remote) => remote.route)).toEqual([
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3004"
    ]);
  });
});
