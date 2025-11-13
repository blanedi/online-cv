from sqlalchemy import create_engine, Column, String, Float, DateTime, Text, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import pandas as pd
from datetime import datetime
import json

Base = declarative_base()

class Document(Base):
    __tablename__ = 'documents'
    
    id = Column(Integer, primary_key=True)
    filename = Column(String(255))
    file_type = Column(String(50))
    category = Column(String(100))
    confidence = Column(Float)
    size_mb = Column(Float)
    hash = Column(String(100))
    metadata = Column(Text)
    processed_at = Column(DateTime, default=datetime.now)
    sample_text = Column(Text)
    
class DatabaseManager:
    def __init__(self, config):
        self.engine = create_engine(config['storage']['database_url'])
        Base.metadata.create_all(self.engine)
        Session = sessionmaker(bind=self.engine)
        self.session = Session()
    
    def save_batch(self, documents):
        """Save batch of documents to database"""
        for doc in documents:
            db_doc = Document(
                filename=doc.get('filename'),
                file_type=doc.get('type'),
                category=doc.get('category'),
                confidence=doc.get('confidence', 0),
                size_mb=doc.get('size_mb', 0),
                hash=doc.get('hash'),
                metadata=json.dumps(doc),
                sample_text=doc.get('sample_text', '')[:1000]
            )
            self.session.add(db_doc)
        
        self.session.commit()
    
    def search(self, query):
        """Search documents in database"""
        results = self.session.query(Document).filter(
            Document.filename.contains(query) |
            Document.sample_text.contains(query)
        ).all()
        
        return [json.loads(r.metadata) for r in results]
    
    def generate_report(self, df):
        """Generate HTML report from dataframe"""
        html = f"""
        <html>
        <head>
            <title>ICMPD Document Report</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                h1 {{ color: #1e88e5; }}
                table {{ border-collapse: collapse; width: 100%; }}
                th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                th {{ background-color: #1e88e5; color: white; }}
                .summary {{ background-color: #f5f5f5; padding: 15px; border-radius: 5px; }}
            </style>
        </head>
        <body>
            <h1>ICMPD Document Analysis Report</h1>
            <div class="summary">
                <h2>Summary</h2>
                <p>Total Documents: {len(df)}</p>
                <p>Categories: {df['category'].nunique() if 'category' in df else 0}</p>
                <p>Total Size: {df['size_mb'].sum() if 'size_mb' in df else 0:.2f} MB</p>
                <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>
            <h2>Document Details</h2>
            {df.to_html(index=False, classes='document-table')}
        </body>
        </html>
        """
        return html
