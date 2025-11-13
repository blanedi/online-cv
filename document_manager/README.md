# Document Management & Classification System

A small, opinionated Document Management & Classification System built with Streamlit for interactive use and a set of Python utilities for parsing, extracting, indexing and classifying documents. This project contains OCR, text extraction (PDF, DOCX, PPTX, images), preprocessing, embeddings (sentence-transformers / transformers), and classification/search capabilities.

## Contents
- `requirements.txt` — pinned Python dependencies for the project.
- `app/` — Streamlit app entrypoints and UI components (if present).
- `components/` — reusable modules and UI components.
- `models/` — trained models, model-wrapper utilities, or model definitions.
- `processors/` — document parsers, OCR wrappers, and text extraction utilities.
- `utils/` — helper utilities for I/O, logging, and common helpers.

> Note: This repository is organized for local development and research experimentation. Adjust folder names and structure as needed for production deployments.

## Quick Start
These steps assume you're in the `icmpd_document_manager` directory.

1. Create and activate a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate
```

2. Install dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

3. System dependencies

- Tesseract OCR: required for `pytesseract`. Install via your package manager:
  - Ubuntu/Debian: `sudo apt-get install tesseract-ocr`
  - macOS (Homebrew): `brew install tesseract`

- Poppler (recommended) for `pdfplumber`/PDF rasterization if you need to extract images from PDFs:
  - Ubuntu/Debian: `sudo apt-get install poppler-utils`
  - macOS: `brew install poppler`

- Optional: CUDA-enabled PyTorch for GPU acceleration. Install the appropriate `torch` wheel for your CUDA version if you have an NVIDIA GPU. See https://pytorch.org for instructions.

4. Run the Streamlit app (if an app entrypoint exists, e.g. `app/main.py`)

```bash
streamlit run app/main.py
```

Adjust the path to the Streamlit entrypoint file in the `app/` directory if different.

## Environment variables / Configuration
Create a `.env` file to set runtime configuration (optional). Example variables:

```env
# .env
TESSERACT_CMD=/usr/bin/tesseract
MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
DATABASE_URL=sqlite:///./data/documents.db
```

Load `.env` variables using `python-dotenv` or your preferred method.

## Features
- OCR of images using Tesseract (`pytesseract`).
- Text extraction from PDFs (`pdfplumber`), DOCX (`python-docx`), PPTX (`python-pptx`), and spreadsheets (`openpyxl`).
- Image processing with OpenCV and Pillow.
- Embedding generation via `sentence-transformers` or `transformers`.
- Document classification with `scikit-learn` or transformer-based classifiers.
- Simple UI built with Streamlit for upload, preview, processing and searching.
- Persistence via SQLAlchemy (configurable to use SQLite, Postgres, etc.).
- Optional front-end enhancements using `streamlit-aggrid` and `streamlit-dropzone`.

## Typical workflows
- Ingest: Upload documents (PDF/DOCX/Images) via Streamlit UI or a watch folder (using `watchdog`) and parse them into text and metadata.
- Preprocess: Clean text (remove headers/footers, normalize whitespace, language detection if needed).
- Index: Compute embeddings and store them alongside metadata in a vector store or a SQL table.
- Search & Classify: Run semantic search with embeddings or apply classification models to route documents into categories.

## Project conventions and contract
- Inputs: files (PDF, DOCX, PPTX, images), optional metadata (source, date, tags).
- Outputs: extracted text, embeddings (NumPy arrays), metadata records persisted to a database, classification labels.
- Error modes: corrupted files, missing OCR binary, model download failures, out-of-memory for large batches.

Edge cases to watch for:
- Scanned PDFs (images inside PDFs) — ensure `pdfplumber` + OCR pipeline is used.
- Very large PDFs — consider page-by-page processing and batching embeddings.
- Non-Latin scripts — ensure Tesseract language packs are installed and models support the script.

## Testing
Add lightweight tests in `tests/` or `__tests__/` to validate parsing and a small end-to-end pipeline. Example with `pytest`:

```bash
pip install pytest
pytest -q
```

## Troubleshooting
- pytesseract cannot find tesseract binary: set `TESSERACT_CMD` env var or ensure tesseract is in PATH.
- PDF text is empty: file may be scanned — run OCR on PDF page images.
- `torch` installation fails: install a matching wheel for your Python and CUDA version or use CPU-only torch.

## Deployment notes
- For production, containerize the app with Docker. Ensure system packages (Tesseract, Poppler) are included in the image.
- Use a managed vector DB (e.g., Pinecone, Milvus) or a dedicated Postgres + pgvector for large-scale embeddings.
- Secure file uploads and sanitize filenames. Use object storage (S3) for large files in production.

### Docker (optional)

A `Dockerfile` is included at the repository root of this project (`Dockerfile`) that installs required system packages (Tesseract, Poppler, ffmpeg, and image libs) and Python dependencies from `requirements.txt`.

Build and run (local, CPU):

```bash
# from the `icmpd_document_manager` directory
docker build -t icmpd-docs:latest .
docker run --rm -p 8501:8501 icmpd-docs:latest
```

Run with environment file and mounted data (recommended for local development):

```bash
docker run --rm -p 8501:8501 \
  --env-file .env \
  -v $(pwd)/data:/app/data \
  icmpd-docs:latest
```

Notes and tips:
- The provided Dockerfile installs CPU-only `torch` from PyPI. If you require GPU acceleration, use a CUDA base image and install a matching `torch` wheel for your CUDA version — I can add a GPU variant if needed.
- To include additional Tesseract language packs, either install language-specific packages (e.g. `tesseract-ocr-deu`) in the image or copy `*.traineddata` files into `/usr/share/tesseract-ocr/4.00/tessdata/`.
- Keep secrets out of the image; use `--env-file` (as above) or secret managers in production.

### Docker build troubleshooting

If `docker build` fails (for example you saw a non-zero exit code when building the image), these steps help surface and fix common issues:

- Re-run the build with plain progress to see full stdout/stderr during package installs:

```bash
docker build --progress=plain -t icmpd-docs:latest .
```

- Common problems and fixes:
  - pip install failures: inspect the build logs above the pip install step for the failing package and the underlying reason (missing system headers, incompatible wheel, network error). Often adding `build-essential` and `ca-certificates` to the image resolves compile-time builds for some packages.
  - Missing PDF tools: If your code uses `pdfplumber` to rasterize or extract images from PDFs, install `poppler-utils` in the image (Debian/Ubuntu) to provide `pdftoppm`.
  - OpenCV / image libs: packages such as `opencv-python` may need system libraries like `libgl1`, `libsm6` and `libxext6` present in the image.
  - Tesseract language packs: if OCR fails for non-English documents, install language packages like `tesseract-ocr-fra` or copy `.traineddata` files into the tessdata folder.

- Example: a fuller set of system packages that resolves many pip/build issues on Debian-based images:

```Dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential ca-certificates wget curl \
    poppler-utils \
    tesseract-ocr tesseract-ocr-eng tesseract-ocr-fra tesseract-ocr-deu \
    ffmpeg \
    libgl1 libglib2.0-0 libsm6 libxext6 \
  && rm -rf /var/lib/apt/lists/*
```

- If a package fails to install via pip due to a missing binary wheel for your Python version, either pin a compatible version in `requirements.txt` or install the package from source by adding the required system headers/tools (see the example above).

- If you want, I can add a second Dockerfile (`Dockerfile.full`) that contains the fuller set of system packages (poppler, OpenCV runtime libs and build tools). This image will be larger but more likely to succeed for the full feature set.

If you share the failing build logs (the lines around the pip install error), I can suggest a targeted fix or update the Dockerfile for you.


## Security & privacy
- Documents may contain sensitive information. Restrict access, encrypt data at rest, and follow your organization's data policies.
- If using third-party APIs or model hosting, review data-sharing policies.

## Next steps / Improvements
- Add a sample Streamlit walkthrough (`app/example_app.py`) and sample documents in `data/samples/`.
- Add automated tests for each parser (`pdfplumber`, `python-docx`, `pytesseract`) and CI pipeline to run them.
- Add a minimal Dockerfile and GitHub Actions workflow to lint/install/test.

## License & Contact
Add your license and contact info here (e.g., `LICENSE` file or author/maintainer email).

---

If you'd like, I can:
- Add a minimal `app/main.py` Streamlit starter scaffold.
- Add a `Dockerfile` and a simple `docker-compose.yml` for local testing.
- Create sample documents and a small smoke test that verifies installation and parsing for one PDF/image.

Tell me which of the above you'd like next and I will add it.