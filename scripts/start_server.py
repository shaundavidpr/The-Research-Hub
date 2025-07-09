#!/usr/bin/env python3
"""
Convenient script to start the Research Assistant server with proper checks
"""
import os
import sys
import subprocess
from pathlib import Path

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = ['fastapi', 'uvicorn', 'openai', 'python-dotenv']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing packages: {', '.join(missing_packages)}")
        print("📦 Run: python setup_backend.py")
        return False
    
    return True

def check_env_config():
    """Check environment configuration"""
    env_file = Path(__file__).parent / ".env"
    
    if not env_file.exists():
        print("❌ .env file not found")
        print("📝 Run: python setup_backend.py")
        return False
    
    # Load and check environment variables
    from dotenv import load_dotenv
    load_dotenv(env_file)
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "your_openai_api_key_here":
        print("❌ OPENAI_API_KEY not configured")
        print("🔑 Please add your OpenAI API key to the .env file")
        return False
    
    return True

def main():
    """Main function to start the server"""
    print("🚀 Starting Research Assistant Server...\n")
    
    # Change to scripts directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Check dependencies
    if not check_dependencies():
        return False
    
    # Check environment configuration
    if not check_env_config():
        return False
    
    print("✅ All checks passed!")
    print("🚀 Starting server at http://localhost:8000\n")
    
    try:
        # Start the server
        subprocess.run([sys.executable, "chatbot_server.py"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)