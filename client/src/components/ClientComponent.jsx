// // ./components/ClientComponent.tsx
// "use client";
// import { VoiceProvider } from "@humeai/voice-react";
// import VideoCallCollapsibleTranscriptJsx from "./video-call-collapsible-transcript";

// export default function ClientComponent({ accessToken }) {
//   return (
//     <VoiceProvider
//       auth={{ type: "accessToken", value: accessToken }}
//       //   configId=""
//     >
//       <VideoCallCollapsibleTranscriptJsx />
//     </VoiceProvider>
//   );
// }

"use client";

import { VoiceProvider } from "@humeai/voice-react";
// import dynamic from "next/dynamic";

import VideoCallCollapsibleTranscriptJsx from "./video-call-collapsible-transcript";

// const VideoCallCollapsibleTranscriptJsx = dynamic(
//   () => import("./video-call-collapsible-transcript"),
//   { ssr: false }
// );

export default function ClientComponent({ accessToken, transcript }) {
  const sessionSettings = {
    type: "session_settings",
    variables: {
      speech: transcript,
    },
  };
  return (
    <VoiceProvider
      auth={{ type: "accessToken", value: accessToken }}
      configId="7fe55681-f3d3-4243-be99-11f9d7a2634e"
      sessionSettings={sessionSettings}
    >
      <VideoCallCollapsibleTranscriptJsx transcript2={transcript} />
    </VoiceProvider>
  );
}
