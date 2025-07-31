import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Search, Bot, MessageSquare, Loader2, ExternalLink, Sparkles, Brain, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const API_BASE = 'http://localhost:5000/api'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isChatting, setIsChatting] = useState(false)
  const [analysis, setAnalysis] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [agentStatus, setAgentStatus] = useState(null)
  const [activeTab, setActiveTab] = useState('search')
  const chatEndRef = useRef(null)

  useEffect(() => {
    checkAgentStatus()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const checkAgentStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/agent/status`)
      const data = await response.json()
      setAgentStatus(data)
    } catch (error) {
      console.error('Error checking agent status:', error)
      setAgentStatus({ status: 'unhealthy', error: error.message })
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`${API_BASE}/agent/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          num_results: 10
        })
      })

      const data = await response.json()
      setSearchResults(data.results || [])
    } catch (error) {
      console.error('Error searching:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchAndAnalyze = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setIsAnalyzing(true)
    try {
      const response = await fetch(`${API_BASE}/agent/search-and-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          analysis_prompt: 'Analyze these search results and provide comprehensive insights, key findings, and actionable information.'
        })
      })

      const data = await response.json()
      setSearchResults(data.search_results || [])
      setAnalysis(data.analysis || '')
      setActiveTab('analysis')
    } catch (error) {
      console.error('Error in search and analyze:', error)
      setSearchResults([])
      setAnalysis('Error occurred during analysis.')
    } finally {
      setIsSearching(false)
      setIsAnalyzing(false)
    }
  }

  const handleChat = async () => {
    if (!chatInput.trim()) return

    const userMessage = { role: 'user', content: chatInput, timestamp: new Date().toISOString() }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsChatting(true)

    try {
      const response = await fetch(`${API_BASE}/agent/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatInput,
          conversation_history: chatMessages,
          system_prompt: 'You are a helpful AI assistant. Provide clear, informative, and engaging responses.'
        })
      })

      const data = await response.json()
      const assistantMessage = { 
        role: 'assistant', 
        content: data.response || 'Sorry, I encountered an error.',
        timestamp: new Date().toISOString()
      }
      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error in chat:', error)
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while processing your message.',
        timestamp: new Date().toISOString()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsChatting(false)
    }
  }

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      action()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Agent
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Search the web and analyze results with local LLaMA model intelligence
          </p>
          
          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge 
              variant={agentStatus?.status === 'healthy' ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              <div className={`w-2 h-2 rounded-full ${agentStatus?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
              {agentStatus?.status === 'healthy' ? 'Agent Online' : 'Agent Offline'}
            </Badge>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Analyze
              </CardTitle>
              <CardDescription>
                Enter your search query to find information and get AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your search query..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleSearch)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Search
                </Button>
                <Button 
                  onClick={handleSearchAndAnalyze}
                  disabled={isSearching || isAnalyzing || !searchQuery.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Search & Analyze
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Search Results
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Analysis
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
            </TabsList>

            {/* Search Results Tab */}
            <TabsContent value="search" className="mt-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                  <CardDescription>
                    {searchResults.length > 0 ? `Found ${searchResults.length} results` : 'No results yet'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <AnimatePresence>
                      {searchResults.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="mb-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                                {result.title}
                              </h3>
                              <p className="text-sm text-slate-600 mt-1">{result.snippet}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">{result.source}</Badge>
                              </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-slate-400 ml-2" />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="mt-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Analysis
                  </CardTitle>
                  <CardDescription>
                    LLaMA model analysis of search results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        <span className="ml-2 text-slate-600">Analyzing results...</span>
                      </div>
                    ) : analysis ? (
                      <div className="prose prose-slate max-w-none">
                        <div className="whitespace-pre-wrap text-slate-700">{analysis}</div>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500 py-8">
                        No analysis available. Use "Search & Analyze" to get AI insights.
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="mt-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Chat with AI
                  </CardTitle>
                  <CardDescription>
                    Have a conversation with the LLaMA model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ScrollArea className="h-64 border rounded-lg p-4">
                      <AnimatePresence>
                        {chatMessages.map((message, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                          >
                            <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                              message.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-slate-100 text-slate-800'
                            }`}>
                              <div className="whitespace-pre-wrap">{message.content}</div>
                              <div className={`text-xs mt-1 ${
                                message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                              }`}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {isChatting && (
                        <div className="text-left">
                          <div className="inline-block bg-slate-100 p-3 rounded-lg">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </ScrollArea>
                    
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleChat)}
                        className="flex-1 min-h-[60px]"
                      />
                      <Button 
                        onClick={handleChat}
                        disabled={isChatting || !chatInput.trim()}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isChatting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

export default App
