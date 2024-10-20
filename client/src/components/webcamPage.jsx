"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import { useReactMediaRecorder } from "react-media-recorder";
import { Loader2 } from "lucide-react";
import ClientComponent from "./ClientComponent";
import { useContext } from "react";

export default function WebcamAppComponent({ accessToken }) {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  const [nextScreen, setNextScreen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      video: true,
      blobPropertyBag: { type: "video/mp4" },
      mediaRecorderOptions: { mimeType: "video/mp4" },
      onStop: (blobUrl, blob) => {
        setRecordedBlob(blob);
      },
    });

  useEffect(() => {
    if (recordedBlob && nextScreen) {
      handleSave();
    }
  }, [recordedBlob, nextScreen]);

  const handleSave = async () => {
    if (isUploading || !recordedBlob) return;

    try {
      setIsUploading(true);
      setError("");

      console.log("Blob size:", recordedBlob.size);
      console.log("Blob type:", recordedBlob.type);
      console.log("Blob:", recordedBlob);

      const formData = new FormData();
      formData.append("video", recordedBlob, "video.mp4");

      console.log("Form data:", formData);

      const uploadResponse = await fetch("http://127.0.0.1:5000/transcribe", {
        method: "POST",
        body: formData,
      });

      const jsonUploadResponse = await uploadResponse.json();

      const realTranscript = await jsonUploadResponse["transcription"][
        "results"
      ]["channels"][0]["alternatives"][0]["transcript"];

      console.log("Transcript:", realTranscript);

      setTranscript(realTranscript);
    } catch (error) {
      console.error("Error details:", error);
      // setError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const startSpeech = useCallback(() => {
    setIsRunning(true);
    startRecording();
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  }, [startRecording]);

  const endSpeech = useCallback(() => {
    setIsRunning(false);
    stopRecording();
    clearInterval(timerRef.current);
    setNextScreen(true);
  }, [stopRecording]);

  const restartSpeech = useCallback(() => {
    setIsRunning(false);
    clearBlobUrl();
    stopRecording();
    clearInterval(timerRef.current);
    setTime(0);
    setNextScreen(false);
    setRecordedBlob(null);
    setError("");
  }, [clearBlobUrl, stopRecording]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (nextScreen) {
    return (
      <div className="flex flex-col h-screen bg-gray-900">
        <div className="relative flex-grow">
          {/* <video
            src={mediaBlobUrl}
            controls
            className="absolute inset-0 w-full h-full object-cover"
          /> */}
          <ClientComponent accessToken={accessToken} transcript={transcript} />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
              <span className="ml-2 text-white">Uploading...</span>
            </div>
          )}
          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-500 text-white p-2 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="relative flex-grow">
        <Webcam
          audio={false}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent h-24">
          <div className="container mx-auto px-4 h-full flex justify-between items-center">
            <div className="flex space-x-4">
              {!isRunning ? (
                <Button
                  onClick={startSpeech}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Start Speech
                </Button>
              ) : (
                <>
                  <Button
                    onClick={endSpeech}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    End Speech
                  </Button>
                  <Button
                    onClick={restartSpeech}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Restart
                  </Button>
                </>
              )}
            </div>
            <div className="text-3xl font-mono text-white">
              {formatTime(time)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
