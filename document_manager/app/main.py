import streamlit as st
import pandas as pd
from pathlib import Path
import yaml
import os
import sys
from datetime import datetime
import plotly.express as px
import plotly.graph_objects as go
import networkx as nx
from typing import List, Dict
import json

# Add app directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import processors and models
from processors.document_processor import DocumentProcessor
from processors.image_processor import ImageProcessor  
from processors.video_processor import VideoProcessor
from models.classifier import DocumentClassifier
from utils.database import DatabaseManager
from utils.graph_builder import GraphBuilder

# Page configuration
st.set_page_config(
    page_title="ICMPD Document Management System",
    page_icon="📄",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .uploadedFile {
        border: 2px dashed #1e88e5;
        border-radius: 10px;
        padding: 20px;
        background-color: #f5f5f5;
    }
    .stProgress > div > div > div > div {
        background-color: #1e88e5;
    }
    .success-message {
        padding: 1rem;
        border-radius: 0.5rem;
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }
    .metric-card {
        background-color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
</style>
""", unsafe_allow_html=True)

# Load configuration
@st.cache_resource
def load_config():
    with open('config/config.yaml', 'r') as f:
        return yaml.safe_load(f)

# Initialize components
@st.cache_resource
def init_components():
    config = load_config()
    
    components = {
        'config': config,
        'doc_processor': DocumentProcessor(config),
        'img_processor': ImageProcessor(config),
        'vid_processor': VideoProcessor(config),
        'classifier': DocumentClassifier('config/config.yaml'),
        'db_manager': DatabaseManager(config),
        'graph_builder': GraphBuilder(config)
    }
    
    return components

# Initialize session state
if 'processed_files' not in st.session_state:
    st.session_state.processed_files = []
if 'current_batch' not in st.session_state:
    st.session_state.current_batch = []
if 'graph_data' not in st.session_state:
    st.session_state.graph_data = None

# Load components
components = init_components()
config = components['config']

# Header
st.title("📄 ICMPD Document Management System")
st.markdown(f"**Version {config['app']['version']}** | {config['app']['organization']}")

# Sidebar
with st.sidebar:
    st.header("⚙️ Settings")
    
    # Processing options
    st.subheader("Processing Options")
    enable_ocr = st.checkbox("Enable OCR", value=True)
    enable_classification = st.checkbox("Auto-classify", value=True)
    enable_graph = st.checkbox("Build relationships", value=True)
    
    # Filter options
    st.subheader("Filters")
    selected_categories = st.multiselect(
        "Categories",
        options=list(config['classification']['categories'].keys()),
        default=list(config['classification']['categories'].keys())
    )
    
    # Statistics
    if st.session_state.processed_files:
        st.subheader("📊 Statistics")
        total_files = len(st.session_state.processed_files)
        st.metric("Total Files", total_files)
        
        df = pd.DataFrame(st.session_state.processed_files)
        if 'category' in df.columns:
            category_counts = df['category'].value_counts()
            for cat, count in category_counts.items():
                if cat in selected_categories:
                    color = config['classification']['categories'].get(cat, {}).get('color', '#666')
                    st.markdown(f"<div style='color: {color}'>📁 {cat}: {count}</div>", 
                              unsafe_allow_html=True)

# Main content area
tab1, tab2, tab3, tab4 = st.tabs(["📤 Upload & Process", "📊 Dashboard", "🔗 Document Graph", "🔍 Search & Export"])

# Tab 1: Upload and Process
with tab1:
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header("Upload Documents")
        
        # File uploader
        uploaded_files = st.file_uploader(
            "Drop files here or click to browse",
            type=['pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'png', 'mp4', 'avi'],
            accept_multiple_files=True,
            help="Supported formats: PDF, Word, Excel, PowerPoint, Images, Videos"
        )
        
        if uploaded_files:
            st.info(f"📎 {len(uploaded_files)} file(s) selected")
            
            # Process button
            if st.button("🚀 Process Files", type="primary"):
                progress_bar = st.progress(0)
                status_text = st.empty()
                
                results = []
                
                for idx, uploaded_file in enumerate(uploaded_files):
                    status_text.text(f"Processing {uploaded_file.name}...")
                    progress_bar.progress((idx + 1) / len(uploaded_files))
                    
                    # Save uploaded file temporarily
                    temp_path = Path(config['storage']['upload_folder']) / uploaded_file.name
                    temp_path.parent.mkdir(exist_ok=True)
                    
                    with open(temp_path, 'wb') as f:
                        f.write(uploaded_file.getbuffer())
                    
                    # Process based on file type
                    file_ext = Path(uploaded_file.name).suffix.lower()[1:]
                    
                    file_metadata = {
                        'filename': uploaded_file.name,
                        'size_mb': uploaded_file.size / (1024 * 1024),
                        'upload_time': datetime.now().isoformat()
                    }
                    
                    # Process file
                    try:
                        if file_ext in config['processing']['supported_formats']['documents']:
                            metadata = components['doc_processor'].process_document(str(temp_path), file_ext)
                        elif file_ext in config['processing']['supported_formats']['images']:
                            metadata = components['img_processor'].process_image(str(temp_path))
                        elif file_ext in config['processing']['supported_formats']['videos']:
                            metadata = components['vid_processor'].process_video(str(temp_path))
                        else:
                            metadata = {'error': 'Unsupported file type'}
                        
                        file_metadata.update(metadata)
                        
                        # Classify if enabled
                        if enable_classification and 'sample_text' in metadata:
                            classification = components['classifier'].classify(
                                metadata.get('sample_text', '') + ' ' + metadata.get('ocr_text', ''),
                                metadata
                            )
                            file_metadata.update(classification)
                        elif enable_classification and 'ocr_text' in metadata:
                            classification = components['classifier'].classify(
                                metadata.get('ocr_text', ''),
                                metadata
                            )
                            file_metadata.update(classification)
                        else:
                            file_metadata['category'] = 'unclassified'
                            file_metadata['confidence'] = 0.0
                        
                        results.append(file_metadata)
                        
                    except Exception as e:
                        file_metadata['error'] = str(e)
                        file_metadata['category'] = 'error'
                        results.append(file_metadata)
                
                # Store results
                st.session_state.current_batch = results
                st.session_state.processed_files.extend(results)
                
                # Save to database
                components['db_manager'].save_batch(results)
                
                # Build graph if enabled
                if enable_graph:
                    st.session_state.graph_data = components['graph_builder'].build_graph(
                        st.session_state.processed_files
                    )
                
                progress_bar.progress(1.0)
                status_text.text("✅ Processing complete!")
                
                # Show success message
                st.markdown(
                    f"<div class='success-message'>Successfully processed {len(results)} file(s)</div>",
                    unsafe_allow_html=True
                )
    
    with col2:
        st.header("Recent Processing")
        
        if st.session_state.current_batch:
            for file in st.session_state.current_batch[-5:]:  # Show last 5
                with st.expander(f"📄 {file['filename'][:30]}..."):
                    st.json({
                        'Category': file.get('category', 'N/A'),
                        'Confidence': f"{file.get('confidence', 0):.2%}",
                        'Type': file.get('type', 'N/A'),
                        'Size': f"{file.get('size_mb', 0):.2f} MB",
                        'Error': file.get('error', 'None')
                    })
