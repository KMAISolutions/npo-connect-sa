import React from 'react';
import { Card } from '../ui/Card';
import Modal from './Modal';
import type { ModalType } from '../../types';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tool: ModalType;
}

interface DashboardModalProps {
  onClose: () => void;
  onOpenTool: (tool: ModalType) => void;
}

const DashboardModal: React.FC<DashboardModalProps> = ({ onClose, onOpenTool }) => {
    
    const FeatureCard: React.FC<FeatureCardProps & { onClick: () => void }> = ({ title, description, icon, onClick }) => (
      <button onClick={onClick} className="block group text-left w-full h-full">
        <Card className="h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-brand-green">
          <div className="flex items-start gap-4">
            <div className="text-brand-green bg-green-100 p-3 rounded-lg">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-green transition-colors">{title}</h3>
              <p className="mt-1 text-gray-600">{description}</p>
            </div>
          </div>
        </Card>
      </button>
    );

    const features: FeatureCardProps[] = [
        {
            title: 'Business Proposal Generator',
            description: 'Craft persuasive proposals for funding applications.',
            tool: 'wizard',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        },
        {
            title: 'Auto-Monthly Reporting',
            description: 'Generate professional monthly reports from your key metrics.',
            tool: 'monthly-report',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        },
        {
            title: 'Donor Matching Assistant',
            description: 'Find potential corporate donors and foundations in SA.',
            tool: 'donor-match',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
        },
        {
            title: 'AI Chatbot Assistant',
            description: 'Get instant advice on NPO management and strategy.',
            tool: 'chatbot',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
        },
        {
            title: 'Task & Deadline Calendar',
            description: 'Track grant deadlines and important tasks. (Data stored locally)',
            tool: 'calendar',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
        },
    ];

  return (
    <Modal title="NPO Dashboard" onClose={onClose}>
        <div className="text-center mb-8">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your command center for AI-powered tools and organizational resources.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature: FeatureCardProps) => (
              <FeatureCard key={feature.title} {...feature} onClick={() => onOpenTool(feature.tool)} />
            ))}
        </div>
    </Modal>
  );
};

export default DashboardModal;