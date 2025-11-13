import cv2
import pytesseract
from PIL import Image
import numpy as np
from typing import Dict, Any
import hashlib
from datetime import datetime

class ImageProcessor:
    def __init__(self, config: dict):
        self.config = config
        self.ocr_languages = config['processing']['ocr_languages']
        
    def process_image(self, file_path: str) -> Dict[str, Any]:
        """Extract metadata and perform OCR on images"""
        metadata = {
            'type': 'image',
            'processed_at': datetime.now().isoformat()
        }
        
        try:
            # Open image with PIL
            img = Image.open(file_path)
            
            # Basic metadata
            metadata['format'] = img.format
            metadata['mode'] = img.mode
            metadata['size'] = img.size
            metadata['width'] = img.width
            metadata['height'] = img.height
            
            # EXIF data if available
            if hasattr(img, '_getexif') and img._getexif():
                exif = img._getexif()
                metadata['has_exif'] = True
                # Extract key EXIF tags
                exif_data = {}
                for tag, value in exif.items():
                    if tag in [271, 272, 274, 282, 283]:  # Make, Model, Orientation, XRes, YRes
                        exif_data[tag] = str(value)
                metadata['exif_sample'] = exif_data
            
            # Perform OCR
            try:
                ocr_text = pytesseract.image_to_string(
                    img, 
                    lang='+'.join(self.ocr_languages[:3])  # Use first 3 languages
                )
                metadata['ocr_text'] = ocr_text[:2000]  # Limit to 2000 chars
                metadata['has_text'] = len(ocr_text.strip()) > 10
                
                # Get OCR confidence
                ocr_data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
                confidences = [int(conf) for conf in ocr_data['conf'] if int(conf) > 0]
                if confidences:
                    metadata['ocr_confidence'] = sum(confidences) / len(confidences)
                
            except Exception as ocr_error:
                metadata['ocr_error'] = str(ocr_error)
                metadata['has_text'] = False
            
            # Image analysis with OpenCV
            img_cv = cv2.imread(file_path)
            
            # Color analysis
            metadata['is_grayscale'] = len(img_cv.shape) == 2 or img_cv.shape[2] == 1
            
            if not metadata['is_grayscale']:
                # Dominant colors
                pixels = img_cv.reshape(-1, 3)
                from sklearn.cluster import KMeans
                kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
                kmeans.fit(pixels)
                dominant_colors = kmeans.cluster_centers_.astype(int).tolist()
                metadata['dominant_colors'] = dominant_colors
            
            # Edge detection for complexity analysis
            gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY) if not metadata['is_grayscale'] else img_cv
            edges = cv2.Canny(gray, 100, 200)
            metadata['edge_density'] = np.sum(edges > 0) / edges.size
            
            # Face detection
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            metadata['face_count'] = len(faces)
            
            # Calculate file hash
            with open(file_path, 'rb') as f:
                metadata['hash'] = hashlib.md5(f.read()).hexdigest()
                
        except Exception as e:
            metadata['error'] = str(e)
            
        return metadata
    
    def create_thumbnail(self, file_path: str, output_path: str, size=(300, 300)):
        """Create thumbnail for quick preview"""
        try:
            img = Image.open(file_path)
            img.thumbnail(size, Image.Resampling.LANCZOS)
            img.save(output_path)
            return True
        except Exception as e:
            return False
