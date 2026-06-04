import type { Metadata } from "next";
import DonateContent from "./DonateContent";

export const metadata: Metadata = {
  title: "Donate — One Thing for Men",
  description:
    "Every dollar given to One Thing for Men is poured right back into the ministry. Support weekly Bible gatherings for men in Alpharetta, GA.",
};

export default function Donate() {
  return <DonateContent />;
}
