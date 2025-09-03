import React from 'react';
import { users } from '../services/mockData';
import { MessengerIcon } from './Icons';
import type { User } from '../types';

interface RightSidebarProps {
  nicknames: Record<number, string>;
  onOpenChat: (userId: number) => void;
  getUserDisplayName: (user: User) => string;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ nicknames, onOpenChat, getUserDisplayName }) => {
  const contacts = users.slice(1, 8); // Exclude current user

  return (
    <div className="sticky top-20 space-y-6">
      <div>
        <h3 className="text-gray-500 font-semibold mb-2">Patrocinado</h3>
        <a href="#" className="block p-2 rounded-lg hover:bg-gray-200">
          <div className="flex items-center space-x-3">
            <img src="https://picsum.photos/seed/ad1/100/100" alt="Ad 1" className="w-24 h-24 object-cover rounded-lg" />
            <div>
              <p className="font-semibold text-gray-800">Aprenda React em 30 Dias</p>
              <p className="text-sm text-gray-500">reactmasters.com</p>
            </div>
          </div>
        </a>
      </div>

      <div className="border-t border-gray-300 pt-4">
        <h3 className="text-gray-500 font-semibold mb-2">Contatos</h3>
        <div className="space-y-1">
          {contacts.map(user => (
            <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-200 cursor-pointer" onClick={() => onOpenChat(user.id)}>
              <div className="flex items-center">
                <div className="relative">
                  <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full" />
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-800 leading-tight">{getUserDisplayName(user)}</p>
                </div>
              </div>
               <button onClick={(e) => { e.stopPropagation(); onOpenChat(user.id); }} className="text-gray-400 hover:text-[var(--primary-color)]" aria-label={`Conversar com ${user.name}`}>
                  <MessengerIcon className="w-5 h-5" />
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;