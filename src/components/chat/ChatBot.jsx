import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const ChatBot = ({ messages = [], name = "Luke", onButtonClick }) => {
  const chatWindowRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to the bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
      
      // Animate new message container
      if (chatWindowRef.current) {
        const messageContainers = chatWindowRef.current.querySelectorAll('.chat-message');
        if (messageContainers.length > 0) {
          const lastContainer = messageContainers[messageContainers.length - 1];
          gsap.fromTo(
            lastContainer,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
          );
        }
      }
    }
  }, [messages]);

  return (
    <div className="bg-blue-50 rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-blue-200">
      {/* Chat header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center">
        <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold mr-3">
          {name.charAt(0)}
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-xs text-blue-100">Study guide assistant</p>
        </div>
      </div>
      
      {/* Chat messages container with gradient overlay */}
      <div className="relative flex-1 overflow-hidden">
        {/* Gradient overlay for older messages */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-blue-50 to-transparent z-10 pointer-events-none"></div>
        
        {/* Scrollable messages area */}
        <div 
          ref={chatWindowRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 h-full"
        >
          {messages.map((message, index) => (
            <div key={index} className="flex chat-message">
              <div className="w-8 h-8 rounded-full bg-blue-400 flex-shrink-0 flex items-center justify-center text-white font-bold mr-2">
                {name.charAt(0)}
              </div>
              <div className="bg-gray-100 rounded-lg rounded-tl-none p-3 max-w-[85%]">
                <p className="text-black text-base font-medium">{message.text || message}</p>
                {message.buttons && message.buttons.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.buttons.map((button, btnIndex) => (
                      <button
                        key={btnIndex}
                        onClick={() => {
                          console.log('Button clicked in ChatBot:', button.action, button.text);
                          if (onButtonClick) {
                            onButtonClick(button.action, button.text);
                          }
                        }}
                        className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm active:shadow-inner active:translate-y-px focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        {button.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatBot;