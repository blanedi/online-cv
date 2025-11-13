import os
import sys
from pathlib import Path
import subprocess
import importlib.util
import pytest

# Ensure project root is on sys.path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'app' / 'processors'))

# Create sample image
GEN_SCRIPT = ROOT / 'data' / 'samples' / 'generate_sample_image.py'
if GEN_SCRIPT.exists():
    subprocess.run([sys.executable, str(GEN_SCRIPT)], check=True)

SAMPLE_IMG = ROOT / 'data' / 'samples' / 'sample_image.png'

@pytest.mark.skipif(not SAMPLE_IMG.exists(), reason="Sample image missing")
def test_image_processor_smoke(monkeypatch):
    # Import ImageProcessor dynamically
    spec = importlib.util.spec_from_file_location('image_processor', str(ROOT / 'app' / 'processors' / 'image_processor.py'))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    ImageProcessor = getattr(module, 'ImageProcessor')

    # Monkeypatch pytesseract to avoid external tesseract dependency
    try:
        import pytesseract
        monkeypatch.setattr(pytesseract, 'image_to_string', lambda img, lang=None: '')
        monkeypatch.setattr(pytesseract, 'image_to_data', lambda img, output_type=None: {'conf': ['-1']})
    except ImportError:
        # If pytesseract not installed, add dummy module
        class Dummy:
            Output = type('O', (), {'DICT': None})
            @staticmethod
            def image_to_string(img, lang=None):
                return ''
            @staticmethod
            def image_to_data(img, output_type=None):
                return {'conf': ['-1']}
        sys.modules['pytesseract'] = Dummy

    # Monkeypatch cv2.CascadeClassifier to avoid haarcascade dependency
    try:
        import cv2
        class DummyCascade:
            def __init__(self, *args, **kwargs):
                pass
            def detectMultiScale(self, img, scaleFactor=1.1, minNeighbors=4):
                return []
        monkeypatch.setattr(cv2, 'CascadeClassifier', DummyCascade)
    except ImportError:
        # if opencv not installed, skip the test
        pytest.skip('opencv not installed')

    # Minimal config
    cfg = {'processing': {'ocr_languages': ['eng']}}
    processor = ImageProcessor(config=cfg)

    metadata = processor.process_image(str(SAMPLE_IMG))

    assert metadata['type'] == 'image'
    assert 'width' in metadata and 'height' in metadata
    assert 'hash' in metadata
