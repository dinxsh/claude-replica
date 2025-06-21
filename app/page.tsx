import Chat from '@/components/chat'
import Sidebar from '@/components/sidebar'

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <Chat />
      </main>
    </div>
  );
}
