import networkx as nx
import plotly.graph_objects as go
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class GraphBuilder:
    def __init__(self, config):
        self.config = config
        self.model = SentenceTransformer(config['classification']['model_name'])
        self.threshold = config['graph']['similarity_threshold']
        
    def build_graph(self, documents):
        """Build document relationship graph"""
        G = nx.Graph()
        
        # Create embeddings for all documents
        texts = []
        for doc in documents:
            text = doc.get('sample_text', '') + ' ' + doc.get('ocr_text', '')
            texts.append(text if text else doc.get('filename', ''))
        
        if not texts:
            return None
            
        embeddings = self.model.encode(texts)
        
        # Add nodes
        for i, doc in enumerate(documents):
            G.add_node(i, 
                      label=doc.get('filename', 'Unknown')[:30],
                      category=doc.get('category', 'uncategorized'))
        
        # Calculate similarities and add edges
        similarities = cosine_similarity(embeddings)
        
        for i in range(len(documents)):
            for j in range(i+1, len(documents)):
                if similarities[i][j] > self.threshold:
                    G.add_edge(i, j, weight=float(similarities[i][j]))
        
        # Calculate graph statistics
        graph_data = {
            'graph': G,
            'node_count': G.number_of_nodes(),
            'edge_count': G.number_of_edges(),
            'avg_degree': sum(dict(G.degree()).values()) / G.number_of_nodes() if G.number_of_nodes() > 0 else 0
        }
        
        # Detect communities
        if G.number_of_edges() > 0:
            communities = nx.community.greedy_modularity_communities(G)
            graph_data['clusters'] = [
                {
                    'cluster_id': i,
                    'size': len(c),
                    'documents': [documents[node]['filename'] for node in c][:5]
                }
                for i, c in enumerate(communities)
            ]
        
        return graph_data
    
    def visualize_graph(self, graph_data):
        """Create Plotly visualization of the graph"""
        G = graph_data['graph']
        
        # Get layout
        pos = nx.spring_layout(G, k=1, iterations=50)
        
        # Create edge traces
        edge_trace = []
        for edge in G.edges():
            x0, y0 = pos[edge[0]]
            x1, y1 = pos[edge[1]]
            edge_trace.append(go.Scatter(
                x=[x0, x1, None],
                y=[y0, y1, None],
                mode='lines',
                line=dict(width=0.5, color='#888'),
                hoverinfo='none'
            ))
        
        # Create node trace
        node_x = []
        node_y = []
        node_text = []
        node_color = []
        
        category_colors = {
            cat: info['color'] 
            for cat, info in self.config['classification']['categories'].items()
        }
        
        for node in G.nodes():
            x, y = pos[node]
            node_x.append(x)
            node_y.append(y)
            node_text.append(G.nodes[node]['label'])
            category = G.nodes[node].get('category', 'uncategorized')
            node_color.append(category_colors.get(category, '#999'))
        
        node_trace = go.Scatter(
            x=node_x,
            y=node_y,
            mode='markers+text',
            hoverinfo='text',
            text=node_text,
            hovertext=node_text,
            marker=dict(
                color=node_color,
                size=10,
                line_width=2
            )
        )
        
        # Create figure
        fig = go.Figure(
            data=edge_trace + [node_trace],
            layout=go.Layout(
                title='Document Relationship Network',
                showlegend=False,
                hovermode='closest',
                margin=dict(b=0, l=0, r=0, t=40),
                xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                height=600
            )
        )
        
        return fig
