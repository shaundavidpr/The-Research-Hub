#!/usr/bin/env python3
"""
Setup script for the Research Assistant Python backend
"""
import os
import sys
import subprocess
import platform

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"✅ Python version: {version.major}.{version.minor}.{version.micro}")
    return True

def install_dependencies():
    """Install required Python packages"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def check_env_file():
    """Check if .env file exists and has required variables"""
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    
    if not os.path.exists(env_path):
        print("⚠️  .env file not found. Creating template...")
        with open(env_path, "w") as f:
            f.write("# OpenAI API Configuration\n")
            f.write("OPENAI_API_KEY=your_openai_api_key_here\n")
            f.write("\n# Optional: Python API URL (defaults to http://localhost:8000)\n")
            f.write("PYTHON_API_URL=http://localhost:8000\n")
        
        print(f"📝 Created .env template at: {env_path}")
        print("🔑 Please add your OpenAI API key to the .env file")
        return False
    
    # Check if OPENAI_API_KEY is set
    from dotenv import load_dotenv
    load_dotenv(env_path)
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "your_openai_api_key_here":
        print("⚠️  OPENAI_API_KEY not set in .env file")
        print("🔑 Please add your OpenAI API key to the .env file")
        return False
    
    print("✅ Environment variables configured")
    return True

def main():
    """Main setup function"""
    print("🚀 Setting up Research Assistant Python Backend\n")
    
    # Change to scripts directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Check Python version
    if not check_python_version():
        return False
    
    # Install dependencies
    if not install_dependencies():
        return False
    
    # Check environment configuration
    env_configured = check_env_file()
    
    print("\n" + "="*50)
    print("🎉 Setup Complete!")
    print("="*50)
    
    if env_configured:
        print("✅ Backend is ready to run")
        print("🚀 Start the server with: python chatbot_server.py")
    else:
        print("⚠️  Please configure your .env file first")
        print("🔑 Add your OpenAI API key, then run: python chatbot_server.py")
    
    print("\n📖 Server will be available at: http://localhost:8000")
    print("🔍 Health check: http://localhost:8000/health")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)