import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface GeneratedDocumentProps {
  title: string;
  content: string;
}

export const GeneratedDocument: React.FC<GeneratedDocumentProps> = ({ title, content }) => {
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const copyToClipboard = () => {
    // A more robust way to copy text from markdown-like syntax
    const plainText = content.replace(/\*\*(.*?)\*\*/g, '$1').replace(/###\s?/g, '').replace(/##\s?/g, '').replace(/#\s?/g, '');
    navigator.clipboard.writeText(plainText).then(() => {
      setCopySuccess('Copied!');
    }, () => {
      setCopySuccess('Failed to copy.');
    });
  };

  const downloadPdf = async () => {
    if (!contentRef.current) return;
    setIsDownloading(true);

    try {
        const canvas = await html2canvas(contentRef.current, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const imgWidth = pdfWidth - 20; // with margin
        const imgHeight = imgWidth / ratio;
        
        let heightLeft = imgHeight;
        let position = 10; // top margin

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);

        while (heightLeft > 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - 20);
        }

        pdf.save(`${title.replace(/\s+/g, '-')}-npo-connect.pdf`);
    } catch(e) {
        console.error("Error generating PDF:", e);
        alert("Sorry, there was an error creating the PDF. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  }

  const formattedContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    .replace(/###\s(.*?)\n/g, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
    .replace(/##\s(.*?)\n/g, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3 border-b pb-2">$1</h2>')
    .replace(/(\n\d\.\s)/g, '<br/><br/>$1')
    .replace(/\n/g, '<br/>');

  return (
    <Card>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex gap-2">
            <button
                onClick={copyToClipboard}
                className="relative px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors"
                >
                {copySuccess ? 'Copied!' : 'Copy Text'}
            </button>
            <button
                onClick={downloadPdf}
                disabled={isDownloading}
                className="relative px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:bg-gray-400"
            >
                {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
        </div>
      </div>
      <div 
        ref={contentRef}
        className="prose prose-lg max-w-none text-gray-700 leading-relaxed bg-white p-4"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    </Card>
  );
};
