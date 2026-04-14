'use client';
import { useState, useRef, useEffect } from 'react';
import { translateText } from '@/lib/translation';
import { 
    ruleBasedBot, menuBasedBot, keywordBasedBot, nlpBot, generativeAIBot, 
    voiceChatbot, hybridChatbot, transactionalChatbot, resetTransactionalState, 
    aiAgentChatbot, emotionalChatbot 
} from '@/lib/botLogic';

const botRouter = {
    "1": ruleBasedBot, "2": menuBasedBot, "3": keywordBasedBot, "4": nlpBot, "5": generativeAIBot,
    "6": voiceChatbot, "7": hybridChatbot, "8": transactionalChatbot, "9": aiAgentChatbot, "10": emotionalChatbot
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState("1");
    const [lang, setLang] = useState("english");
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello there! I am your modular AI. Select a mode above and let\'s get started.', time: '' }]);
    const [isTyping, setIsTyping] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setIsMounted(true);
        setMessages(prev => {
            const newArr = [...prev];
            if (!newArr[0].time) newArr[0].time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return newArr;
        });
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    if (!isMounted) return null;

    const handleModeChange = (e) => {
        setMode(e.target.value);
        if(e.target.value === "8") resetTransactionalState();
        setMessages(prev => [...prev, { 
            sender: 'bot', 
            text: `Switched to Mode ${e.target.value}.`, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;
        
        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { sender: 'user', text: userMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setIsTyping(true);

        try {
            const botFunction = botRouter[mode];
            let rawInputForBot = userMsg;
            
            // 1. Translate to English safely if not english
            if(lang !== "english") {
                 rawInputForBot = await translateText(userMsg, lang, 'english');
            }

            // 2. Await execution if function is async (Generative, Hybrid, Agent)
            const result = botFunction(rawInputForBot);
            const englishResponse = (result instanceof Promise) ? await result : result;

            // 3. Translate back to target language
            let finalOutput = englishResponse;
            if(lang !== "english") {
                finalOutput = await translateText(englishResponse, 'english', lang);
            }

            setMessages(prev => [...prev, { sender: 'bot', text: finalOutput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { sender: 'bot', text: "Framework Network Error.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <div className={`chat-widget ${!isOpen ? 'closed' : ''}`}>
                <div className="chat-header">
                    <div className="header-info">
                        <div className="avatar">
                             🤖
                            <div className="online-indicator"></div>
                        </div>
                        <div>
                            <h3>AI Assistant</h3>
                            <p>Active Next.js Node</p>
                        </div>
                    </div>
                </div>

                <div className="mode-selector">
                    <div className="selector-row">
                        <label>Testing Mode:</label>
                        <select value={mode} onChange={handleModeChange}>
                            <option value="1">1. Rule-Based Chatbot</option>
                            <option value="2">2. Menu-Based Chatbot</option>
                            <option value="3">3. Keyword-Based Chatbot</option>
                            <option value="4">4. NLP Conversational</option>
                            <option value="5">5. Generative AI</option>
                            <option value="6">6. Voice Stylized Bot</option>
                            <option value="7">7. Hybrid (Rule + AI)</option>
                            <option value="8">8. Transactional Bot</option>
                            <option value="9">9. AI Agent</option>
                            <option value="10">10. Emotional AI</option>
                        </select>
                    </div>
                    <div className="selector-row">
                        <label>Language:</label>
                        <select value={lang} onChange={(e) => setLang(e.target.value)}>
                            <option value="english">English</option>
                            <option value="hindi">Hindi</option>
                            <option value="hinglish">Hinglish</option>
                            <option value="chinese">Chinese</option>
                            <option value="bengali">Bengali</option>
                            <option value="marathi">Marathi</option>
                        </select>
                    </div>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.sender}`}>
                            <div className="msg-content">{msg.text}</div>
                            <div className="msg-time">{msg.time}</div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message bot">
                            <div className="msg-content" style={{fontStyle: 'italic', opacity: 0.7}}>Translating & Thinking...</div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <input 
                        type="text" 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        disabled={isTyping}
                    />
                    <button onClick={handleSend} disabled={isTyping}>🚀</button>
                </div>
            </div>

            <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '💬'}
            </button>
        </>
    );
}
