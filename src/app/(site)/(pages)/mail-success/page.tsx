import React from "react";

import type { Metadata } from "next";

import MailSuccess from "@/components/MailSuccess";

export const metadata: Metadata = {
  title: "Mail Success Page | NextCommerce Nextjs E-commerce template",
  description: "This is Mail Success Page for NextCommerce Template",

  // other metadata
};

const MailSuccessPage = () => {
  return (
    <main>
      <MailSuccess />
    </main>
  );
};

export default MailSuccessPage;
