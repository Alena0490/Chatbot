import { useState } from 'react';
import { sendMessage } from '../services/groqService';
import './Chatbot.css';
import { detectMood } from '../utils/detectMood';

const Chatbot = () => {
 const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ahoj! 😸 Jsem Leo. Jak ti mohu pomoci?' }
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
    <article className="chatbot-container">
      <div className="chatbot-header">
        <h1 >Leo</h1>
        <h2></h2>
        <figure className="avatar">
            <img 
              src="/avatars/basic.webp"  
              alt="Leo" 
              className="header-avatar"
            />
        </figure>
      </div>
        <div className="chat-window">
            <div className="messages">
               {messages.map((msg, index) => {
                  const mood = msg.role === 'assistant' ? detectMood(msg.content) : 'basic';
                  
                  return (
                    <div key={index} className={`message-wrapper ${msg.role}`}>
                      {msg.role === 'assistant' && (
                        <img 
                          src={`/avatars/${mood}.webp`} 
                          alt="Leo" 
                          className="message-avatar"
                        />
                      )}
                      <div className={`message ${msg.role}`}>
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
                onKeyPress={handleKeyPress}
                placeholder="Napiš zprávu..."
                disabled={isLoading}
                className="message-input"
                />
                <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="send-button"
                >
                Odeslat
                </button>
            </div>
        </div>
    </article>
  </>)
}

  export default Chatbot;