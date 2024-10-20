import os
import asyncio
from dotenv import load_dotenv

from deepgram import (
    DeepgramClient,
    PrerecordedOptions,
    FileSource,
)

load_dotenv()

# Path to the audio file
AUDIO_FILE = "presentations/TestSpeech.mp4"

API_KEY = os.getenv("DEEPGRAM_API_KEY")



async def transcribe_file(file_path):
    try:
        # STEP 1 Create a Deepgram client using the API key
        deepgram = DeepgramClient(API_KEY)

        with open(file_path, "rb") as file:
            buffer_data = file.read()

        payload: FileSource = {
            "buffer": buffer_data,
        }

        #STEP 2: Configure Deepgram options for audio analysis
        options = PrerecordedOptions(
            model="nova-2",
            smart_format=True,
        )

        # STEP 3: Call the transcribe_file method with the text payload and options
        response = deepgram.listen.prerecorded.v("1").transcribe_file(payload, options, timeout = 300)

        # STEP 4: Print the response
        results = response.to_json(indent=4)

        return results
    except Exception as e:
        print(f"Exception: {e}")

