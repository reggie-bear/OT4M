import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About — One Thing for Men",
  description:
    "Since 2009, One Thing for Men has been spurring men in Alpharetta, Georgia toward a closer walk with God through expository teaching, accountability, and brotherhood.",
};

export default function About() {
  return <AboutContent />;
}
