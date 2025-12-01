import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";
import { askGemini } from "@/lib/gemini";
import "./chatbot.css";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      id: "m0",
      role: "assistant",
      text: "Hello! I'm your AgroVision AI assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const recognitionRef = useRef(null);

  // ===============================
  // AUTO SCROLL
  // ===============================
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // ===============================
  // STOP SPEECH ON PAGE LEAVE
  // ===============================
  useEffect(() => {
    const stopOnUnload = () => window.speechSynthesis.cancel();
    window.addEventListener("beforeunload", stopOnUnload);
    return () => window.removeEventListener("beforeunload", stopOnUnload);
  }, []);

  // ===============================
  // SPEECH-TO-TEXT (MIC)
  // ===============================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = "en-IN";
      recog.continuous = false;
      recog.interimResults = false;

      recog.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current = recog;
    }
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition is not supported on this browser.");
      return;
    }
    recognitionRef.current.start();
  };

  // ===============================
  // STRIP MARKDOWN FOR TTS
  // ===============================
  const stripMarkdown = (text) => {
    if (!text) return "";

    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // **bold**
      .replace(/\*(.*?)\*/g, "$1") // *italic*
      .replace(/__(.*?)__/g, "$1") // __underline__
      .replace(/`(.*?)`/g, "$1") // `code`
      .replace(/#+\s?(.*)/g, "$1") // # headings
      .replace(/>\s?(.*)/g, "$1") // quotes
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1") // links
      .replace(/[-*]\s+/g, "") // bullet symbols
      .replace(/\n+/g, ". "); // newline pauses
  };

  // ===============================
  // TTS (SPEAKER)
  // ===============================
  const speak = (text) => {
    if (!text) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  };

  // ===============================
  // SEND MESSAGE
  // ===============================
  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    stopSpeaking();

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");

    // Typing indicator
    const typingId = crypto.randomUUID();
    setMessages((m) => [...m, { id: typingId, role: "assistant", text: "..." }]);

    const aiText = await askGemini(trimmed);

    setMessages((m) =>
      m.map((msg) =>
        msg.id === typingId
          ? { id: crypto.randomUUID(), role: "assistant", text: aiText }
          : msg
      )
    );
  };

  // ===============================
  // ENTER KEY SUBMIT
  // ===============================
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // ===============================
  // JSX UI
  // ===============================
  return (
    <div className="chatbot-page">
      <div className="chatbot-container">
        <div className="chat-card">

          {/* HEADER */}
          <div className="chat-header">
            <div className="chat-icon">🤖</div>
            <div className="chat-header-info">
              <div className="chat-title">AgroVision Bot</div>
            </div>
          </div>

          {/* MESSAGES */}
          <div ref={listRef} className="messages-container">
            <div className="messages-list">
              {messages.map((m) => (
                <div key={m.id} className={`message-wrapper ${m.role}`}>
                  <div className={`message-bubble ${m.role}`}>
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INPUT + ACTION BUTTONS */}
          <div className="input-container">

            {/* MIC BUTTON */}
            <button className="icon-button" onClick={startListening}>
              🎤
            </button>

            {/* TEXTAREA */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about crops, diseases, fertilizers..."
              className="message-input"
              rows={1}
            />

            {/* SEND */}
            <button onClick={send} className="send-button">
              Send
            </button>

            {/* SPEAKER — TOGGLE */}
            <button
              className="icon-button"
              onClick={() => {
                if (window.speechSynthesis.speaking) {
                  stopSpeaking();
                } else {
                  const lastBotMsg = messages
                    .filter((m) => m.role === "assistant")
                    .at(-1)?.text;

                  const clean = stripMarkdown(lastBotMsg);
                  speak(clean);
                }
              }}
            >
              🔊
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
