'use client';

import { useState } from 'react';
import Chat from '@/components/chat'
import EnhancedSidebar from '@/components/sidebar'

export default function Home() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Test color display */}
      <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm">
        Claude Orange Test
      </div>
      
      <EnhancedSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={setIsSidebarCollapsed} 
      />
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'pl-20' : 'pl-72'}`}>
        <Chat />
      </main>
    </div>
  );
}
