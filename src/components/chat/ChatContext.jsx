import React, { createContext, useState, useContext } from 'react';

// Create a context for the chat functionality
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  // Add a new message to the chat
  const addMessage = (message) => {
    console.log('Adding message:', message); // Debugging
    // Check if this exact message is already the last message to prevent duplicates
    setMessages(prevMessages => {
      const lastMessage = prevMessages.length > 0 ? prevMessages[prevMessages.length - 1] : null;
      
      // Handle both string messages and object messages with text/buttons
      if (lastMessage) {
        const lastText = typeof lastMessage === 'string' ? lastMessage : lastMessage.text;
        const newText = typeof message === 'string' ? message : message.text;
        
        // If the text content is the same, prevent duplicate
        if (lastText === newText) {
          console.log('Duplicate message prevented');
          return prevMessages;
        }
      }
      
      return [...prevMessages, message];
    });
  };
  
  // Add a message with buttons
  const addMessageWithButtons = (text, buttons) => {
    console.log('Adding message with buttons:', text, buttons);
    // Make sure we have valid button data
    const validButtons = buttons.filter(btn => btn && btn.text && btn.action);
    
    if (validButtons.length === 0) {
      console.warn('No valid buttons provided, adding as plain message');
      addMessage(text);
      return;
    }
    
    // Add the message with buttons
    addMessage({
      text,
      buttons: validButtons.map(btn => ({
        text: btn.text,
        action: btn.action
      }))
    });
  };

  // Clear all messages
  const clearMessages = () => {
    console.log('Clearing all messages'); // Debugging
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, addMessageWithButtons, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;