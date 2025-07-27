import React, { useState, useCallback } from 'react';
import Modal from './Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { GeneratedDocument } from '../GeneratedDocument';
import { Spinner } from '../ui/Spinner';
import { generateMonthlyReport } from '../../services/geminiService';
import type { MonthlyReportData } from '../../types';

interface MonthlyReportModalProps {
  onClose: () => void;
  onBack: () => void;
}

const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({ onClose, onBack }) => {
    const [formData, setFormData] = useState<MonthlyReportData>({
        npoName: '',
        reportingPeriod: '',
        highlights: '',
        challenges: '',
        beneficiariesReached: '',
        fundsRaised: '',
        goalsNextMonth: '',
    });
    const [generatedReport, setGeneratedReport] = useState<string>('');
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
        setGeneratedReport('');

        try {
            const reportText = await generateMonthlyReport(formData);
            setGeneratedReport(reportText);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    return (
        <Modal title="Auto-Monthly Reporting Tool" onClose={onClose} onBack={onBack}>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-8">
                Enter your key metrics for the month, and let our AI assemble a professional, well-structured report for your stakeholders.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                    <Card>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input name="npoName" value={formData.npoName} onChange={handleChange} placeholder="Your NPO's Name" required />
                            <Input name="reportingPeriod" value={formData.reportingPeriod} onChange={handleChange} placeholder="e.g., August 2024" required />
                            <Textarea name="highlights" value={formData.highlights} onChange={handleChange} placeholder="Key achievements and highlights..." rows={3} required />
                            <Textarea name="challenges" value={formData.challenges} onChange={handleChange} placeholder="Challenges encountered..." rows={3} required />
                            <Input name="beneficiariesReached" value={formData.beneficiariesReached} onChange={handleChange} placeholder="Number of beneficiaries reached (e.g., 150)" required />
                            <Input name="fundsRaised" value={formData.fundsRaised} onChange={handleChange} placeholder="Funds raised (e.g., R25,000)" required />
                            <Textarea name="goalsNextMonth" value={formData.goalsNextMonth} onChange={handleChange} placeholder="Goals for the next month..." rows={3} required />
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? 'Generating...' : '📊 Generate Report'}
                            </Button>
                        </form>
                    </Card>
                </div>

                <div className="lg:sticky top-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200 min-h-[400px]">
                            <Spinner />
                            <p className="mt-4 text-lg text-gray-600 animate-pulse">Generating your report...</p>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    {generatedReport && (
                        <GeneratedDocument title="Generated Monthly Report" content={generatedReport} />
                    )}
                    {!isLoading && !error && !generatedReport && (
                        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200 min-h-[400px]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <p className="mt-4 text-lg text-center text-gray-500">Your generated report will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default MonthlyReportModal;