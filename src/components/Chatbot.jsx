import { useState } from 'react';
import { sendMessage } from '../services/groqService';
import './Chatbot.css';
import { detectMood } from '../utils/detectMood';
import { LuRefreshCw } from "react-icons/lu";

const Chatbot = () => {
 const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ahoj! 😸 Jsem Mojo. Jak ti mohu pomoci?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (error) {
        console.error('Chyba při volání API:', error);  // Vypíše do konzole
        setMessages([...newMessages, { 
            role: 'assistant', 
            content: 'Omlouvám se, něco se pokazilo. Zkuste to prosím znovu.' 
        }]);
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


  return (<>
    <article 
      className="chatbot-container"
      role="region"
      aria-label="Mojo, tvůj AI asistent"
    >
      <div className="chatbot-header">
        <h1 >Mojo</h1>
        <h2></h2>
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
              aria-live="polite"
              aria-relevant="additions"
            >
               {messages.map((msg, index) => {
                  const mood = msg.role === 'assistant' ? detectMood(msg.content) : 'basic';
                  
                  return (
                    <div 
                      key={index} 
                      className={`message-wrapper ${msg.role}`}
                      role="article"
                      aria-label={msg.role === "assistant" ? "Mojo" : "Uživatel"}
                    >
                      {msg.role === 'assistant' && (
                        <img 
                          src={`/avatars/${mood}.webp`} 
                          alt="Mojo avatar" 
                          className="message-avatar"
                        />
                      )}
                      <div 
                        className={`message ${msg.role}`}
                        role="text"
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
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
                autoFocus 
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