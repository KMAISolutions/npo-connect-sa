import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { GoogleGenAI, Chat } from '@google/genai';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Spinner } from '../ui/Spinner';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatbotModalProps {
  onClose: () => void;
  onBack: () => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ChatbotModal: React.FC<ChatbotModalProps> = ({ onClose, onBack }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Start loading until chat is ready
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const chatInstance = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are an expert consultant for Non-Profit Organisations in South Africa. You provide clear, actionable advice on topics like fundraising, governance, marketing, and operations. Your tone is professional, encouraging, and helpful. Format your responses with Markdown for readability.',
                },
            });
            setChat(chatInstance);
            setMessages([{ role: 'model', text: 'Hello! I am your NPO Assistant. How can I help you today with your non-profit?' }]);
        } catch (error: unknown) {
            console.error("Failed to initialize chat:", error);
            setMessages([{ role: 'model', text: 'Sorry, the chat assistant could not be initialized. Please check your API Key and network connection, then try closing and reopening this tool.' }]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || !chat || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages((prev: Message[]) => [...prev, userMessage, { role: 'model', text: '' }]);
        const messageToSend: string = input;
        setInput('');
        setIsLoading(true);
        
        try {
            const result = await chat.sendMessageStream({ message: messageToSend });
            
            let currentResponse = "";
            for await (const chunk of result) {
                const chunkText = chunk.text;
                if (chunkText) {
                    currentResponse += chunkText;
                    setMessages((prev: Message[]) => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = { role: 'model', text: currentResponse };
                        return newMessages;
                    });
                }
            }
        } catch (error: unknown) {
            console.error("Chat API error:", error);
            const errorMsg = 'Sorry, an error occurred. This could be a network issue or a problem with the AI service. Please check your connection and try again. If the problem persists, the service may be temporarily unavailable.';
            setMessages((prev: Message[]) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.role === 'model' && lastMessage.text === '') {
                     newMessages[newMessages.length - 1] = { role: 'model', text: errorMsg };
                     return newMessages;
                }
                return [...prev, { role: 'model', text: errorMsg }];
            });
        } finally {
            setIsLoading(false);
        }
    };

    const formattedText = (text: string) => {
        return text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br />');
    };

    return (
       <Modal title="AI Chatbot Assistant" onClose={onClose} onBack={onBack}>
          <div className="w-full h-full flex flex-col">
              <div className="flex-grow bg-white rounded-lg shadow-inner border border-gray-200 p-4 flex flex-col overflow-y-auto">
                  <div className="space-y-4">
                      {messages.map((msg: Message, index: number) => (
                          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                              {msg.role === 'model' && (
                                  <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white flex-shrink-0 font-bold text-sm">
                                      AI
                                  </div>
                              )}
                              <div className={`px-4 py-2 rounded-lg max-w-2xl shadow-sm ${msg.role === 'user' ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-800'}`}>
                                  {msg.text ? 
                                    <p dangerouslySetInnerHTML={{ __html: formattedText(msg.text) }}></p> 
                                    : (isLoading && index === messages.length -1) && <Spinner />
                                  }
                              </div>
                              {msg.role === 'user' && (
                                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white flex-shrink-0 font-bold text-sm">
                                      U
                                  </div>
                              )}
                          </div>
                      ))}
                      <div ref={messagesEndRef} />
                  </div>
              </div>

              <div className="mt-4 flex gap-2">
                  <Input
                      type="text"
                      value={input}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                      onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSend()}
                      placeholder="Type your message..."
                      className="flex-grow !bg-white"
                      disabled={isLoading || !chat}
                      aria-label="Chat input"
                  />
                  <Button onClick={handleSend} disabled={isLoading || !input.trim() || !chat}>
                      {isLoading ? 'Sending...' : 'Send'}
                  </Button>
              </div>
          </div>
        </Modal>
    );
};

export default ChatbotModal;