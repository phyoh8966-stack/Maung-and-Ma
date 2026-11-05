import Hero from "@/components/Hero";
import CountdownTimer from "@/components/CountdownTimer";
import InvitationCard from "@/components/InvitationCard";
import Timeline from "@/components/Timeline";
import Venue from "@/components/Venue";
import Gallery from "@/components/Gallery";
import LoveNote from "@/components/LoveNote";
import WeddingGift from "@/components/WeddingGift";
import RSVP from "@/components/RSVP";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-stone-800 selection:bg-rose-100">
      <Hero />
      <CountdownTimer />
      <InvitationCard />
      <Timeline />
      <Venue />
      <Gallery />
      <LoveNote />
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <RSVP />
      </section>
      <WeddingGift />
      <MusicPlayer />
    </main>
  );
}