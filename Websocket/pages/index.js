import Head from "next/head";
import DashboardPage from "../src/features/dashboard/DashboardPage";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>PulseOps Dashboard</title>
        <meta
          name="description"
          content="Real-time operational dashboard built with Next.js, Socket.IO and styled-components."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <DashboardPage />
    </>
  );
}
