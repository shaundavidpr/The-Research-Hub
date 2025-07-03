import os
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from typing import Optional, List
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Aethon Research Assistant API", version="1.0.0")

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

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None
    conversation_history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    suggestions: Optional[List[str]] = []
    research_actions: Optional[List[dict]] = []

class ResearchAssistant:
    def __init__(self):
        self.system_prompt = """You are Aethon, an advanced AI research assistant with expertise in:

1. **Literature Reviews & Systematic Reviews**
   - Conducting comprehensive literature searches
   - Analyzing and synthesizing research findings
   - Identifying research gaps and trends
   - Creating citation matrices and bibliographies

2. **Research Methodology & Design**
   - Quantitative, qualitative, and mixed-methods approaches
   - Experimental design and statistical power analysis
   - Survey design and validation
   - Sampling strategies and bias mitigation

3. **Data Analysis & Statistics**
   - Descriptive and inferential statistics
   - Regression analysis, ANOVA, factor analysis
   - Qualitative data coding and thematic analysis
   - Statistical software guidance (R, SPSS, Python)

4. **Academic Writing & Publishing**
   - Paper structure and organization
   - Grant proposal writing
   - Journal selection and submission strategies
   - Citation management and formatting

5. **Research Ethics & Methodology**
   - IRB approval processes
   - Informed consent procedures
   - Data privacy and security
   - Research integrity and reproducibility

Provide detailed, evidence-based guidance with specific methodological recommendations. Always consider the academic context and suggest best practices from current research standards."""

    async def generate_response(self, message: str, context: str = None, history: List[dict] = None) -> ChatResponse:
        try:
            # Build conversation messages
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # Add conversation history if provided
            if history:
                messages.extend(history[-10:])  # Keep last 10 messages for context
            
            # Add current message
            messages.append({"role": "user", "content": message})
            
            # Call OpenAI API
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=messages,
                max_tokens=1500,
                temperature=0.7,
                presence_penalty=0.1,
                frequency_penalty=0.1
            )
            
            ai_response = response.choices[0].message.content
            
            # Generate research-specific suggestions
            suggestions = self._generate_suggestions(message, ai_response)
            
            # Generate research actions
            actions = self._generate_research_actions(message)
            
            return ChatResponse(
                response=ai_response,
                suggestions=suggestions,
                research_actions=actions
            )
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to generate response: {str(e)}")
    
    def _generate_suggestions(self, user_message: str, ai_response: str) -> List[str]:
        """Generate contextual suggestions based on the conversation"""
        message_lower = user_message.lower()
        suggestions = []
        
        if "literature review" in message_lower:
            suggestions = [
                "Create a systematic search strategy",
                "Set up citation management system",
                "Develop inclusion/exclusion criteria",
                "Plan data extraction framework"
            ]
        elif "methodology" in message_lower or "method" in message_lower:
            suggestions = [
                "Calculate required sample size",
                "Design data collection instruments",
                "Plan ethical approval process",
                "Create analysis timeline"
            ]
        elif "data analysis" in message_lower or "statistics" in message_lower:
            suggestions = [
                "Check data assumptions",
                "Plan visualization strategy",
                "Consider effect sizes",
                "Prepare analysis code"
            ]
        elif "writing" in message_lower or "paper" in message_lower:
            suggestions = [
                "Create detailed outline",
                "Set writing schedule",
                "Identify target journals",
                "Plan revision process"
            ]
        else:
            suggestions = [
                "Explore research methodology options",
                "Review relevant literature",
                "Consider data collection methods",
                "Plan analysis approach"
            ]
        
        return suggestions[:4]  # Return top 4 suggestions
    
    def _generate_research_actions(self, user_message: str) -> List[dict]:
        """Generate actionable research tasks"""
        message_lower = user_message.lower()
        actions = []
        
        if "literature" in message_lower:
            actions = [
                {"type": "search", "label": "Search Academic Databases", "priority": "high"},
                {"type": "organize", "label": "Create Reference Library", "priority": "medium"},
                {"type": "analyze", "label": "Analyze Key Papers", "priority": "high"}
            ]
        elif "methodology" in message_lower:
            actions = [
                {"type": "design", "label": "Design Study Protocol", "priority": "high"},
                {"type": "ethics", "label": "Prepare Ethics Application", "priority": "medium"},
                {"type": "pilot", "label": "Plan Pilot Study", "priority": "low"}
            ]
        elif "data" in message_lower:
            actions = [
                {"type": "clean", "label": "Clean and Prepare Data", "priority": "high"},
                {"type": "explore", "label": "Exploratory Data Analysis", "priority": "medium"},
                {"type": "model", "label": "Build Statistical Models", "priority": "high"}
            ]
        
        return actions

# Initialize research assistant
research_assistant = ResearchAssistant()

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint for research assistance"""
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        if not openai.api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        response = await research_assistant.generate_response(
            message=request.message,
            context=request.context,
            history=request.conversation_history
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Aethon Research Assistant"}

@app.post("/api/analyze-research")
async def analyze_research(request: dict):
    """Analyze research papers, data, or methodology"""
    try:
        analysis_type = request.get("type", "general")
        content = request.get("content", "")
        
        if analysis_type == "paper":
            prompt = f"""Analyze this research paper content and provide:
1. Key findings and contributions
2. Methodology assessment
3. Strengths and limitations
4. Relevance to current research
5. Citation recommendations

Content: {content}"""
        
        elif analysis_type == "data":
            prompt = f"""Analyze this research data and suggest:
1. Appropriate statistical methods
2. Data visualization strategies
3. Potential issues or biases
4. Analysis workflow
5. Interpretation guidelines

Data description: {content}"""
        
        else:
            prompt = f"""Provide research analysis for: {content}"""
        
        response = await research_assistant.generate_response(prompt)
        return response
        
    except Exception as e:
        logger.error(f"Error in research analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-outline")
async def generate_outline(request: dict):
    """Generate research paper or proposal outlines"""
    try:
        topic = request.get("topic", "")
        document_type = request.get("type", "paper")  # paper, proposal, thesis
        
        prompt = f"""Create a detailed outline for a {document_type} on the topic: {topic}

Include:
1. Hierarchical structure with main sections and subsections
2. Key points to cover in each section
3. Estimated word counts or page lengths
4. Critical literature to include
5. Methodological considerations
6. Timeline for completion

Format as a structured, actionable outline."""
        
        response = await research_assistant.generate_response(prompt)
        return response
        
    except Exception as e:
        logger.error(f"Error generating outline: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
