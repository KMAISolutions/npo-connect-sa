import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ProposalData, MonthlyReportData, DonorMatchData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleError = (error: unknown, context: string): never => {
    console.error(`Gemini API call failed during ${context}:`, error);
    throw new Error(`Failed to ${context} due to an API error.`);
};


export const generateProposal = async (data: ProposalData): Promise<string> => {
  const { 
    npoName, 
    npoMission, 
    projectTitle, 
    projectSummary, 
    problemStatement, 
    solution, 
    targetAudience, 
    activities, 
    budget, 
    outcomes 
  } = data;

  const prompt = `
    Act as an expert non-profit grant writer and business consultant in South Africa. 
    Based on the following information, generate a comprehensive and persuasive business proposal suitable for funding applications.

    **NPO Name:** ${npoName}
    **NPO Mission Statement:** ${npoMission}
    **Project Title:** ${projectTitle}
    **Executive Summary:** ${projectSummary}
    **1. Introduction & Problem Statement:** Expand on: ${problemStatement}
    **2. Proposed Solution & Project Description:** Based on solution: ${solution} and activities: ${activities}
    **3. Target Audience / Beneficiaries:** Detail for: ${targetAudience}
    **4. Budget Overview:** Summarize for: ${budget}
    **5. Expected Outcomes & Impact Measurement:** Based on: ${outcomes}
    **6. Organizational Background:** Use NPO Name and Mission.
    **7. Conclusion:** Write a strong, persuasive call to action.

    **Instructions:**
    - Structure as a formal document with clear Markdown headings (e.g., "## 1. Introduction").
    - Use professional, formal, and compelling language.
    - Ensure the output is well-formatted and readable.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    handleError(error, 'proposal generation');
  }
};


export const generateMonthlyReport = async (data: MonthlyReportData): Promise<string> => {
  const {
    npoName,
    reportingPeriod,
    highlights,
    challenges,
    beneficiariesReached,
    fundsRaised,
    goalsNextMonth
  } = data;

  const prompt = `
    Act as an NPO management consultant. Generate a professional monthly report for "${npoName}" for the period of "${reportingPeriod}".
    
    Structure the report with the following sections using Markdown:
    1.  **Executive Summary:** A brief overview of the month's performance.
    2.  **Key Achievements & Highlights:** Based on: ${highlights}
    3.  **Challenges Encountered:** Based on: ${challenges}
    4.  **Impact Metrics:** Include:
        - Beneficiaries Reached: ${beneficiariesReached}
        - Funds Raised: ${fundsRaised}
    5.  **Goals for Next Month:** Based on: ${goalsNextMonth}
    6.  **Conclusion:** A brief closing statement.

    Use clear, concise, and professional language.
  `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        handleError(error, 'monthly report generation');
    }
};

export const findDonors = async (data: DonorMatchData): Promise<GenerateContentResponse> => {
    const { npoMission, fundingNeeds, region } = data;

    const prompt = `
        I am a Non-Profit Organisation in ${region}, South Africa.
        Our mission is: "${npoMission}".
        We are currently seeking funding for: "${fundingNeeds}".

        Based on this information, please identify 5 potential corporate donors, foundations, or grant-making institutions in South Africa that have a history of supporting similar causes. 
        
        For each potential donor, provide a brief summary of why they are a good match.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        return response;
    } catch (error) {
        handleError(error, 'donor matching');
    }
};