import React, { useEffect } from 'react';
import { Card } from './ui/Card';
import type { Npo } from '../types';

interface DetailItemProps { 
    label: string; 
    value?: React.ReactNode | null; 
    fullWidth?: boolean 
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, fullWidth = false }) => {
    if (!value && value !== 0) return null;
    return (
        <div className={`flex flex-col ${fullWidth ? 'md:col-span-2' : ''}`}>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
            <div className="text-gray-800 mt-1 text-base">{value}</div>
        </div>
    );
};

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({title, children}) => (
    <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {children}
        </div>
    </Card>
);


interface NpoDetailModalProps {
  npo: Npo;
  onClose: () => void;
  onDonateClick: (npo: Npo) => void;
}

export const NpoDetailModal: React.FC<NpoDetailModalProps> = ({ npo, onClose, onDonateClick }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const renderList = (items?: string[]) => {
    if (!items || items.length === 0) return <p className="text-gray-500">N/A</p>;
    return (
      <ul className="list-disc list-inside space-y-1">
        {items.map((item: string, index: number) => <li key={index}>{item}</li>)}
      </ul>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="npo-detail-title"
    >
      <div 
        className="bg-gray-100 rounded-xl shadow-2xl w-full max-w-4xl h-full max-h-[95vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200 bg-white rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              {npo.logoUrl && (
                <img src={npo.logoUrl} alt={`${npo.name} logo`} className="h-16 w-16 flex-shrink-0 rounded-lg object-contain bg-white p-1 shadow-md border" />
              )}
              <div>
                <h2 id="npo-detail-title" className="text-2xl md:text-3xl font-bold text-gray-900">{npo.name}</h2>
                <p className="mt-1 text-md text-brand-green font-medium">{npo.sector}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                 <button
                    onClick={() => onDonateClick(npo)}
                    className="flex-shrink-0 hidden sm:inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Donate
                </button>
                <button 
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    aria-label="Close detail view"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        {/* Modal Body */}
        <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
          <div className="space-y-6">
            <Section title="📌 Basic Information">
                <DetailItem label="Primary Objective" value={npo.primaryObjective} fullWidth={true} />
                <DetailItem label="Theme / Focus Area" value={npo.theme} />
            </Section>

            <Section title="🗺️ Location & Address">
                <DetailItem label="Physical Address" value={npo.address} />
                <DetailItem label="City / Town" value={npo.city} />
                <DetailItem label="Province" value={npo.province} />
                <DetailItem label="Postal Address" value={npo.postalAddress || 'N/A'} />
                <DetailItem label="Postal Code" value={npo.postalCode} />
            </Section>
            
            <Section title="☎️ Contact Details">
                <DetailItem label="Contact Person" value={npo.contactPerson} />
                <DetailItem label="Telephone" value={npo.contactNumber} />
                <DetailItem label="Email Address" value={npo.email ? <a href={`mailto:${npo.email}`} className="text-brand-green hover:underline">{npo.email}</a> : 'N/A'} />
                <DetailItem label="Website" value={npo.website ? <a href={npo.website} target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">{npo.website}</a> : 'N/A'} />
                <DetailItem label="Fax Number" value={npo.faxNumber} />
            </Section>

            <Section title="🗓️ Registration & Legal">
                <DetailItem label="Date Registered" value={new Date(npo.dateRegistered).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })} />
                <DetailItem label="Registration Number" value={npo.registrationNumber || 'N/A'} />
                <DetailItem label="Compliance Status" value={npo.complianceStatus || 'N/A'} />
            </Section>
            
            <Section title="📈 Activity & Impact">
                <DetailItem label="Beneficiaries Reached (Annually)" value={npo.beneficiariesReached?.toLocaleString('en-ZA') ?? 'N/A'} />
                <DetailItem label="Donor Engagement Level" value={npo.donorEngagementLevel || 'N/A'} />
                <DetailItem label="Current Projects" value={renderList(npo.currentProjects)} />
                <DetailItem label="Past Projects" value={renderList(npo.pastProjects)} />
                <DetailItem label="Funding Sources" value={renderList(npo.fundingSources)} fullWidth={true}/>
            </Section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {npo.keywords && npo.keywords.length > 0 && (
                  <Card className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                          {npo.keywords.map((keyword: string, index: number) => (
                              <span key={index} className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">{keyword}</span>
                          ))}
                      </div>
                  </Card>
              )}
               {npo.associatedDocuments && npo.associatedDocuments.length > 0 && (
                <Card className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Associated Documents</h3>
                    <div className="space-y-2">
                        {npo.associatedDocuments.map((doc: { name: string, url: string }, index: number) => (
                            <a key={index} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-brand-green hover:underline p-1 rounded-md transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                                {doc.name}
                            </a>
                        ))}
                    </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};