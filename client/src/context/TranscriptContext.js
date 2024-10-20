"use client";

import React, { createContext, useState } from "react";

export const TranscriptContext = createContext({
  transcript: "",
  setTranscript: (transcript) => {},
});

export const TranscriptProvider = ({ children }) => {
  const [transcript, setTranscript] = useState("");

  return (
    <TranscriptContext.Provider value={{ transcript, setTranscript }}>
      {children}
    </TranscriptContext.Provider>
  );
};
