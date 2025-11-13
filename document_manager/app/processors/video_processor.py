import cv2
from moviepy.editor import VideoFileClip
import numpy as np
from typing import Dict, Any, List
from datetime import datetime
import os

class VideoProcessor:
    def __init__(self, config: dict):
        self.config = config
        
    def process_video(self, file_path: str) -> Dict[str, Any]:
        """Extract metadata from video files"""
        metadata = {
            'type': 'video',
            'processed_at': datetime.now().isoformat()
        }
        
        try:
            # Use moviepy for basic metadata
            clip = VideoFileClip(file_path)
            
            metadata['duration'] = clip.duration
            metadata['fps'] = clip.fps
            metadata['size'] = list(clip.size)
            metadata['width'] = clip.size[0]
            metadata['height'] = clip.size[1]
            
            # Audio information
            if clip.audio:
                metadata['has_audio'] = True
                metadata['audio_fps'] = clip.audio.fps
                metadata['audio_channels'] = clip.audio.nchannels
            else:
                metadata['has_audio'] = False
            
            clip.close()
            
            # Use OpenCV for frame analysis
            cap = cv2.VideoCapture(file_path)
            
            metadata['frame_count'] = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            metadata['codec'] = int(cap.get(cv2.CAP_PROP_FOURCC))
            
            # Extract sample frames for analysis
            sample_frames = self.extract_sample_frames(cap, num_frames=5)
            
            # Analyze sample frames
            if sample_frames:
                # Scene complexity
                complexities = []
                for frame in sample_frames:
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    edges = cv2.Canny(gray, 100, 200)
                    complexity = np.sum(edges > 0) / edges.size
                    complexities.append(complexity)
                
                metadata['avg_complexity'] = np.mean(complexities)
                
                # Detect if mostly static (like presentation recording)
                if len(sample_frames) > 1:
                    differences = []
                    for i in range(1, len(sample_frames)):
                        diff = cv2.absdiff(sample_frames[i-1], sample_frames[i])
                        differences.append(np.mean(diff))
                    
                    metadata['is_static'] = np.mean(differences) < 10
                else:
                    metadata['is_static'] = False
            
            cap.release()
            
            # File size
            metadata['file_size_mb'] = os.path.getsize(file_path) / (1024 * 1024)
            
        except Exception as e:
            metadata['error'] = str(e)
            
        return metadata
    
    def extract_sample_frames(self, cap, num_frames=5) -> List[np.ndarray]:
        """Extract evenly spaced frames from video"""
        frames = []
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        if total_frames < num_frames:
            num_frames = total_frames
            
        if total_frames > 0:
            indices = np.linspace(0, total_frames - 1, num_frames, dtype=int)
            
            for idx in indices:
                cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
                ret, frame = cap.read()
                if ret:
                    frames.append(frame)
                    
        return frames
    
    def extract_thumbnail(self, file_path: str, output_path: str, time_point=2):
        """Extract a thumbnail from video at specified time point"""
        try:
            clip = VideoFileClip(file_path)
            
            # Get frame at time_point seconds (or middle if video is shorter)
            time = min(time_point, clip.duration / 2)
            frame = clip.get_frame(time)
            
            # Convert to PIL Image and save
            from PIL import Image
            img = Image.fromarray(frame.astype('uint8'), 'RGB')
            img.thumbnail((300, 300), Image.Resampling.LANCZOS)
            img.save(output_path)
            
            clip.close()
            return True
            
        except Exception as e:
            return False
