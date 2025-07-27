
import React, { useState } from 'react';
import type { ProposalData } from '../types';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface ProposalFormProps {
  onSubmit: (data: ProposalData) => void;
  isLoading: boolean;
}

const formFields: { id: keyof ProposalData; label: string; placeholder: string; type: 'input' | 'textarea' }[] = [
  { id: 'npoName', label: 'NPO Name', placeholder: 'e.g., Sunshine Youth Center', type: 'input' },
  { id: 'npoMission', label: 'NPO Mission Statement', placeholder: 'e.g., To empower at-risk youth through education and mentorship.', type: 'textarea' },
  { id: 'projectTitle', label: 'Project Title', placeholder: 'e.g., After-School Tutoring Program', type: 'input' },
  { id: 'projectSummary', label: 'Project Executive Summary', placeholder: 'A brief, compelling overview of the entire project.', type: 'textarea' },
  { id: 'problemStatement', label: 'Problem Statement', placeholder: 'What specific problem does your project solve? e.g., High dropout rates in our community...', type: 'textarea' },
  { id: 'solution', label: 'Proposed Solution', placeholder: 'How will your project solve this problem? e.g., By providing free tutoring and safe study spaces...', type: 'textarea' },
  { id: 'targetAudience', label: 'Target Audience / Beneficiaries', placeholder: 'Who will benefit from this project? e.g., 100 high school students aged 14-18...', type: 'textarea' },
  { id: 'activities', label: 'Key Activities & Timeline', placeholder: 'What are the main activities and when will they happen? e.g., Q1: Recruit tutors, Q2: Launch program...', type: 'textarea' },
  { id: 'budget', label: 'Budget Overview', placeholder: 'Summarize the funding needed. e.g., R50,000 for staff, R20,000 for materials...', type: 'textarea' },
  { id: 'outcomes', label: 'Expected Outcomes & Impact', placeholder: 'What are the measurable results? e.g., 80% of students improve their grades...', type: 'textarea' },
];

export const ProposalForm: React.FC<ProposalFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ProposalData>({
    npoName: '',
    npoMission: '',
    projectTitle: '',
    projectSummary: '',
    problemStatement: '',
    solution: '',
    targetAudience: '',
    activities: '',
    budget: '',
    outcomes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        {formFields.map(field => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {field.type === 'input' ? (
              <Input
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
              />
            ) : (
              <Textarea
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={4}
                required
              />
            )}
          </div>
        ))}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Generating...' : '✨ Generate Proposal'}
        </Button>
      </form>
    </Card>
  );
};
