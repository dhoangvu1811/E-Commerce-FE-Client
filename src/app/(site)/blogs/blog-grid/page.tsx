import React from "react";

import type { Metadata } from "next";

import BlogGrid from "@/components/BlogGrid";

export const metadata: Metadata = {
  title: "Blog Grid Page | NextCommerce Nextjs E-commerce template",
  description: "This is Blog Grid Page for NextCommerce Template",

  // other metadata
};

const BlogGridPage = () => {
  return (
    <main>
      <BlogGrid />
    </main>
  );
};

export default BlogGridPage;
