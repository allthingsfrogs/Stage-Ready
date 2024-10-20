import asyncio
import os
import time
import json
from hume import AsyncHumeClient
from hume.expression_measurement.batch import Face, Models
from hume.expression_measurement.batch.types import InferenceBaseRequest, EmotionScore, FacePrediction
from dotenv import load_dotenv
from typing import List

load_dotenv()
HUME_API_KEY = os.getenv("HUME_API_KEY")
if not HUME_API_KEY:
    raise ValueError("HUME_API_KEY is not set. Please check your .env file.")

async def analyze_expression(filepath: str):
    # Initialize an authenticated client
    client = AsyncHumeClient(api_key=HUME_API_KEY)

    results = []
    with open(filepath, mode="rb") as file:
        # Create configurations for each model you would like to use (blank = default)
        face_config = Face()

        # Create a Models object
        models_chosen = Models(face=face_config)
        
        # Create a stringified object containing the configuration
        stringified_configs = InferenceBaseRequest(models=models_chosen)

        # Start an inference job and get the job_id
        job_id = await client.expression_measurement.batch.start_inference_job_from_local_file(
            json=stringified_configs, file=[file]
        )

        # Poll for job completion
        while True:
            job_details = await client.expression_measurement.batch.get_job_details(job_id)
            if job_details.state.status == "COMPLETED":
                break
            elif job_details.state.status == "FAILED":
                raise Exception(f"Job {job_id} failed with message: {job_details.state.message}")
            time.sleep(5)  # Wait for 5 seconds before polling again

        # Get the result of the job
        job_predictions = await client.expression_measurement.batch.get_job_predictions(job_id)
        
        # Convert job_predictions to a serializable format
        job_predictions_serializable = [convert_to_dict(prediction) for prediction in job_predictions]

        # Define the directory where you want to save the JSON file
        output_dir = os.path.join("CalHacks11", "server", "presentations")
        os.makedirs(output_dir, exist_ok=True)  # Create the directory if it doesn't exist

        # Define the full path for the JSON file
        output_file_path = os.path.join(output_dir, "job_predictions.json")

        # Store the result in a JSON file
        with open(output_file_path, 'w') as json_file:
            json.dump(job_predictions_serializable, json_file, indent=4)

        for prediction in job_predictions:
            results.extend(prediction.results.predictions)  # Extend the results list with job predictions

    # Process the results to generate feedback
    feedback = generate_feedback(results)
    return feedback

def convert_to_dict(obj):
    """
    Convert an object to a dictionary.
    """
    if isinstance(obj, list):
        return [convert_to_dict(item) for item in obj]
    elif hasattr(obj, "__dict__"):
        return {key: convert_to_dict(value) for key, value in obj.__dict__.items()}
    else:
        return obj

def sort_emotions(emotions: List[EmotionScore]):
    return sorted(emotions, key=lambda e: e.score, reverse=True)

def generate_feedback(predictions):
    feedback = []

    for prediction in predictions:
        for grouped_prediction in prediction.models.face.grouped_predictions:
            for face_prediction in grouped_prediction.predictions:
                sorted_emotions = sort_emotions(face_prediction.emotions)
                feedback.append(f"Frame {face_prediction.frame}:")
                for emotion in sorted_emotions:
                    feedback.append(f"  {emotion.name}: {emotion.score:.2f}")

    return "\n".join(feedback)

if __name__ == "__main__":
    # Example usage
    filepaths = [
        "example_video.mp4"
    ]
    result = asyncio.run(analyze_expression(filepaths[0]))
    print(result)