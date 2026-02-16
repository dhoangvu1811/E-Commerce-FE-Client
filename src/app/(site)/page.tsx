import type { Metadata } from "next";

import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "NextCommerce | Nextjs E-commerce template",
  description: "This is Home for NextCommerce Template",

  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
