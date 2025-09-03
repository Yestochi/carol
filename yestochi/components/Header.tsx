import React, { useState, useEffect, useRef } from 'react';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { MessengerIcon, BellIcon, CaretDownIcon } from './Icons';
import type { User } from '../types';
import MessengerDropdown from './MessengerDropdown';
import NotificationsDropdown from './NotificationsDropdown';
import AccountDropdown from './AccountDropdown';

interface HeaderProps {
  onNavigateToHome: () => void;
  onNavigateToProfile: (userId: number) => void;
  nicknames: Record<number, string>;
  allUsers: User[];
  onOpenChat: (userId: number) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToHome, onNavigateToProfile, nicknames, allUsers, onOpenChat, onLogout }) => {
  const currentUser = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const getUserDisplayName = (user: User) => nicknames[user.id] || user.name;

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    const filteredUsers = allUsers.filter(user =>
      user.id !== currentUser.id && (
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (nicknames[user.id] && nicknames[user.id].toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
    setSearchResults(filteredUsers);
  }, [searchQuery, allUsers, nicknames, currentUser.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = (userId: number) => {
    onNavigateToProfile(userId);
    setSearchQuery('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-1 text-white shadow-md h-16" style={{ backgroundColor: 'var(--primary-color)'}}>
      <div className="flex items-center space-x-4">
        <h1 onClick={onNavigateToHome} className="text-3xl font-bold text-white cursor-pointer">yestochi</h1>
        <div className="relative" ref={searchRef}>
          <input
            type="text"
            placeholder="Pesquisar no Yestochi"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hidden md:block bg-white text-gray-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color-hover)]"
          />
          <svg className="absolute hidden md:block w-5 h-5 text-gray-500 left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchResults.length > 0 && searchQuery && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg text-black max-h-80 overflow-y-auto">
              <ul>
                {searchResults.map(user => (
                  <li key={user.id} onClick={() => handleProfileClick(user.id)} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                    <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full" />
                    <span className="ml-3">{getUserDisplayName(user)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div 
          onClick={() => onNavigateToProfile(currentUser.id)}
          className="flex items-center p-2 rounded-lg hover:bg-black/20 cursor-pointer"
        >
          <img src={currentUser.profilePicture} alt={currentUser.name} className="w-8 h-8 rounded-full" />
          <span className="ml-2 font-semibold hidden lg:block">{getUserDisplayName(currentUser).split(' ')[0]}</span>
        </div>
        <div className="relative">
          <div onClick={() => { setIsMessengerOpen(p => !p); setIsNotificationsOpen(false); setIsAccountOpen(false); }} className="p-3 bg-black/10 rounded-full hover:bg-black/20 cursor-pointer">
            <MessengerIcon className="w-5 h-5"/>
          </div>
          {isMessengerOpen && <MessengerDropdown allUsers={allUsers} onOpenChat={onOpenChat} onClose={() => setIsMessengerOpen(false)} nicknames={nicknames} />}
        </div>
        <div className="relative">
          <div onClick={() => { setIsNotificationsOpen(p => !p); setIsMessengerOpen(false); setIsAccountOpen(false); }} className="p-3 bg-black/10 rounded-full hover:bg-black/20 cursor-pointer">
            <BellIcon className="w-5 h-5"/>
          </div>
          {isNotificationsOpen && <NotificationsDropdown onClose={() => setIsNotificationsOpen(false)} />}
        </div>
        <div className="relative">
          <div onClick={() => { setIsAccountOpen(p => !p); setIsNotificationsOpen(false); setIsMessengerOpen(false); }} className="p-3 bg-black/10 rounded-full hover:bg-black/20 cursor-pointer">
            <CaretDownIcon className="w-5 h-5"/>
          </div>
          {isAccountOpen && <AccountDropdown onClose={() => setIsAccountOpen(false)} onLogout={onLogout} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
