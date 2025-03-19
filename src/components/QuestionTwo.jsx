import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useChat } from "./chat/ChatContext";
import IntroModal from "./IntroModal";

const QuestionTwo = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [highlightActive, setHighlightActive] = useState(false);
  const [currentStep, setCurrentStep] = useState("initial"); // initial, option-select, highlighting, next-step, analysis-options, analysis
  const [showResult, setShowResult] = useState(false); // To control whether to show the example
  const [showAnswerArea, setShowAnswerArea] = useState(false); // To control whether to show the answer area
  const [activeView, setActiveView] = useState("question"); // 'question' or 'answer'
  const [isModalOpen, setIsModalOpen] = useState(true); // Start with the modal open

  const { addMessage, addMessageWithButtons, clearMessages } = useChat();

  // Use a ref to track if we've already added the welcome message
  const welcomeMessageSent = useRef(false);

  const questionRef = useRef(null);
  const overlayRef = useRef(null);
  const optionsRef = useRef(null);
  const highlightRef = useRef(null);
  const containerRef = useRef(null);

  // Add a direct show example button function for testing
  const addShowExampleButton = () => {
    console.log("Adding a direct Show Example button");
    addMessageWithButtons("Click to see an example of highlighting:", [
      { text: "Show Example", action: "show_result" },
    ]);
  };

  // No longer adding duplicate buttons

  // No longer needed with the new button-based approach

  // No longer need this effect as we're adding the welcome message when the modal closes
  // useEffect(() => {
  //   // Only add the welcome message if it hasn't been sent yet
  //   if (!welcomeMessageSent.current) {
  //     console.log('Adding welcome message (first time only)');
  //     welcomeMessageSent.current = true;
  //
  //     // Wait for modal to be closed before showing the welcome message
  //     const timer = setTimeout(() => {
  //       addMessageWithButtons("Let's learn about GCSE English Language Paper 1 Question 2. Ready to begin?", [
  //         { text: "Begin", action: "begin" }
  //       ]);
  //     }, 1000); // Short delay to ensure UI is ready
  //
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  // Separate effect for the event listener to avoid recreation on every state change
  useEffect(() => {
    // Listen for button clicks from the chat
    const handleChatButtonClick = (event) => {
      const { action, buttonText } = event.detail;
      console.log("Received chat button click:", action, buttonText);

      switch (action) {
        case "begin":
          console.log("Begin action triggered");
          handleBeginClick();
          break;
        case "option":
          console.log("Option action triggered with:", buttonText);
          // Use exact option text from the button for direct comparison
          if (buttonText === "Read the question") {
            handleOptionClick("read");
          } else if (buttonText === "Begin highlighting the text") {
            handleOptionClick("highlight");
          } else if (buttonText === "Stare hopelessly at exam paper") {
            handleOptionClick("stare");
          }
          break;
        case "analysis_option":
          console.log("Analysis option triggered with:", buttonText);
          // Direct mapping from button text to expected option values
          if (buttonText === "Highlight key language") {
            handleAnalysisOptionClick("highlight key language");
          } else if (buttonText === "Wing it, YOLO BOYS!") {
            handleAnalysisOptionClick("wing it, yolo boys!");
          } else if (buttonText === "Begin to daydream") {
            handleAnalysisOptionClick("begin to daydream");
          }
          break;
        case "next_step":
          console.log("Next step action triggered");
          handleNextClick();
          break;
        case "show_result":
          console.log("Show result action triggered");
          handleShowResult();
          break;
        case "use_to_answer":
          console.log("Use to answer action triggered");
          handleUseToAnswer();
          break;
        case "switch_view":
          console.log("Switch view action triggered to:", buttonText);
          switchView(buttonText.toLowerCase());
          break;
        default:
          console.log("Unknown action:", action);
      }
    };

    // Add event listener
    document.addEventListener("chat-button-click", handleChatButtonClick);
    console.log("Added chat button click listener");

    // Clean up
    return () => {
      document.removeEventListener("chat-button-click", handleChatButtonClick);
      console.log("Removed chat button click listener");
    };
  }, []); // Empty dependency array - only set up once // Re-add listeners when the step changes to ensure the correct handlers

  // Handle the "Begin" button click
  const handleBeginClick = () => {
    // No longer show overlay, just proceed with the chat guidance
    setCurrentStep("option-select");

    // Send message with buttons for options
    addMessageWithButtons("What should you do first?", [
      { text: "Read the question", action: "option" },
      { text: "Begin highlighting the text", action: "option" },
      { text: "Stare hopelessly at exam paper", action: "option" },
    ]);
  };

  // Handle option selection
  const handleOptionClick = (option) => {
    if (option === "read") {
      // If the correct option is selected - minimal feedback
      addMessage("Correct! Read the question first.");
      setCurrentStep("highlighting");

      // Start the highlighting animation directly without overlay
      setTimeout(() => {
        addMessage("Now look at the question.");

        // Start the highlighting animation
        setTimeout(() => {
          setHighlightActive(true);

          // Create a left-to-right highlighting effect
          const question = questionRef.current;
          const questionText = question.textContent;

          // Calculate the actual width of the text rather than the full element
          const tempSpan = document.createElement("span");
          tempSpan.style.visibility = "hidden";
          tempSpan.style.position = "absolute";
          tempSpan.style.whiteSpace = "nowrap"; // Keep all text on one line
          tempSpan.textContent = questionText;
          document.body.appendChild(tempSpan);
          const textWidth = tempSpan.offsetWidth;
          document.body.removeChild(tempSpan);

          // Clear the original element
          question.innerHTML = "";

          // Create a containing span to position everything
          const container = document.createElement("span");
          container.style.position = "relative";
          container.style.display = "inline-block";
          question.appendChild(container);

          // Create a highlight div that will animate across just the text width
          const highlight = document.createElement("div");
          highlight.className =
            "absolute top-0 left-0 h-full bg-yellow-200 opacity-50 z-0";
          highlight.style.width = "0px";
          highlight.style.maxWidth = `${textWidth}px`; // Limit to text width
          highlightRef.current = highlight;
          container.appendChild(highlight);

          // Re-add the text
          const textSpan = document.createElement("span");
          textSpan.textContent = questionText;
          textSpan.className = "relative z-10";
          container.appendChild(textSpan);

          // Animate the highlight from left to right, but only across the text
          gsap.fromTo(
            highlight,
            { width: "0px" },
            {
              width: `${textWidth}px`,
              duration: 2.5, // Slower animation
              ease: "power1.inOut",
              onComplete: () => {
                // After highlighting is complete
                setCurrentStep("next-step");
                setTimeout(() => {
                  addMessageWithButtons("Have you read it?", [
                    { text: "Yes", action: "next_step" },
                  ]);
                }, 300);
              },
            }
          );
        }, 800); // Longer delay after message before highlighting to allow it to be read
      }, 600);
    } else if (option === "highlight") {
      // Incorrect option - highlighting text first
      addMessage(
        "Not quite, we need to read the question first to understand what we're looking for."
      );

      // Reset and prompt user to try again
      setTimeout(() => {
        setTimeout(() => {
          addMessageWithButtons("Let's try again.", [
            { text: "Read the question", action: "option" },
            { text: "Begin highlighting the text", action: "option" },
            { text: "Stare hopelessly at exam paper", action: "option" },
          ]);
        }, 1000);
      }, 1500);
    } else if (option === "stare") {
      // Incorrect option - staring at paper
      addMessage(
        "Not quite, we need to read the question first to get clear direction."
      );

      // Reset and prompt user to try again
      setTimeout(() => {
        setTimeout(() => {
          addMessageWithButtons("Let's try again.", [
            { text: "Read the question", action: "option" },
            { text: "Begin highlighting the text", action: "option" },
            { text: "Stare hopelessly at exam paper", action: "option" },
          ]);
        }, 1000);
      }, 1500);
    }
  };

  // Handle "Yes" button click (formerly "Ok next...")
  const handleNextClick = () => {
    // Don't show overlay, just proceed with the next step
    setCurrentStep("analysis-options");

    // Add a message with buttons about the next step
    addMessageWithButtons("What to do next?", [
      { text: "Highlight key language", action: "analysis_option" },
      { text: "Wing it, YOLO BOYS!", action: "analysis_option" },
      { text: "Begin to daydream", action: "analysis_option" },
    ]);
  };

  // Handle second set of options (analysis methods)
  const handleAnalysisOptionClick = (option) => {
    console.log("Analysis option selected:", option);

    if (option === "highlight key language") {
      // If the correct option is selected, just proceed
      addMessage("Correct! Highlight key language.");

      // Proceed directly to analysis step
      setCurrentStep("analysis");

      // Tell the user to try themselves and then see the example
      setTimeout(() => {
        console.log("Adding Show Example button");
        addMessageWithButtons("Try yourself then click Show Example", [
          { text: "Show Example", action: "show_result" },
        ]);
      }, 600);
    } else if (
      option === "wing it, yolo boys!" ||
      option === "begin to daydream"
    ) {
      // Incorrect options - very simple feedback
      addMessage("Wrong. Try again.");

      // Allow them to try again immediately
      setTimeout(() => {
        addMessageWithButtons("What should you do next?", [
          { text: "Highlight key language", action: "analysis_option" },
          { text: "Wing it, YOLO BOYS!", action: "analysis_option" },
          { text: "Begin to daydream", action: "analysis_option" },
        ]);
      }, 1500);
    }
  };

  // Handle Show Example button click (formerly Show Result)
  const handleShowResult = () => {
    console.log("Show Example button clicked");

    // Always show the result regardless of step
    setShowResult(true);
    addMessage("Here's an example.");

    // Find the simile text and highlight it with a short delay
    setTimeout(() => {
      // Get the paragraph with the text to highlight
      const paragraphElement = document.querySelector(".extract-text");
      if (paragraphElement) {
        console.log("Found paragraph element, applying highlight");
        const textContent = paragraphElement.innerHTML;

        // Highlighter colors
        const highlighterColors = [
          "rgba(255, 255, 0, 0.5)", // Yellow
          "rgba(0, 255, 0, 0.4)", // Green
          "rgba(255, 182, 193, 0.6)", // Pink
          "rgba(255, 165, 0, 0.5)", // Orange
        ];

        // Choose a random highlighter color
        const randomColor =
          highlighterColors[
            Math.floor(Math.random() * highlighterColors.length)
          ];

        // Replace the specific text with a highlighted and labeled version
        const highlightedText = textContent.replace(
          /like a gigantic malformed hand/g,
          `<span class="highlighter relative group inline-block" style="background-color: ${randomColor}; padding: 2px 0;">like a gigantic malformed hand` +
            '<span class="absolute -top-14 left-0 bg-blue-600 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 w-56 annotation-tag">' +
            "<strong>Simile:</strong> Compares the tree branches to a hand, suggesting something unnatural/creepy</span>" +
            '<span class="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-800 annotation-tag">👆 Hover to see note</span></span>'
        );

        paragraphElement.innerHTML = highlightedText;

        // Add a message with button to proceed
        setTimeout(() => {
          addMessageWithButtons(
            'I have found a simile that I can use to answer the question. When ready click "Use to answer" to see an example of how I use this to answer.',
            [{ text: "Use to answer", action: "use_to_answer" }]
          );
        }, 1000);
      } else {
        console.error(
          "Could not find the paragraph element with class .extract-text"
        );
      }
    }, 500);
  };

  // Handle the "Use to answer" button click
  const handleUseToAnswer = () => {
    setShowAnswerArea(true);
    setActiveView("answer");
    addMessage(
      "Now let's write the answer. You can switch between views using the buttons below."
    );
  };

  // Function to switch between question and answer views
  const switchView = (view) => {
    console.log("Switching view to:", view);
    // Only update the view, don't reset any state or flow
    setActiveView(view);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Modal Component */}
      <IntroModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Add welcome message if it hasn't been added yet
          if (!welcomeMessageSent.current) {
            welcomeMessageSent.current = true;
            setTimeout(() => {
              addMessageWithButtons(
                "Let's learn about GCSE English Language Paper 1 Question 2. Ready to begin?",
                [{ text: "Begin", action: "begin" }]
              );
            }, 300);
          }
        }}
      />

      {/* Info icon to reopen modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md z-20"
        title="Show instructions"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {/* Fixed-height container for consistent UI */}
      <div className="min-h-[600px] relative">
        {/* Question View */}
        <div
          className={`transition-all duration-500 absolute inset-0 ${
            activeView === "question" ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Question Header with Question Number */}
          <div className="flex items-center mb-4">
            <div className="inline-flex items-center justify-center border border-black text-center mr-2">
              <div className="w-8 h-8 flex items-center justify-center">0</div>
              <div className="w-8 h-8 flex items-center justify-center border-l border-black">
                2
              </div>
            </div>
            <span className="font-medium">
              Look in detail at this extract, from{" "}
              <span className="italic">lines 14 to 23</span> of the source:
            </span>
          </div>

          {/* Extract Box */}
          <div className="border border-black p-4 mb-6 bg-gray-50">
            <p className="mb-4 extract-text">
              Rosie had made a quick check of the unfamiliar garden before
              letting the children go out to play. The bottom half of the garden
              was an overgrown mess, a muddle of trees and shrubs. An ancient
              mulberry tree stood at the centre. Its massive twisted branches
              drooped to the ground in places, its knuckles in the earth like a
              gigantic malformed hand. The wintry sun hung low in the sky and
              the gnarled growth threw long twisted shadows across the
              undergrowth within its cage. The trunk of the tree was snarled
              with the tangled ivy that grew up through the broken bricks and
              chunks of cement, choking it. The path that led down towards the
              fence at the bottom, which marked the garden off from an orchard
              beyond, disappeared into a mass of nettles and brambles before it
              reached the padlocked door.
            </p>

            <p className="mb-4 relative" ref={questionRef}>
              How does the writer use language here to describe the garden?
            </p>

            <p className="mb-2">You could include the writer's choice of:</p>
            <ul className="list-disc list-inside">
              <li>words and phrases</li>
              <li>language features and techniques</li>
              <li>sentence forms.</li>
            </ul>

            <p className="text-right">[8 marks]</p>
          </div>
        </div>

        {/* Answer View */}
        {showAnswerArea && (
          <div
            className={`transition-all duration-500 absolute inset-0 ${
              activeView === "answer" ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Answer Header with formatted styling */}
            <div className="flex items-center mb-4">
              <div className="inline-flex items-center justify-center border border-black text-center mr-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  0
                </div>
                <div className="w-8 h-8 flex items-center justify-center border-l border-black">
                  2
                </div>
              </div>
              <span className="font-medium">
                Example answer showing analysis of language
              </span>
            </div>

            {/* Example Answer Box - styled similar to the question box */}
            <div className="border border-black p-4 mb-6 bg-gray-50">
              <div className="mb-4">
                <p className="mb-4">
                  <strong>Example answer:</strong>
                </p>
                <p className="mb-4">
                  The writer uses the simile "like a gigantic malformed hand" to
                  create an unsettling, threatening image of the garden. This
                  comparison personifies the tree in a grotesque way, making it
                  seem almost monstrous or unnatural.
                </p>
              </div>
            </div>

            <div className="border border-green-600 p-4 bg-green-50">
              <h3 className="text-lg font-bold mb-3 text-green-800">
                Explanation
              </h3>

              <div className="prose max-w-none">
                <p className="mb-3 font-medium">
                  This answer follows the pattern:
                </p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                  <li>
                    <strong>Who:</strong> The writer
                  </li>
                  <li>
                    <strong>What:</strong> Uses a simile (language feature
                    identified)
                  </li>
                  <li>
                    <strong>Where:</strong> "like a gigantic malformed hand"
                    (exact quote)
                  </li>
                  <li>
                    <strong>Why:</strong> Creates an unsettling, threatening
                    image (explains effect)
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons - Fixed position at the bottom */}
      <div className="flex gap-4 mt-6 h-16">
        {/* View switching buttons - only visible after showing the answer */}
        {showAnswerArea && (
          <>
            <button
              onClick={() => switchView("question")}
              className={`px-6 py-3 rounded-md flex items-center gap-2 shadow-md transition-all ${
                activeView === "question"
                  ? "bg-blue-600 text-white font-medium"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7 7-7"
                ></path>
              </svg>
              <span>Question</span>
            </button>

            <button
              onClick={() => switchView("answer")}
              className={`px-6 py-3 rounded-md flex items-center gap-2 shadow-md transition-all ${
                activeView === "answer"
                  ? "bg-blue-600 text-white font-medium"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              <span>Answer</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionTwo;
