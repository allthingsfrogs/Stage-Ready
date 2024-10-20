import moviepy.editor as mp
from tempfile import NamedTemporaryFile

def split_video_into_segments(video_path, segment_duration=5):
    video = mp.VideoFileClip(video_path)
    duration = int(video.duration)
    segments = []

    for start in range(0, duration, segment_duration):
        end = min(start + segment_duration, duration)
        segment = video.subclip(start, end)
        temp_file = NamedTemporaryFile(delete=False, suffix=".mp4")
        segment.write_videofile(temp_file.name, codec="libx264", audio_codec="aac")
        segments.append(temp_file.name)

    return segments