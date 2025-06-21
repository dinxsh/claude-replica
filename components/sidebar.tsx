'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MessageSquare, 
  ChevronDown, 
  ChevronLeft, 
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Archive,
  Settings,
  User,
  LogOut,
  Star,
  Menu
} from 'lucide-react';

interface ChatItem {
  id: string;
  title: string;
  isStarred: boolean;
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export default function EnhancedSidebar({ isCollapsed: externalCollapsed, onToggle }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(externalCollapsed || false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; chatId: string } | null>(null);

  const [chats, setChats] = useState<ChatItem[]>([
    { id: '1', title: 'Bright Solutions: Reliable IT & Se...', isStarred: true },
    { id: '2', title: 'Converting UTC to IST Time', isStarred: false },
    { id: '3', title: 'Defects of AI Workflows with LL...', isStarred: false },
    { id: '4', title: 'Optimizing Cold Emails for React...', isStarred: false },
    { id: '5', title: 'Advanced React Patterns', isStarred: true },
  ]);

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onToggle?.(newCollapsed);
  };

  const toggleStar = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setChats(chats.map(chat => 
      chat.id === chatId ? { ...chat, isStarred: !chat.isStarred } : chat
    ));
    setContextMenu(null);
  };

  const deleteChat = (chatId: string) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, chatId });
  };
  
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
      if (isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    if (typeof window !== 'undefined') {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('click', handleClickOutside);
      }
    };
  }, [isUserMenuOpen]);

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const starredChats = filteredChats.filter(chat => chat.isStarred);
  const recentChats = filteredChats.filter(chat => !chat.isStarred);

  const ContextMenuComponent = () => {
    if (!contextMenu) return null;
    const { x, y, chatId } = contextMenu;
    const chat = chats.find(c => c.id === chatId);

    return (
      <div 
        className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[150px]"
        style={{ left: x, top: y }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
          onClick={(e) => toggleStar(e, chatId)}
        >
          <Star size={14} className="mr-2" />
          {chat?.isStarred ? 'Unstar' : 'Star'}
        </button>
        <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center">
          <Edit size={14} className="mr-2" />
          Rename
        </button>
        <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center">
          <Archive size={14} className="mr-2" />
          Archive
        </button>
        <hr className="my-1 border-gray-200" />
        <button 
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center text-red-600"
          onClick={() => deleteChat(chatId)}
        >
          <Trash2 size={14} className="mr-2" />
          Delete
        </button>
      </div>
    );
  };

  return (
    <>
      <div className={`fixed top-0 left-0 z-40 flex flex-col ${isCollapsed ? 'w-20' : 'w-72'} bg-[#F7F7F7] border-r border-border h-full transition-all duration-300 ease-in-out text-sm`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 h-[60px] border-b border-border flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-foreground">Claude</h1>
            </div>
          )}
          <button 
            onClick={handleToggle}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3 flex-shrink-0">
          <button className={`flex items-center w-full bg-primary/20 text-primary-foreground rounded-lg ${isCollapsed ? 'justify-center p-3' : 'p-3'} font-semibold hover:bg-primary/30 transition-colors`}>
            <Plus size={16} className={`${isCollapsed ? '' : 'mr-2'} text-primary`} />
            {!isCollapsed && <span className="text-primary">New chat</span>}
          </button>
        </div>
        
        {/* Search Bar */}
        {!isCollapsed && (
          <div className="px-3 mb-2 flex-shrink-0">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>
          </div>
        )}

        {/* Chat List */}
        <div className="flex-grow overflow-y-auto px-3 mt-2">
          {/* Starred Chats */}
          {!isCollapsed && starredChats.length > 0 && (
            <div className="mb-4">
              <h2 className="px-2 text-xs font-semibold text-muted-foreground mb-2">Starred</h2>
              <div className="space-y-1">
                {starredChats.map(chat => (
                  <a key={chat.id} href="#" onContextMenu={(e) => handleContextMenu(e, chat.id)} className="group flex items-center p-2 rounded-lg hover:bg-accent transition-colors text-foreground">
                    <div className="flex-grow min-w-0 font-medium text-sm truncate">{chat.title}</div>
                    <button onClick={(e) => toggleStar(e, chat.id)} className="ml-2 p-1 rounded hover:bg-gray-300">
                      <Star size={14} className="text-yellow-500 fill-current flex-shrink-0" />
                    </button>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Recent Chats */}
          <h2 className={`px-2 text-xs font-semibold text-muted-foreground mb-2 ${isCollapsed ? 'text-center' : ''}`}>{isCollapsed ? 'All' : 'Recents'}</h2>
          <div className="space-y-1">
            {recentChats.map(chat => (
              <a key={chat.id} href="#" onContextMenu={(e) => handleContextMenu(e, chat.id)} className={`group flex items-center ${isCollapsed ? 'justify-center p-3' : 'p-2'} rounded-lg hover:bg-accent transition-colors text-foreground`} title={chat.title}>
                {isCollapsed ? <MessageSquare size={18} className="text-muted-foreground" /> : <div className="flex-grow min-w-0 font-medium text-sm truncate">{chat.title}</div>}
                {!isCollapsed && (
                  <button onClick={(e) => handleContextMenu(e, chat.id)} className="ml-2 p-1 rounded hover:bg-gray-300 opacity-0 group-hover:opacity-100">
                    <MoreHorizontal size={14} className="text-muted-foreground" />
                  </button>
                )}
              </a>
            ))}
          </div>

          {filteredChats.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats found</p>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="border-t border-border p-2 flex-shrink-0">
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setIsUserMenuOpen(!isUserMenuOpen); }}
              className={`flex items-center w-full p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="w-7 h-7 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold text-xs">D</div>
              {!isCollapsed && (
                <>
                  <span className="ml-2 flex-grow text-left font-medium text-foreground">dinesh</span>
                  <ChevronDown size={16} className="text-muted-foreground" />
                </>
              )}
            </button>
            {isUserMenuOpen && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                <div className="px-3 py-2 border-b border-border">
                  <div className="font-semibold text-foreground">dinesh</div>
                  <div className="text-xs text-muted-foreground">dinesh@example.com</div>
                </div>
                <button className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center">
                  <User size={14} className="mr-2" /> Profile
                </button>
                <button className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center">
                  <Settings size={14} className="mr-2" /> Settings
                </button>
                <hr className="my-1 border-border" />
                <button className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center text-red-600">
                  <LogOut size={14} className="mr-2" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ContextMenuComponent />
    </>
  );
}