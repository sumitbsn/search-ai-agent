# AI Agent Web UI - Documentation

## Overview

This is a modern web interface for an AI agent that combines web search functionality with local LLaMA model integration. The application allows users to search the web and analyze results using a local Ollama LLaMA model.

## Live Demo

**Deployed Application**: https://ogh5izce059q.manus.space

## Features

### 🔍 Web Search
- Real-time web search using DuckDuckGo
- Clean, organized display of search results
- Support for multiple search queries
- Fallback mock results if search fails

### 🤖 AI Analysis
- Integration with local Ollama LLaMA models
- Analyze search results with AI insights
- Multiple analysis types (general, summarize, extract facts, sentiment)
- Streaming responses for better user experience

### 💬 Chat Interface
- Interactive chat with LLaMA model
- Conversation history tracking
- Real-time message streaming
- Context-aware responses

### 🎨 Modern UI
- Responsive design for desktop and mobile
- Smooth animations and transitions
- Dark/light theme support
- Professional, polished interface

## Architecture

### Backend (Flask)
- **Framework**: Flask with CORS support
- **Search Integration**: DuckDuckGo web search
- **AI Integration**: Ollama LLaMA model interface
- **API Endpoints**: RESTful API with WebSocket support

### Frontend (React)
- **Framework**: React with modern hooks
- **UI Components**: shadcn/ui components
- **Styling**: Tailwind CSS with animations
- **Icons**: Lucide React icons

## API Endpoints

### Search Endpoints
- `POST /api/agent/search` - Perform web search
- `POST /api/agent/search-and-analyze` - Search and analyze with AI

### AI Endpoints
- `POST /api/agent/chat` - Chat with LLaMA model
- `POST /api/agent/chat/stream` - Stream chat responses
- `POST /api/agent/analyze` - Analyze content with AI

### Status Endpoints
- `GET /api/agent/status` - Check agent health
- `GET /api/agent/models` - List available models

## Local Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 20+
- Ollama (for local LLaMA integration)

### 1. Install Ollama (Optional for AI features)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a LLaMA model
ollama pull llama3.2:latest

# Start Ollama service
ollama serve
```

### 2. Backend Setup

```bash
# Clone or download the project
cd ai-agent-webui

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# For full local setup with Ollama support
pip install ollama

# Run the Flask server
python src/main.py
```

### 3. Frontend Setup (Development)

```bash
# Navigate to frontend directory
cd ai-agent-frontend

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

### 4. Full Stack Setup

For a complete setup with both frontend and backend:

```bash
# Build frontend
cd ai-agent-frontend
pnpm run build

# Copy build to Flask static directory
cp -r dist/* ../ai-agent-webui/src/static/

# Run Flask server
cd ../ai-agent-webui
source venv/bin/activate
python src/main.py
```

## Usage Guide

### 1. Web Search
1. Enter your search query in the search box
2. Click "Search" to get web results
3. Browse through the organized search results
4. Click on result titles to visit the original pages

### 2. AI Analysis
1. Enter your search query
2. Click "Search & Analyze" for AI-powered insights
3. View the analysis in the "AI Analysis" tab
4. Get comprehensive insights and summaries

### 3. Chat with AI
1. Navigate to the "Chat" tab
2. Type your message in the text area
3. Press "Send" or hit Enter to chat
4. View conversation history and responses

## Configuration

### Environment Variables
- `OLLAMA_HOST`: Ollama server host (default: http://localhost:11434)
- `FLASK_ENV`: Flask environment (development/production)
- `FLASK_DEBUG`: Enable debug mode (True/False)

### Model Configuration
Edit `src/routes/agent.py` to change the default model:

```python
ai_agent = OllamaAIAgent(model_name="llama3.2:latest")
```

### Search Configuration
Modify search parameters in `search_web()` function:
- Number of results
- Search timeout
- User agent string

## Troubleshooting

### Common Issues

#### 1. "Agent Offline" Status
- **Cause**: Ollama is not running or not accessible
- **Solution**: 
  - Install and start Ollama: `ollama serve`
  - Check if the model is available: `ollama list`
  - Verify Ollama is running on port 11434

#### 2. Search Not Working
- **Cause**: Network issues or DuckDuckGo blocking
- **Solution**: 
  - Check internet connection
  - The app will fall back to mock results
  - Consider implementing alternative search APIs

#### 3. CORS Errors
- **Cause**: Frontend and backend on different ports
- **Solution**: 
  - Ensure CORS is enabled in Flask app
  - Update API_BASE URL in frontend
  - Use the same domain for both frontend and backend

#### 4. Dependencies Issues
- **Cause**: Missing or incompatible packages
- **Solution**:
  - Use the provided requirements.txt
  - Create a fresh virtual environment
  - Install packages one by one if needed

### Performance Optimization

#### 1. Search Caching
Implement Redis or in-memory caching for search results:

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def search_web_cached(query: str, num_results: int = 10):
    return search_web(query, num_results)
```

#### 2. AI Response Streaming
Use WebSocket for real-time AI responses:

```javascript
const ws = new WebSocket('ws://localhost:5000/ws/stream');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Handle streaming response
};
```

## Deployment Options

### 1. Local Development
- Run Flask on localhost:5000
- Run React dev server on localhost:3000
- Use for development and testing

### 2. Production Deployment
- Build React frontend
- Serve frontend from Flask static directory
- Deploy to cloud platforms (Heroku, AWS, etc.)

### 3. Docker Deployment
Create a Dockerfile for containerized deployment:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "src/main.py"]
```

## Security Considerations

### 1. Input Validation
- Sanitize search queries
- Validate AI chat inputs
- Implement rate limiting

### 2. API Security
- Add authentication for sensitive endpoints
- Implement CSRF protection
- Use HTTPS in production

### 3. Model Security
- Secure Ollama installation
- Monitor AI model usage
- Implement content filtering

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes and test locally
4. Submit a pull request

### Code Style
- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Add type hints where applicable
- Write comprehensive tests

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Test with the live demo
4. Create an issue with detailed information

## Future Enhancements

### Planned Features
- [ ] Multiple search engine support
- [ ] Advanced AI analysis options
- [ ] User authentication and profiles
- [ ] Search history and bookmarks
- [ ] Export functionality for results
- [ ] Mobile app version
- [ ] Voice search integration
- [ ] Real-time collaboration features

### Technical Improvements
- [ ] Database integration for persistence
- [ ] Advanced caching mechanisms
- [ ] WebSocket for real-time updates
- [ ] Progressive Web App (PWA) features
- [ ] Offline functionality
- [ ] Performance monitoring
- [ ] Automated testing suite
- [ ] CI/CD pipeline integration

