import React from 'react';
import ChatWindow from './ChatWindow';
import type { User, Comment } from '../types';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { getMessageKey } from '../services/api';

interface ChatManagerProps {
    openChatUserIds: number[];
    allUsers: User[];
    messages: Record<string, Comment[]>;
    onSendMessage: (toUserId: number, text: string) => void;
    onCloseChat: (userId: number) => void;
    nicknames: Record<number, string>;
    getUserDisplayName: (user: User) => string;
}

const ChatManager: React.FC<ChatManagerProps> = ({
    openChatUserIds,
    allUsers,
    messages,
    onSendMessage,
    onCloseChat,
    nicknames,
    getUserDisplayName
}) => {
    const currentUser = useCurrentUser();

    return (
        <div className="fixed bottom-0 right-4 flex items-end space-x-4 z-20">
            {openChatUserIds.map(userId => {
                const user = allUsers.find(u => u.id === userId);
                if (!user) return null;

                const messageKey = getMessageKey(currentUser.id, userId);
                const messageHistory = messages[messageKey] || [];

                return (
                    <ChatWindow
                        key={userId}
                        user={user}
                        messages={messageHistory}
                        onSendMessage={onSendMessage}
                        onClose={onCloseChat}
                        displayName={getUserDisplayName(user)}
                    />
                );
            })}
        </div>
    );
};

export default ChatManager;
