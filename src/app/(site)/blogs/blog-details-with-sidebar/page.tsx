import React from "react";

import type { Metadata } from "next";

import BlogDetailsWithSidebar from "@/components/BlogDetailsWithSidebar";

export const metadata: Metadata = {
  title: "Blog Details Page | NextCommerce Nextjs E-commerce template",
  description: "This is Blog Details Page for NextCommerce Template",

  // other metadata
};

const BlogDetailsWithSidebarPage = () => {
  return (
    <main>
      <BlogDetailsWithSidebar />
    </main>
  );
};

export default BlogDetailsWithSidebarPage;
