# StageReady

## Inspiration
Our inspiration for this project was our personal experience of struggling to prepare for public speaking. Whether through previous hackathons, class projects, or poster presentations, we all have had trouble practicing our speeches. The anxiety of public speaking makes it difficult to want to practice with other people and has been a common obstacle preventing us from improving our speech skills. We learned that many people are too shy to seek to rehearse their speeches with others. This motivated us to create an app that provides non-judgmental feedback based on facial expressions and speech patterns, empowering individuals to practice and perfect their public speaking skills in a human-free, non-judgemental environment.

## What it does
Our project starts with a web app where the user can record their presentation in front of their camera. After their presentation concludes, a Q&A takes place with **hume's EVI** (Empathic Voice Interface) within the context of their speech and a custom prompt. Additionally, we used **Deepgram's voice platform** to transcribe the user's speech. **Groq** then parses this speech to rate the user's speaking ability and provide feedback on what they can do to improve.

## How we built it
The frontend of our web application was created using react.js as well as shadcn, a component library. The backend of our application uses hume ai as the main technology. We use the face model in their expression measurement tool to gather values for different emotions/expressions the user exhibits in their speech. These values are then evaluated by Groq which provides a rating for the user's presentation in a friendly, yet helpful manner. The other component of our project is the Q&A portion where the user is asked questions based on the topic they discussed. 

## Challenges we ran into
The biggest challenge we ran into was trying to seamlessly integrate three major technologies into the project; those being hume ai, Deepgram, and Google Gemini. Learning all of these technologies on the spot was challenge enough, but finding a way to connect them all was another level of difficult. It was also a challenge testing the code as the wait times for getting output was rather slow and quickly added up, which meant we had to sparingly re-run our code.

## Accomplishments that we're proud of
We're proud of successfully integrating Hume AI and Deepgram, offering actionable feedback on both emotional expressions and speech content. Bringing together facial expression analysis and a post-speech Q&A with an empathetic voice interface (EVI) is something we believe will make practicing speeches much more interactive and insightful for users.

We're also proud of our ability to transcribe speech in real time and use Google Gemini's NLP to analyze and score it for clarity, structure, and impact. These components, working together, form the basis of a comprehensive feedback system that helps users improve their presentation skills with each use.

## What we learned
One major thing we learned was using GitHub to collaborate with backend and frontend developers simultaenously. With one teammate new to hackathons, it was crucial to learn version control for easy management of our codebase. Despite not ultimately using it, we learned about natural language processing (NLP) with Google Gemini. One more thing we learned was how to integrate an AI model into our project with hume ai's face model. This experience emphasized the critical role that emotional awareness plays in effective communication and taught us to appreciate the nuances that come with empathic interactions.

## What's next for Oratix
Moving forward, we plan to enhance our application by refining the feedback mechanism. We want to introduce real-time analysis of their face expressions as well as prosody, so they can adjust accordingly during the presentation rather than after. Another feature we want to add is combining EVI with a live avatar. This will simulate interacting with a human who might nod along or acknowledge statements from the presenter throughout their talk.

### Demo
[![Watch the video](![HumeAppThumbnail](https://github.com/user-attachments/assets/ae86f484-3af4-49f6-8bde-2d6a694d9fa2)
)]([https://youtu.be/T-D1KVIuvjA](https://youtu.be/X6ClOymHh9o))
