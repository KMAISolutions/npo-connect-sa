import React, { useState, useCallback } from 'react';
import Modal from './Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { findDonors } from '../../services/geminiService';
import type { DonorMatchData } from '../../types';
import type { GenerateContentResponse, Part } from '@google/genai'; // Added Part type

interface DonorMatchResultsProps { 
    response: GenerateContentResponse 
}

const DonorMatchResults: React.FC<DonorMatchResultsProps> = ({ response }) => {
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks?.map((chunk: { web?: { uri: string; title: string } }) => chunk.web).filter(Boolean) || [];

    const formattedContent = response.text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
        .replace(/###\s(.*?)\n/g, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
        .replace(/##\s(.*?)\n/g, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3 border-b pb-2">$1</h2>')
        .replace(/\n/g, '<br/>');

    return (
        <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Potential Donor Matches</h2>
            <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
            {sources.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 border-t pt-4">Sources from Google Search</h3>
                    <div className="space-y-2">
                        {sources.map((source: { uri: string; title: string }, index: number) => (
                            <a 
                                key={index} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <p className="font-semibold text-brand-green">{source.title}</p>
                                <p className="text-sm text-gray-500 truncate">{source.uri}</p>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

interface DonorMatchModalProps {
  onClose: () => void;
  onBack: () => void;
}

const DonorMatchModal: React.FC<DonorMatchModalProps> = ({ onClose, onBack }) => {
    const [formData, setFormData] = useState<DonorMatchData>({
        npoMission: '',
        fundingNeeds: '',
        region: 'Gauteng',
    });
    const [results, setResults] = useState<GenerateContentResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResults(null);

        try {
            const response = await findDonors(formData);
            setResults(response);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    return (
        <Modal title="Donor Matching Assistant" onClose={onClose} onBack={onBack}>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-8">
                Describe your NPO's mission and funding needs to discover potential donors. Our AI uses Google Search for up-to-date recommendations.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                 <div>
                    <Card>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Textarea name="npoMission" value={formData.npoMission} onChange={handleChange} placeholder="Describe your NPO's core mission..." rows={4} required />
                            <Textarea name="fundingNeeds" value={formData.fundingNeeds} onChange={handleChange} placeholder="What do you need funding for? (e.g., a new youth center, educational materials)" rows={4} required />
                            <Input name="region" value={formData.region} onChange={handleChange} placeholder="Region (e.g., Gauteng, Western Cape)" required />
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? 'Searching...' : '🔍 Find Donors'}
                            </Button>
                        </form>
                    </Card>
                </div>

                <div className="lg:sticky top-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200 min-h-[400px]">
                            <Spinner />
                            <p className="mt-4 text-lg text-gray-600 animate-pulse">Searching for donors...</p>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    {results && (
                       <DonorMatchResults response={results} />
                    )}
                    {!isLoading && !error && !results && (
                        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200 min-h-[400px]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <p className="mt-4 text-lg text-center text-gray-500">Potential donor matches will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default DonorMatchModal;