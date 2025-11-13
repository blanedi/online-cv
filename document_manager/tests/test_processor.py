import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.processors.document_processor import DocumentProcessor
from app.models.classifier import DocumentClassifier
import yaml


def test_document_processing():
    """Test document processing pipeline"""
    
    # Load config
    with open('config/config.yaml', 'r') as f:
        config = yaml.safe_load(f)
    
    # Initialize processor
    processor = DocumentProcessor(config)
    
    # Test with a sample PDF
    test_file = "data/uploads/sample.pdf"
    
    if os.path.exists(test_file):
        result = processor.process_pdf(test_file)
        print("PDF Processing Result:")
        print(result)
        
        # Test classification
        classifier = DocumentClassifier('config/config.yaml')
        if 'sample_text' in result:
            classification = classifier.classify(result['sample_text'])
            print("\nClassification Result:")
            print(classification)
    else:
        print(f"Test file {test_file} not found")


if __name__ == "__main__":
    test_document_processing()
