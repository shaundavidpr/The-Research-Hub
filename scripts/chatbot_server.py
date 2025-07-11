import os
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from typing import Optional, List
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Research Assistant API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class ChatMessage(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    suggestions: List[str]
    action_items: List[dict]
    timestamp: str

class ResearchAssistant:
    def __init__(self):
        self.system_prompt = """
        You are Aethon, an advanced AI research assistant specialized in academic research, 
        scientific methodology, and scholarly writing. You provide expert guidance on:
        
        - Literature reviews and systematic reviews
        - Research methodology (quantitative, qualitative, mixed methods)
        - Statistical analysis and data interpretation
        - Academic writing and publication strategies
        - Grant proposal development
        - Research ethics and best practices
        - Citation management and reference formatting
        - Peer review processes
        
        Always provide actionable, evidence-based advice with specific recommendations.
        Include relevant academic resources and methodological frameworks when appropriate.
        """
    
    def generate_response(self, message: str, history: List[dict] = None) -> ChatResponse:
        try:
            # Prepare conversation context
            messages = [{"role": "system", "content": self.system_prompt}]
            
            if history:
                messages.extend(history[-10:])  # Keep last 10 messages for context
            
            messages.append({"role": "user", "content": message})
            
            # Generate response using OpenAI
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=messages,
                max_tokens=1000,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            
            # Generate contextual suggestions
            suggestions = self._generate_suggestions(message, ai_response)
            
            # Generate action items
            action_items = self._generate_action_items(message, ai_response)
            
            return ChatResponse(
                response=ai_response,
                suggestions=suggestions,
                action_items=action_items,
                timestamp=datetime.now().isoformat()
            )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
    
    def _generate_suggestions(self, user_message: str, ai_response: str) -> List[str]:
        """Generate contextual follow-up suggestions"""
        suggestions = []
        
        # Research methodology suggestions
        if any(keyword in user_message.lower() for keyword in ["methodology", "method", "approach"]):
            suggestions.extend([
                "Explore quantitative vs qualitative approaches",
                "Consider mixed-methods research design",
                "Review ethical considerations for your study"
            ])
        
        # Literature review suggestions
        if any(keyword in user_message.lower() for keyword in ["literature", "review", "sources"]):
            suggestions.extend([
                "Set up systematic search strategies",
                "Use citation management tools",
                "Identify key databases for your field"
            ])
        
        # Data analysis suggestions
        if any(keyword in user_message.lower() for keyword in ["data", "analysis", "statistics"]):
            suggestions.extend([
                "Choose appropriate statistical tests",
                "Consider sample size requirements",
                "Plan for data visualization"
            ])
        
        # Writing and publication suggestions
        if any(keyword in user_message.lower() for keyword in ["writing", "paper", "publish"]):
            suggestions.extend([
                "Identify target journals",
                "Follow journal formatting guidelines",
                "Plan peer review timeline"
            ])
        
        return suggestions[:3]  # Return top 3 suggestions
    
    def _generate_action_items(self, user_message: str, ai_response: str) -> List[dict]:
        """Generate specific action items based on the conversation"""
        action_items = []
        
        # Research planning actions
        if any(keyword in user_message.lower() for keyword in ["start", "begin", "plan"]):
            action_items.append({
                "task": "Define research question and objectives",
                "priority": "high",
                "estimated_time": "2-3 hours"
            })
            action_items.append({
                "task": "Conduct preliminary literature search",
                "priority": "high",
                "estimated_time": "4-6 hours"
            })
        
        # Methodology actions
        if "methodology" in user_message.lower():
            action_items.append({
                "task": "Select appropriate research design",
                "priority": "high",
                "estimated_time": "1-2 hours"
            })
            action_items.append({
                "task": "Identify data collection methods",
                "priority": "medium",
                "estimated_time": "2-3 hours"
            })
        
        # Data analysis actions
        if any(keyword in user_message.lower() for keyword in ["analyze", "analysis", "data"]):
            action_items.append({
                "task": "Choose statistical software (R, SPSS, Python)",
                "priority": "medium",
                "estimated_time": "1 hour"
            })
            action_items.append({
                "task": "Prepare data cleaning protocol",
                "priority": "high",
                "estimated_time": "2-4 hours"
            })
        
        return action_items[:3]  # Return top 3 action items

# Initialize the research assistant
research_assistant = ResearchAssistant()

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_message: ChatMessage):
    """Main chat endpoint for research assistance"""
    try:
        response = research_assistant.generate_response(
            chat_message.message, 
            chat_message.conversation_history
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Research Assistant API"}

@app.get("/research-topics")
async def get_research_topics():
    """Get trending research topics"""
    return {
        "topics": [
            "Artificial Intelligence in Healthcare",
            "Climate Change Mitigation",
            "Quantum Computing Applications",
            "Sustainable Energy Systems",
            "Biomedical Engineering",
            "Social Media Psychology",
            "Machine Learning Ethics",
            "Renewable Energy Storage"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
