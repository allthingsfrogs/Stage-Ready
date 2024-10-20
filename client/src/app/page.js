"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { SpeechAiSettingsModal } from "@/components/speech-ai-settings-modal";
import { fetchAccessToken } from "hume";

// import { TranscriptContext } from "@/context/transcriptContext";

const WebcamAppComponent = dynamic(() => import("../components/WebcamPage"), {
  ssr: false, // Disable server-side rendering for this component
});
export default async function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  // const [transcript, setTranscript] = useState("");

  const accessToken = await fetchAccessToken({
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    secretKey:
    process.env.NEXT_PUBLIC_SECRET_KEY,
  });

  console.log(await accessToken);

  if (!accessToken) {
    throw new Error();
  }

  return (
    <main className="relative min-h-screen">
      <WebcamAppComponent accessToken={accessToken} />
      {/* <SpeechAiSettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      /> */}
    </main>
  );
}
