from flask import Flask, request, jsonify
import os
import asyncio
from analyze_expression import analyze_expression
from flask_cors import CORS
from transcribe import transcribe_file
import json

from run_chatmodel import run_chatmodel


app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/invoke', methods=['POST'])
def invoke():
    if request.method == 'POST':
        data = request.json
        if data and "speech" in data:
            result = run_chatmodel(data["speech"])
            return jsonify(result), 200
        return jsonify({"message": "Missing 'speech' field in request"}), 400
    
@app.route('/test', methods=['GET', 'POST'])
def test():
    if request.method == 'POST':
        data = request.json  # Use this for JSON payloads
        if data and "test" in data:
            return jsonify({"message": data["test"]}), 200
        return jsonify({"message": "Missing 'test' field in request"}), 400
    return jsonify({"message": "Server is up and running"}), 200

@app.route('/upload', methods=['POST'])
def upload_video():
    try:
        if 'video' not in request.files:
            print("No video file in request")
            return jsonify({"error": "No video file provided"}), 400

        video = request.files['video']
        
        if video.filename == '':
            print("No selected file")
            return jsonify({"error": "No selected file"}), 400

        # Create directory if it doesn't exist
        presentations_dir = os.path.join(os.path.dirname(__file__), 'presentations')
        os.makedirs(presentations_dir, exist_ok=True)

        # Generate unique filename
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"video_{timestamp}.mp4"
        video_path = os.path.join(presentations_dir, safe_filename)

        # Save the file
        try:
            video.save(video_path)
            print(f"Video saved to: {video_path}")
        except Exception as e:
            print(f"Error saving file: {str(e)}")
            return jsonify({"error": f"Error saving file: {str(e)}"}), 500

        # File analysis
        try:
            result = asyncio.run(analyze_expression(video_path))
            
            print("Analysis result:", result)
            
            return jsonify({
                "message": "Video uploaded and analyzed successfully",
                "path": video_path,
                "analysis": result,
            }), 200
            
        except Exception as e:
            print(f"Error during analysis: {str(e)}")
            return jsonify({"error": f"Error during analysis: {str(e)}"}), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

@app.route('/transcribe', methods=['POST'])
def transcribe():
    try:
        if 'video' not in request.files:
            print("No video file in request")
            return jsonify({"error": "No video file provided"}), 400

        video = request.files['video']
        
        if video.filename == '':
            print("No selected file")
            return jsonify({"error": "No selected file"}), 400

        # Create directory if it doesn't exist
        presentations_dir = os.path.join(os.path.dirname(__file__), 'presentations')
        os.makedirs(presentations_dir, exist_ok=True)

        # Generate unique filename
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"video_{timestamp}.mp4"
        video_path = os.path.join(presentations_dir, safe_filename)

        # Save the file
        try:
            video.save(video_path)
            print(f"Video saved to: {video_path}")
        except Exception as e:
            print(f"Error saving file: {str(e)}")
            return jsonify({"error": f"Error saving file: {str(e)}"}), 500

        # File analysis
        try:
            transcribe_string = asyncio.run(transcribe_file(video_path))
            transcribe_result = json.loads(transcribe_string)
            
            print("Transcription result:", transcribe_result)
            
            return jsonify({
                "transcription": transcribe_result
            }), 200
            
        except Exception as e:
            print(f"Error during analysis: {str(e)}")
            return jsonify({"error": f"Error during analysis: {str(e)}"}), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)