import React from 'react';

const IntroModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-4">
          <h2 className="text-xl font-bold">Question 2: Language Analysis</h2>
        </div>
        
        <div className="p-6">
          <p className="font-bold mb-4">Method:</p>
          <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li>Read the question.</li>
            <li>Find items to help you answer the question.</li>
            <li>Follow the "Who, what, where, why" pattern to answer with the things you've found.</li>
            <li>Items = words that are important adjectives (verbs, nouns, adverbs also fine) OR language features/devices like similes, personification etc.</li>
          </ol>
          
          <div className="flex justify-center">
            <button 
              onClick={onClose}
              className="bg-blue-600 text-white px-8 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-md"
            >
              Begin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroModal;