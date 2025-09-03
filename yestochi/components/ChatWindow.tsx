import React, { useState, useRef, useEffect } from 'react';
import type { User, Comment } from '../types';
import { useCurrentUser } from '../contexts/CurrentUserContext';

interface ChatWindowProps {
    user: User;
    messages: Comment[];
    onSendMessage: (toUserId: number, text: string) => void;
    onClose: (userId: number) => void;
    displayName: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ user, messages, onSendMessage, onClose, displayName }) => {
    const [text, setText] = useState('');
    const currentUser = useCurrentUser();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(user.id, text);
            setText('');
        }
    };

    return (
        <div className="w-80 h-96 bg-white rounded-t-lg shadow-2xl flex flex-col">
            <header className="flex items-center justify-between p-2 text-white rounded-t-lg cursor-pointer" style={{ backgroundColor: 'var(--primary-color)'}}>
                <div className="flex items-center space-x-2">
                    <img src={user.profilePicture} alt={user.name} className="w-7 h-7 rounded-full" />
                    <span className="font-semibold">{displayName}</span>
                </div>
                <button onClick={() => onClose(user.id)} className="text-white hover:text-gray-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </header>
            <main className="flex-1 p-3 overflow-y-auto bg-gray-50">
                <div className="space-y-3">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-end space-x-2 ${msg.user.id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                            {msg.user.id !== currentUser.id && (
                                <img src={msg.user.profilePicture} alt={msg.user.name} className="w-6 h-6 rounded-full"/>
                            )}
                            <div 
                                className={`max-w-[80%] px-3 py-2 rounded-2xl ${msg.user.id === currentUser.id ? 'text-white' : 'bg-gray-200 text-gray-800'}`}
                                style={{ backgroundColor: msg.user.id === currentUser.id ? 'var(--primary-color)' : '' }}
                            >
                                <p className="text-sm break-words">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-2 border-t bg-white">
                <form onSubmit={handleSend} className="flex items-center">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Digite uma mensagem..."
                        className="w-full bg-white text-black border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-1"
                        style={{'--tw-ring-color': 'var(--primary-color)'} as React.CSSProperties}
                        autoFocus
                    />
                    <button type="submit" className="ml-2 hover:opacity-80 disabled:text-gray-300 disabled:opacity-100" style={{color: 'var(--primary-color)'}} disabled={!text.trim()}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatWindow;