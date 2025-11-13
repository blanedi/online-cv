from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import Dict, List, Tuple
import yaml
import pickle
import os

class DocumentClassifier:
    def __init__(self, config_path: str):
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        
        self.model_name = self.config['classification']['model_name']
        self.categories = self.config['classification']['categories']
        self.min_confidence = self.config['classification']['min_confidence']
        
        # Load or initialize the model
        self.model = SentenceTransformer(self.model_name)
        
        # Create category embeddings
        self._create_category_embeddings()
        
    def _create_category_embeddings(self):
        """Create embeddings for each category based on keywords"""
        self.category_embeddings = {}
        
        for category, info in self.categories.items():
            keywords = info['keywords']
            keyword_text = ' '.join(keywords)
            
            # You can enhance this with more descriptive text
            category_description = f"{category}: {keyword_text}"
            
            embedding = self.model.encode([category_description])[0]
            self.category_embeddings[category] = embedding
    
    def classify(self, text: str, metadata: Dict = None) -> Dict[str, any]:
        """Classify a document based on text content"""
        if not text or len(text.strip()) < 10:
            return {
                'category': 'uncategorized',
                'confidence': 0.0,
                'all_scores': {}
            }
        
        # Create embedding for the text
        text_embedding = self.model.encode([text])[0]
        
        # Calculate similarities with each category
        scores = {}
        for category, cat_embedding in self.category_embeddings.items():
            similarity = cosine_similarity(
                [text_embedding], 
                [cat_embedding]
            )[0][0]
            scores[category] = float(similarity)
        
        # Get the best match
        best_category = max(scores, key=scores.get)
        best_score = scores[best_category]
        
        # Apply minimum confidence threshold
        if best_score < self.min_confidence:
            best_category = 'uncategorized'
        
        # Additional rule-based adjustments based on metadata
        if metadata:
            best_category = self._apply_rules(best_category, metadata, scores)
        
        return {
            'category': best_category,
            'confidence': best_score,
            'all_scores': scores
        }
    
    def _apply_rules(self, category: str, metadata: Dict, scores: Dict) -> str:
        """Apply business rules for classification refinement"""
        # Example rules for ICMPD context
        
        # If it's a spreadsheet with data, likely a report or data file
        if metadata.get('type') == 'xlsx' and metadata.get('sheet_count', 0) > 2:
            if scores.get('data', 0) > 0.5:
                return 'data'
        
        # If it's a presentation, likely training material
        if metadata.get('type') == 'pptx':
            if scores.get('training', 0) > 0.4:
                return 'training'
        
        # Videos are often training materials
        if metadata.get('type') == 'video':
            if metadata.get('duration', 0) > 300:  # Longer than 5 minutes
                if scores.get('training', 0) > 0.3:
                    return 'training'
        
        return category
    
    def classify_batch(self, documents: List[Dict]) -> List[Dict]:
        """Classify multiple documents efficiently"""
        texts = [doc.get('text', '') for doc in documents]
        
        # Batch encode all texts
        if texts:
            embeddings = self.model.encode(texts)
            
            results = []
            for i, (doc, embedding) in enumerate(zip(documents, embeddings)):
                scores = {}
                for category, cat_embedding in self.category_embeddings.items():
                    similarity = cosine_similarity(
                        [embedding], 
                        [cat_embedding]
                    )[0][0]
                    scores[category] = float(similarity)
                
                best_category = max(scores, key=scores.get)
                best_score = scores[best_category]
                
                if best_score < self.min_confidence:
                    best_category = 'uncategorized'
                
                # Apply rules
                best_category = self._apply_rules(
                    best_category, 
                    doc.get('metadata', {}), 
                    scores
                )
                
                results.append({
                    'category': best_category,
                    'confidence': best_score,
                    'all_scores': scores
                })
            
            return results
        
        return []
    
    def find_similar_documents(self, text: str, 
                              document_embeddings: List[np.ndarray], 
                              threshold: float = 0.75) -> List[int]:
        """Find similar documents based on embeddings"""
        if not text:
            return []
        
        text_embedding = self.model.encode([text])[0]
        
        similarities = cosine_similarity([text_embedding], document_embeddings)[0]
        
        # Get indices of similar documents
        similar_indices = np.where(similarities > threshold)[0]
        
        # Sort by similarity
        similar_indices = similar_indices[np.argsort(similarities[similar_indices])[::-1]]
        
        return similar_indices.tolist()
