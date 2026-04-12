const express = require("express");
const http = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const regions = ["North Wing", "South Wing", "East Wing", "West Wing"];

const randomBetween = (min, max) => Math.round(Math.random() * (max - min) + min);

const buildSnapshot = () => {
  const activeSessions = randomBetween(120, 240);
  const throughput = randomBetween(860, 1340);
  const errorRate = Number((Math.random() * 2.4).toFixed(2));
  const satisfaction = randomBetween(88, 99);
  const queueDepth = randomBetween(12, 45);

  return {
    generatedAt: new Date().toISOString(),
    metrics: {
      activeSessions,
      throughput,
      errorRate,
      satisfaction,
      queueDepth
    },
    timeline: Array.from({ length: 8 }, (_, index) => ({
      label: `${8 - index}m`,
      value: randomBetween(50, 100)
    })).reverse(),
    services: [
      {
        name: "Booking Engine",
        status: errorRate > 2 ? "warning" : "healthy",
        responseTime: `${randomBetween(95, 220)} ms`,
        load: `${randomBetween(62, 88)}%`
      },
      {
        name: "Payment Gateway",
        status: activeSessions > 210 ? "warning" : "healthy",
        responseTime: `${randomBetween(115, 280)} ms`,
        load: `${randomBetween(48, 83)}%`
      },
      {
        name: "Notification Hub",
        status: queueDepth > 35 ? "warning" : "healthy",
        responseTime: `${randomBetween(80, 190)} ms`,
        load: `${randomBetween(28, 66)}%`
      },
      {
        name: "Insights API",
        status: "healthy",
        responseTime: `${randomBetween(70, 160)} ms`,
        load: `${randomBetween(35, 59)}%`
      }
    ],
    regions: regions.map((region) => ({
      name: region,
      occupancy: randomBetween(52, 98),
      incidents: randomBetween(0, 4)
    }))
  };
};

app.prepare().then(() => {
  const expressApp = express();
  const server = http.createServer(expressApp);
  const io = new Server(server);

  io.on("connection", (socket) => {
    socket.emit("dashboard:update", buildSnapshot());

    const interval = setInterval(() => {
      socket.emit("dashboard:update", buildSnapshot());
    }, 2500);

    socket.on("disconnect", () => {
      clearInterval(interval);
    });
  });

  expressApp.all("*", (req, res) => handle(req, res));

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
