
import React from 'react';

interface HeaderProps {
    onDashboardClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onDashboardClick }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <a href="/" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="flex items-center space-x-3">
                 <div className="bg-brand-green p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 016-5.197M15 21a9 9 0 00-9-9" />
                    </svg>
                 </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">NPO Connect SA</h1>
            </a>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4">
            <button onClick={onDashboardClick} className="bg-brand-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-green-dark transition-colors">
               Dashboard
            </button>
            
            <button
              disabled
              title="Coming Soon"
              className="bg-gray-200 text-gray-500 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
            >
              Add Your NPO
            </button>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden">
             <button onClick={onDashboardClick} className="bg-brand-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-green-dark transition-colors">
               Dashboard
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
