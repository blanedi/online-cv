import subprocess
import sys
import os

def main():
    """Launch the ICMPD Document Management System"""
    
    # Check if virtual environment is activated
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  Virtual environment not activated!")
        print("Please activate it first:")
        print("  Windows: venv\\Scripts\\activate")
        print("  Linux/Mac: source venv/bin/activate")
        return
    
    # Check dependencies
    try:
        import streamlit
        import pandas
        import transformers
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Run: pip install -r requirements.txt")
        return
    
    # Launch Streamlit app
    print("🚀 Launching ICMPD Document Management System...")
    print("📍 URL: http://localhost:8501")
    print("Press Ctrl+C to stop")
    
    subprocess.run([
        sys.executable, "-m", "streamlit", "run",
        "app/main.py",
        "--server.port=8501",
        "--server.address=localhost",
        "--browser.serverAddress=localhost",
        "--theme.primaryColor=#1e88e5"
    ])

if __name__ == "__main__":
    main()
