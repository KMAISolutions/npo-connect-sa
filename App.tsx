import React, { useState } from 'react';
import DirectoryPage from './pages/DirectoryPage';
import { Header } from './components/Header';
import DashboardModal from './components/modals/DashboardModal';
import ProposalWizardModal from './components/modals/ProposalWizardModal';
import MonthlyReportModal from './components/modals/MonthlyReportModal';
import DonorMatchModal from './components/modals/DonorMatchModal';
import ChatbotModal from './components/modals/ChatbotModal';
import CalendarModal from './components/modals/CalendarModal';
import type { ModalType } from './types';

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>('none');

  const openModal = (modal: ModalType) => setActiveModal(modal);
  const closeModal = () => setActiveModal('none');
  const backToDashboard = () => setActiveModal('dashboard');

  const renderModal = () => {
    switch (activeModal) {
      case 'dashboard':
        return <DashboardModal onClose={closeModal} onOpenTool={openModal} />;
      case 'wizard':
        return <ProposalWizardModal onClose={closeModal} onBack={backToDashboard} />;
      case 'monthly-report':
        return <MonthlyReportModal onClose={closeModal} onBack={backToDashboard} />;
      case 'donor-match':
        return <DonorMatchModal onClose={closeModal} onBack={backToDashboard} />;
      case 'chatbot':
        return <ChatbotModal onClose={closeModal} onBack={backToDashboard} />;
      case 'calendar':
        return <CalendarModal onClose={closeModal} onBack={backToDashboard} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col bg-gray-100">
      <Header onDashboardClick={() => openModal('dashboard')} />
      <div className="flex-grow">
        <DirectoryPage />
      </div>
      <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4 text-center">
              <p>&copy; {new Date().getFullYear()} NPO Connect SA. All rights reserved.</p>
              <p className="text-sm text-gray-400 mt-1">"Where Non-Profits Meet Support, Structure & Success"</p>
              <p className="text-sm text-gray-500 mt-4">
                  Powered by: <a href="https://www.kwenamai.co.za" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white underline">Kwena Moloto A.I Solutions</a>
              </p>
          </div>
      </footer>
      {renderModal()}
    </div>
  );
};

export default App;