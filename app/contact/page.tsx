import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact & Join — One Thing for Men",
  description:
    "Join One Thing for Men in Alpharetta, GA. Every Friday morning at 7 AM — Building 300, 410 Rucker Road. No RSVP needed.",
};

export default function Contact() {
  return <ContactContent />;
}
