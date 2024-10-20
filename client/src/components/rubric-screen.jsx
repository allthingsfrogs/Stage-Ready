"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

function ScoreCard({ item }) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>{item.title}</span>
          <span className="text-2xl">{item.score}/5</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={item.score * 20} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">{item.suggestion}</p>
      </CardContent>
    </Card>
  );
}

export function RubricScreenJsx({ data }) {
  const router = useRouter();
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateScoresFromData = (data) => [
    {
      title: "Introduction",
      score: data.introductionScore,
      suggestion: data.introductionSuggestion,
    },
    {
      title: "Tone/Mood",
      score: data.toneAndModeScore,
      suggestion: data.toneAndModeSuggestion,
    },
    {
      title: "Smoothness/Flow",
      score: data.smoothnessAndFlowScore,
      suggestion: data.smoothnessAndFlowSuggestion,
    },
    {
      title: "Gets Point Across",
      score: data.getPointAcrossScore,
      suggestion: data.getPointAcrossSuggestion,
    },
    {
      title: "Conclusion",
      score: data.conclusionScore,
      suggestion: data.conclusionSuggestion,
    },
  ];

  useEffect(() => {
    const newScores = generateScoresFromData(data);
    setScores(newScores);
    setIsLoading(false);

    if (newScores.every((item) => item.score === 5)) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [data]);

 
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        Speech Evaluation Rubric
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {scores.map((item, index) => (
            <ScoreCard key={index} item={item} />
          ))}
          
        </>
      )}
    </div>
  );
}
