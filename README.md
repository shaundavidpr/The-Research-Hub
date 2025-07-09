# 🧠 The Research Hub

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-blue?style=for-the-badge)](https://v0-the-research-hub.vercel.app)

The Research Hub is an all-in-one AI-powered assistant for students, researchers, and enthusiasts who are looking to boost their productivity and enhance their research workflow. This web-based tool integrates modern LLM APIs to provide streamlined support in generating, refining, and managing research content.

## ✨ Features

- ✅ **AI Chat Assistant**: Ask questions and receive AI-generated responses using natural language.
- 🧾 **PDF Chat (Coming Soon)**: Upload and interact with PDFs for research papers and notes.
- 📄 **Smart Note Generator**: Automatically create structured and well-written notes based on prompts.
- 📚 **AI-Powered Research Help**: Ideal for thesis writing, literature reviews, and more.

## 🚀 Live Demo

🔗 Visit: [https://v0-the-research-hub.vercel.app](https://v0-the-research-hub.vercel.app)

## 📁 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icons

### Backend
- **FastAPI** - Modern Python web framework
- **OpenAI GPT-4** - Advanced language model
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

### Features
- **File Attachments** - Upload and analyze research documents
- **AI Chat Assistant** - Contextual research guidance
- **Smart Note Taking** - AI-powered note organization
- **Citation Management** - Academic reference handling
- **Research Timeline** - Project planning and tracking

## 🧩 Folder Structure

```
├── app/                    # Next.js app directory
│   ├── aethon/            # AI assistant page
│   ├── api/               # API routes
│   └── ...                # Other pages
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── scripts/               # Python backend
│   ├── chatbot_server.py  # Main FastAPI server
│   ├── setup_backend.py   # Setup script
│   └── requirements.txt   # Python dependencies
└── ...
```

## 🛠️ Setup Instructions

### 1. Frontend Setup
```bash
npm install
npm run dev
```

### 2. Backend Setup
```bash
cd scripts
python setup_backend.py
```

### 3. Configure Environment
1. Add your OpenAI API key to `scripts/.env`:
```
OPENAI_API_KEY=your_actual_api_key_here
```

### 4. Start the Backend Server
```bash
cd scripts
python start_server.py
```

The backend will be available at `http://localhost:8000`

### 5. Access the Application
Visit `http://localhost:3000` to use The Research Hub with full AI capabilities!

## 🔧 Troubleshooting

### Python Backend Issues
- **"Technical difficulties" message**: Ensure the Python server is running
- **Missing dependencies**: Run `python setup_backend.py`
- **API key errors**: Check your `.env` file configuration
- **Port conflicts**: Make sure port 8000 is available

### File Upload Issues
- **Files not analyzing**: Verify the Python backend is connected
- **Upload failures**: Check file size limits (10MB max)
- **Unsupported formats**: Ensure files are PDF, TXT, DOC, CSV, or image formats

## 📖 Usage Guide

### File Attachments
1. Click the "Attach" button in the Aethon chat
2. Drag & drop files or browse to select
3. Wait for AI analysis to complete
4. Ask questions about your uploaded files

### AI Research Assistant
- Ask about research methodology
- Get help with literature reviews
- Receive guidance on data analysis
- Get writing and publication advice