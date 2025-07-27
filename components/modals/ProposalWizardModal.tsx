import React, { useState, useCallback } from 'react';
import Modal from './Modal';
import { ProposalForm } from '../ProposalForm';
import { GeneratedDocument } from '../GeneratedDocument';
import { Spinner } from '../ui/Spinner';
import { generateProposal } from '../../services/geminiService';
import type { ProposalData } from '../../types';

interface ProposalWizardModalProps {
  onClose: () => void;
  onBack: () => void;
}

const ProposalWizardModal: React.FC<ProposalWizardModalProps> = ({ onClose, onBack }) => {
  const [generatedProposal, setGeneratedProposal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFormSubmit = useCallback(async (data: ProposalData) => {
    setIsLoading(true);
    setError('');
    setGeneratedProposal('');

    try {
      const proposalText = await generateProposal(data);
      setGeneratedProposal(proposalText);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Modal title="AI Business Proposal Wizard" onClose={onClose} onBack={onBack}>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-8">
        Fill in the details about your project, and our AI will craft a professional business proposal for you. The more detail you provide, the better the result.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div>
          <ProposalForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>
        <div className="lg:sticky top-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200 min-h-[400px]">
              <Spinner />
              <p className="mt-4 text-lg text-gray-600 animate-pulse">Generating your proposal...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg" role="alert">
              <strong className="font-bold">Oh no! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {generatedProposal && (
            <GeneratedDocument title="Generated Proposal" content={generatedProposal} />
          )}
           {!isLoading && !error && !generatedProposal && (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200 min-h-[400px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-lg text-center text-gray-500">Your generated proposal will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProposalWizardModal;
