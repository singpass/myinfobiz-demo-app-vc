import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <Script
        type="module"
        src="https://cdn.jsdelivr.net/npm/@govtechsg/sgds-web-component/Masthead/index.js"
      ></Script>
      <div style={{ visibility: !mounted ? "hidden" : "visible" }}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
