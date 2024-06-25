import React from "react";
import { Analytics } from "@vercel/analytics/react";
import "@/assets/styles/globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Visor League",
};

// Prevent Vercel Data Cache on all fetch requests
export const fetchCache = "force-no-store";

const MainLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
};

export default MainLayout;
