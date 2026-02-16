import React from "react";

import type { Metadata } from "next";

import Cart from "@/components/Cart";

export const metadata: Metadata = {
  title: "Cart Page | NextCommerce Nextjs E-commerce template",
  description: "This is Cart Page for NextCommerce Template",

  // other metadata
};

const CartPage = () => {
  return (
    <>
      <Cart />
    </>
  );
};

export default CartPage;
