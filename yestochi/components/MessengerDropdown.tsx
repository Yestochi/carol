import React, { useRef, useEffect } from 'react';
import type { User } from '../types';

interface MessengerDropdownProps {
  allUsers: User[];
  onOpenChat: (userId: number) => void;
  onClose: () => void;
  nicknames: Record<number, string>;
}

const MessengerDropdown: React.FC<MessengerDropdownProps> = ({ allUsers, onOpenChat, onClose, nicknames }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contacts = allUsers.filter(u => u.id !== 1); // Exclude current user

  const getUserDisplayName = (user: User) => nicknames[user.id] || user.name;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const messengerIcon = (event.target as Element).closest('[data-messenger-icon]');
        if (!messengerIcon) {
          onClose();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleContactClick = (userId: number) => {
    onOpenChat(userId);
    onClose();
  };

  return (
    <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-40">
      <div className="p-3 border-b">
        <h3 className="font-bold text-xl text-gray-800">Mensagens</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {contacts.length > 0 ? (
          <ul>
            {contacts.map(user => (
              <li key={user.id} onClick={() => handleContactClick(user.id)} className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                <div className="relative">
                  <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full" />
                   <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                </div>
                <span className="ml-3 font-semibold text-gray-800">{getUserDisplayName(user)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-gray-500">Nenhum contato encontrado.</p>
        )}
      </div>
      <div className="p-2 text-center border-t">
        <a href="#" className="text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>Ver tudo no Messenger</a>
      </div>
    </div>
  );
};

export default MessengerDropdown;
