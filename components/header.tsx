export default function Header() {
    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Claude Interface
                        </h1>
                    </div>

                    {/* Model Selector */}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                                <option value="claude-3-opus">Claude 3 Opus</option>
                                <option value="claude-3-haiku">Claude 3 Haiku</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Box Container */}
            <div className="border-t border-gray-100 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="relative">
                        <textarea 
                            className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Message Claude..."
                            rows={1}
                            style={{ minHeight: '44px', maxHeight: '200px' }}
                        />
                        <button className="absolute right-2 bottom-2 p-2 text-gray-400 hover:text-gray-600 rounded-md">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}