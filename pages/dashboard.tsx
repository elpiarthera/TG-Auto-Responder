import type { NextPage } from "next";
import Head from "next/head";
import React from "react";

const Dashboard: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Dashboard - Telegram Auto Responder</title>
        <meta
          name="description"
          content="Dashboard for Telegram Auto Responder"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Dashboard</h1>
        {/* Add your dashboard content here */}
      </main>
    </div>
  );
};
export default Dashboard;
