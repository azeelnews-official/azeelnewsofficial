import type { Metadata } from "next";

import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";

import { LiveTvPlayer } from "@/components/live-tv/LiveTvPlayer";

import {
  getLiveChannels,
  getLiveSchedule,
} from "@/lib/data/live-tv";


export const metadata: Metadata = {
  title:"Live TV",
  description:"Watch AZEEL NEWS live coverage",
};


export default async function LiveTvPage(){

  const liveChannels =
    await getLiveChannels();


  const liveSchedule =
    await getLiveSchedule();


  return (
    <>
      <TopBar />
      <Header />

      <main className="mx-auto max-w-[1400px] px-4 py-10">

        <LiveTvPlayer
          liveChannels={liveChannels}
          liveSchedule={liveSchedule}
        />

      </main>

      <Footer />
      <CookieConsent />
    </>
  );
}
