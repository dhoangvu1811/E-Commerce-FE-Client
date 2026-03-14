import type { Metadata } from "next";

import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: 'Contact | Commerce',
  description: 'Contact page for customer support and feedback',

  // other metadata
}

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  )
}

export default ContactPage
