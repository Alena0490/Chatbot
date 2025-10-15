import { useState, useEffect, useRef } from 'react';
import { sendMessage } from '../services/groqService';
import './Chatbot.css';
import TypewriterMessage from './TypewriterMessage.jsx'; 
import { detectMood } from '../utils/detectMood';
import { LuRefreshCw } from "react-icons/lu";

const Chatbot = () => {
 const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ahoj! 😸 Jsem Mojo. Jak ti mohu pomoci?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // ✨

const inputRef = useRef(null);
useEffect(() => {
  const id = requestAnimationFrame(() => inputRef.current?.focus());
  return () => cancelAnimationFrame(id);
}, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: response }]);
      setIsTyping(true);
    } catch (error) {
        console.error('Chyba při volání API:', error);  // Vypíše do konzole
        setMessages([...newMessages, { 
            role: 'assistant', 
            content: 'Omlouvám se, něco se pokazilo. Zkuste to prosím znovu.' 
        }]);
        setIsTyping(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const subtitles = [
    'Tvůj chytrý asistent',
    'Rychlá pomoc na jednom místě',
    'Vysvětlím, poradím, navrhnu',
    'Jsem tu, když něco drhne',
    'Pomohu ti s čímkoli',
    'Tvůj digitální parťák',
    'Mluv se mnou, jsem tu pro tebe',
  ];
  const [subtitle] = useState(() => subtitles[Math.floor(Math.random()*subtitles.length)]);

  const [showSub, setShowSub] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShowSub(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const endRef = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
    });
    return () => cancelAnimationFrame(id);
  }, [messages.length, isTyping, isLoading]);

  const AVATAR_BASE = `${import.meta.env.BASE_URL}avatars/`.replace(/\/+/g, '/');

  return (<>
    <article 
      className="chatbot-container"
      role="region"
      aria-label="Mojo, tvůj AI asistent"
    >
      <div className="chatbot-header">
        <h1 >Mojo</h1>
        <h2
          className={`subtitle ${showSub ? 'subtitle--show' : ''}`}
          aria-hidden={!showSub}
        >
          {subtitle}
        </h2>
        <button
          className="new-chat-btn"
          title="Nový chat"
          aria-label="Nový chat"
          tabIndex="0"
          onClick={() => {
            setMessages([
              { role: "assistant", content: "Ahoj! 😸 Jsem Mojo. Jak ti mohu pomoci?" }
            ]);
            localStorage.removeItem("mojoMessages");
          }}
        >
          {<LuRefreshCw className='icon' />}
        </button>
      </div>
        <div className="chat-window">
            <div 
              className="messages"
              role="log"
              aria-live="off" 
              aria-relevant="additions text"
            >
               {messages.map((msg, index) => {
                  const mood = msg.role === 'assistant' ? detectMood(msg.content) : 'basic';
                    const isLast = index === messages.length - 1;
                    const shouldType = msg.role === 'assistant' && isLast && isTyping;
                  
                  return (
                    <div 
                      key={index} 
                      className={`message-wrapper ${msg.role}`}
                      role="article"
                      aria-label={msg.role === "assistant" ? "Mojo" : "Uživatel"}
                    >
                      {msg.role === 'assistant' && (
                        <img 
                          src={`${AVATAR_BASE}${mood}.webp`} 
                          alt="Mojo avatar"
                          width={42}
                          height={45} 
                          className="message-avatar"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `${AVATAR_BASE}basic.webp`;
                          }}
                        />
                      )}
                      {shouldType ? (
                        <TypewriterMessage
                          text={msg.content}
                          cps={18}
                          className={`message ${msg.role}`}
                          onDone={() => setIsTyping(false)} // ✨ po dopsání vypnout „typing“
                        />
                      ) : (
                        <div className={`message ${msg.role}`} role="text">
                          {msg.content}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={endRef} aria-hidden="true" />
            </div>
            <div className="input-area">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Napiš zprávu..."
                disabled={isLoading}
                className="message-input"
                aria-label="Napiš zprávu"
                tabIndex="0"
                ref={inputRef}
              />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="send-button"
                  aria-label="Odeslat zprávu"
                  tabIndex="0"
                >
                Odeslat
                </button>
            </div>
        </div>
    </article>
  </>)
}

  export default Chatbot;