"""
Generate a small PNG sample image in data/samples/ for tests and examples.
This script writes a 1x1 red PNG (small) to `data/samples/sample_image.png`.
"""
import base64
from pathlib import Path

PNG_B64 = (
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMA"
    "AQAABQABDQottAAAAABJRU5ErkJggg=="
)

OUT = Path(__file__).resolve().parent / "sample_image.png"

def generate():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open('wb') as f:
        f.write(base64.b64decode(PNG_B64))
    print(f"Wrote sample image to {OUT}")

if __name__ == '__main__':
    generate()
