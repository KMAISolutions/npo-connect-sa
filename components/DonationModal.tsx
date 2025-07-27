import React, { useState, useEffect } from 'react';
import type { Npo } from '../types';

interface DonationModalProps {
  npo: Npo;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ npo, onClose }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!npo.bankingDetails) return null;

  const handleCopy = () => {
    const detailsText = `
Bank Name: ${npo.bankingDetails.bankName}
Account Holder: ${npo.bankingDetails.accountHolder}
Account Number: ${npo.bankingDetails.accountNumber}
Branch Code: ${npo.bankingDetails.branchCode}
Account Type: ${npo.bankingDetails.accountType}
Reference: Donation
    `.trim();

    navigator.clipboard.writeText(detailsText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-modal-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close donation modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center">
            <h2 id="donation-modal-title" className="text-2xl font-bold text-gray-900">Donate to</h2>
            <p className="text-lg text-brand-green mt-1">{npo.name}</p>
            <p className="text-sm text-gray-500 mt-2">
              Your support makes a difference! Please use the banking details below for EFT.
            </p>
          </div>
          
          <div className="mt-6 space-y-3 bg-gray-50 p-4 rounded-md border">
            {Object.entries(npo.bankingDetails).map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                return (
                    <div key={key} className="flex justify-between items-baseline">
                        <p className="text-sm font-medium text-gray-500">{label}:</p>
                        <p className="text-sm font-semibold text-gray-800 text-right">{value}</p>
                    </div>
                );
            })}
          </div>

          <div className="mt-6">
            <button
              onClick={handleCopy}
              className={`w-full flex items-center justify-center px-4 py-3 rounded-md font-semibold text-white transition-colors ${
                copySuccess 
                ? 'bg-green-500' 
                : 'bg-brand-green hover:bg-brand-green-dark'
              }`}
            >
              {copySuccess ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Details
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};