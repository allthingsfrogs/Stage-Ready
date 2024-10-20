// "use client";

// import React, { useState, useEffect, useRef, useContext } from "react";
// import { ChevronUp, ChevronDown } from "lucide-react";
// import { useVoice } from "@humeai/voice-react";
// import { RubricScreenJsx } from "./rubric-screen";

// export default function VideoCallCollapsibleTranscriptJsx({ transcript2 }) {
//   const [isQAActive, setIsQAActive] = useState(false);
//   const [time, setTime] = useState(0);
//   const [transcript, setTranscript] = useState([]);
//   const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);
//   const intervalRef = useRef(null);
//   const videoRef = useRef(null);
//   const [nextScreen, setNextScreen] = useState(false);
//   const { connect, disconnect, readyState, messages } = useVoice();

//   useEffect(() => {
//     if (isQAActive) {
//       intervalRef.current = setInterval(() => {
//         setTime((prevTime) => prevTime + 1);
//         // Simulate adding to transcript every 5 seconds
//         if ((time + 1) % 5 === 0) {
//           setTranscript((prev) => [
//             ...prev,
//             `Q&A message at ${formatTime(time + 1)}`,
//           ]);
//         }
//       }, 1000);
//     } else {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [isQAActive, time]);

//   useEffect(() => {
//     if (videoRef.current) {
//       navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then((stream) => {
//           if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//           }
//         })
//         .catch((err) => console.error("Error accessing webcam:", err));
//     }
//   }, []);

//   const toggleQA = () => {
//     setIsQAActive(!isQAActive);
//     if (isQAActive) {
//       setTime(0);
//       setTranscript([]);
//       disconnect();
//       setNextScreen(true);
//     } else {
//       connect();
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const toggleTranscript = () => {
//     setIsTranscriptVisible(!isTranscriptVisible);
//   };

//   const defaultRubricData = {
//     introductionScore: 1,
//     introductionSuggestion:
//       "Your introduction needs significant improvement. Consider adding a compelling hook to grab the audience's attention right from the start.",
//     toneAndModeScore: 1,
//     toneAndModeSuggestion:
//       "The tone and mood of your speech need work. Try to align your delivery with the content and audience expectations.",
//     smoothnessAndFlowScore: 1,
//     smoothnessAndFlowSuggestion:
//       "The speech lacks smooth transitions. Focus on connecting your ideas more cohesively to improve the overall flow.",
//     getPointAcrossScore: 1,
//     getPointAcrossSuggestion:
//       "Your main point wasn't clearly conveyed. Ensure you state your key message early and reinforce it throughout the speech.",
//     conclusionScore: 1,
//     conclusionSuggestion:
//       "Your conclusion needs strengthening. End with a strong statement or call to action to leave a lasting impression on the audience.",
//   };

//   if (nextScreen) {
//     // const response = fetch("http://127.0.0.1:5000/invoke", {
//     //   method: "POST",
//     //   body: { speech: transcript2 },
//     // }).then((res) => console.log(res.json()));

//     // const defaultRubricData = {
//     //   introductionScore: 1,
//     //   introductionSuggestion:
//     //     "Your introduction needs significant improvement. Consider adding a compelling hook to grab the audience's attention right from the start.",
//     //   toneAndModeScore: 1,
//     //   toneAndModeSuggestion:
//     //     "The tone and mood of your speech need work. Try to align your delivery with the content and audience expectations.",
//     //   smoothnessAndFlowScore: 1,
//     //   smoothnessAndFlowSuggestion:
//     //     "The speech lacks smooth transitions. Focus on connecting your ideas more cohesively to improve the overall flow.",
//     //   getPointAcrossScore: 1,
//     //   getPointAcrossSuggestion:
//     //     "Your main point wasn't clearly conveyed. Ensure you state your key message early and reinforce it throughout the speech.",
//     //   conclusionScore: 1,
//     //   conclusionSuggestion:
//     //     "Your conclusion needs strengthening. End with a strong statement or call to action to leave a lasting impression on the audience.",
//     // };

//     return (
//       <div>
//         <RubricScreenJsx data={defaultRubricData} />
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen w-screen flex">
//       <div className="w-1/2 relative">
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         {isTranscriptVisible && (
//           <div className="absolute inset-0 bg-black bg-opacity-50 overflow-y-auto p-4">
//             <h2 className="text-2xl font-bold mb-4 text-white">Transcript</h2>
//             <div className="max-h-[50vh]">
//               {messages.map((msg, index) => {
//                 if (
//                   msg.type === "user_message" ||
//                   msg.type === "assistant_message"
//                 ) {
//                   return (
//                     <div key={msg.type + index} className="text-white">
//                       <div>{msg.message.role}</div>
//                       <div>{msg.message.content}</div>
//                     </div>
//                   );
//                 }
//               })}
//             </div>
//           </div>
//         )}
//         <button
//           onClick={toggleTranscript}
//           className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full"
//         >
//           {isTranscriptVisible ? (
//             <ChevronDown className="w-6 h-6" />
//           ) : (
//             <ChevronUp className="w-6 h-6" />
//           )}
//         </button>
//       </div>
//       <div className="w-1/2 relative">
//         <img
//           src="/placeholder.svg?height=1080&width=1920"
//           alt="Avatar"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//       </div>
//       <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center bg-black bg-opacity-50 p-4">
//         <button
//           onClick={toggleQA}
//           className={`px-6 py-3 rounded-full text-white font-bold text-lg transition-colors duration-300 ${
//             isQAActive
//               ? "bg-red-500 hover:bg-red-600"
//               : "bg-green-500 hover:bg-green-600"
//           }`}
//         >
//           {isQAActive ? "End Q&A" : "Start Q&A"}
//         </button>
//         <div className="text-3xl font-bold text-white">{formatTime(time)}</div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useVoice } from "@humeai/voice-react";
import { RubricScreenJsx } from "./rubric-screen";
import Image from 'next/image'
import Logo from '../../public/images/notion-avatar-1729440657136.png'

export default function VideoCallCollapsibleTranscriptJsx({ transcript2 }) {
  const [isQAActive, setIsQAActive] = useState(false);
  const [time, setTime] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);
  const intervalRef = useRef(null);
  const videoRef = useRef(null);
  const [nextScreen, setNextScreen] = useState(false);
  const { connect, disconnect, readyState, messages } = useVoice();
  const [rubricData, setRubricData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false)


  useEffect(() => {
    if (isQAActive) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        // Simulate adding to transcript every 5 seconds
        if ((time + 1) % 5 === 0) {
          setTranscript((prev) => [
            ...prev,
            `Q&A message at ${formatTime(time + 1)}`,
          ]);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isQAActive, time]);

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Error accessing webcam:", err));
    }
  }, []);

  useEffect(() => {
    if (nextScreen) {
      setIsLoading(true);
      fetch("http://127.0.0.1:5000/invoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ speech: transcript2 }),
      })
        .then((res) => res.json())
        .then((data) => {
          setRubricData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching rubric data:", err);
          setError("Failed to fetch rubric data. Please try again.");
          setIsLoading(false);
        });
    }
  }, [nextScreen, transcript2]);

  const toggleQA = () => {
    setIsQAActive(!isQAActive);
    if (isQAActive) {
      setTime(0);
      setTranscript([]);
      disconnect();
      setNextScreen(true);
    } else {
      connect();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleTranscript = () => {
    setIsTranscriptVisible(!isTranscriptVisible);
  };

  if (nextScreen) {
    if (isLoading) {
      return <div>Loading rubric data...</div>;
    }
    if (error) {
      return <div>{error}</div>;
    }
    if (rubricData) {
      return <RubricScreenJsx data={rubricData} />;
    }
    return null;
  }

  return (
    <div className="h-screen w-screen flex">
      <div className="w-1/2 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        {isTranscriptVisible && (
          <div className="absolute inset-0 bg-black bg-opacity-50 overflow-y-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-white">Transcript</h2>
            <div className="max-h-[50vh]">
              {messages.map((msg, index) => {
                if (
                  msg.type === "user_message" ||
                  msg.type === "assistant_message"
                ) {
                  return (
                    <div key={msg.type + index} className="text-white">
                      <div>{msg.message.role}</div>
                      <div>{msg.message.content}</div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
        <button
          onClick={toggleTranscript}
          className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full"
        >
          {isTranscriptVisible ? (
            <ChevronDown className="w-6 h-6" />
          ) : (
            <ChevronUp className="w-6 h-6" />
          )}
        </button>
      </div>
      <div className="w-1/2 relative flex items-center justify-center bg-white">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
        <Image
          src={Logo}
          alt="Notion Avatar"
          width={300}
          height={300}
          className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center bg-black bg-opacity-50 p-4">
        <button
          onClick={toggleQA}
          className={`px-6 py-3 rounded-full text-white font-bold text-lg transition-colors duration-300 ${
            isQAActive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isQAActive ? "End Q&A" : "Start Q&A"}
        </button>
        <div className="text-3xl font-bold text-white">{formatTime(time)}</div>
      </div>
    </div>
  );
}
