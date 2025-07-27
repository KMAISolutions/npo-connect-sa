export interface ProposalData {
  npoName: string;
  npoMission: string;
  projectTitle: string;
  projectSummary: string;
  problemStatement: string;
  solution: string;
  targetAudience: string;
  activities: string;
  budget: string;
  outcomes: string;
}

export interface MonthlyReportData {
  npoName: string;
  reportingPeriod: string;
  highlights: string;
  challenges: string;
  beneficiariesReached: string;
  fundsRaised: string;
  goalsNextMonth: string;
}

export interface DonorMatchData {
  npoMission: string;
  fundingNeeds: string;
  region: string;
}

export interface Task {
  id: number;
  title: string;
  dueDate: string;
  type: 'grant' | 'task';
}


export interface BankingDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branchCode: string;
  accountType: string;
}

export interface Npo {
  id: number;
  name: string;
  logoUrl?: string;
  sector: string;
  primaryObjective: string;
  theme?: string;
  
  // Location
  address: string;
  city: string;
  province: string;
  postalAddress?: string;
  postalCode?: string;

  // Contact
  contactPerson?: string;
  contactNumber: string;
  faxNumber?: string;
  email?: string;
  website?: string;

  // Legal
  dateRegistered: string;
  registrationNumber?: string;
  complianceStatus?: string; // For PSIRA / DSD / SARS Status
  
  // Data for directory/search
  keywords?: string[];

  // Banking
  bankingDetails: BankingDetails; // Mandatory for "Donate" button

  // Associated Documents
  associatedDocuments?: { name: string, url: string }[];

  // Activity & Impact
  beneficiariesReached?: number;
  currentProjects?: string[];
  pastProjects?: string[];
  fundingSources?: string[];
  donorEngagementLevel?: 'High' | 'Medium' | 'Low';
}

export type ModalType = 'none' | 'dashboard' | 'wizard' | 'monthly-report' | 'donor-match' | 'chatbot' | 'calendar';
