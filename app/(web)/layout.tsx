import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
};

export default layout;
