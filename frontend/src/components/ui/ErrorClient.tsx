"use client";

import Link from "next/link";

export default function ErrorClient() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main>
      <h1>Something Went Wrong</h1>
      <p>The requested resource encountered a connection failure or timeout. Please check your network and retry.</p>
      <div>
        <button onClick={handleRetry}>Retry Connection</button>
        <Link href="/">Return Home</Link>
      </div>
    </main>
  );
}
