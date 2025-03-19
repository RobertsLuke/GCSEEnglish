import React from 'react'
import QuestionTwo from './components/QuestionTwo'
import ChatBot from './components/chat/ChatBot'
import { ChatProvider, useChat } from './components/chat/ChatContext'

function AppContent() {
  const { messages, addMessage, addMessageWithButtons } = useChat()
  
  // Handler for chat button clicks
  const handleChatButtonClick = (action, buttonText) => {
    console.log('Chat button clicked in App:', action, buttonText)
    
    // Create and dispatch a custom event with the action and buttonText
    try {
      // Special handling for certain buttons
      if (action === 'show_result') {
        console.log('Dispatching show_result event')
      }
      
      const event = new CustomEvent('chat-button-click', { 
        detail: { action, buttonText } 
      })
      document.dispatchEvent(event)
      console.log('Event dispatched successfully:', action)
    } catch (error) {
      console.error('Error dispatching event:', error)
    }
  }
  
  // No initial message here - we'll let the QuestionTwo component handle it
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center">GCSE English Language Paper 1</h1>
        <p className="text-center text-gray-600 mt-2">Question Analysis & Method Guide</p>
      </header>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Bot sidebar */}
        <aside className="lg:col-span-3 h-[calc(100vh-12rem)] min-h-[400px]">
          <ChatBot messages={messages} name="Luke" onButtonClick={handleChatButtonClick} />
        </aside>
        
        {/* Main content */}
        <main className="lg:col-span-9">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-3 md:p-4">
              <h2 className="text-lg md:text-xl font-semibold">Question 2: Language Analysis</h2>
            </div>
            <div className="p-3 md:p-6">
              <QuestionTwo />
            </div>
          </div>
        </main>
      </div>
      
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>GCSE English Language Exam Preparation Tool</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  )
}

export default App