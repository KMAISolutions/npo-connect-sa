import React, { useState, useMemo, useEffect } from 'react';
import type { Npo } from '../types';
import { npoData } from '../data/npoData';
import { DonationModal } from '../components/DonationModal';
import { NpoDetailModal } from '../components/NpoDetailModal';

// Custom hook for debouncing input
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const CITIES = [...new Set(npoData.map(npo => npo.city))].sort();
const SECTORS = [...new Set(npoData.map(npo => npo.sector))].sort();
const YEARS = [...new Set(npoData.map(npo => new Date(npo.dateRegistered).getFullYear()))].sort((a, b) => b - a);
const ITEMS_PER_PAGE = 6;

// === SEARCH & FILTER COMPONENT ===
interface SearchFiltersProps {
    filters: { name: string; city: string; sector: string; year: string };
    setFilters: React.Dispatch<React.SetStateAction<{ name: string; city: string; sector: string; year: string }>>;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, setFilters }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const commonInputClass = "w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-shadow shadow-sm hover:shadow-md";

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Search by name */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleInputChange}
                        placeholder="Search by name..."
                        className={commonInputClass}
                    />
                </div>

                {/* Filter by City */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <select name="city" value={filters.city} onChange={handleInputChange} className={`${commonInputClass} pr-10 appearance-none`}>
                        <option value="">All Cities</option>
                        {CITIES.map((city: string) => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                         <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>
                </div>

                {/* Filter by Sector */}
                <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h5a.997.997 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" />
                        </svg>
                    </div>
                    <select name="sector" value={filters.sector} onChange={handleInputChange} className={`${commonInputClass} pr-10 appearance-none`}>
                        <option value="">All Sectors</option>
                        {SECTORS.map((sector: string) => <option key={sector} value={sector}>{sector}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                         <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>
                </div>

                {/* Filter by Year */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <select name="year" value={filters.year} onChange={handleInputChange} className={`${commonInputClass} pr-10 appearance-none`}>
                        <option value="">All Years</option>
                        {YEARS.map((year: number) => <option key={year} value={year}>{year}</option>)}
                    </select>
                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                         <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};


// === NPO CARD COMPONENT ===
interface NpoCardProps {
    npo: Npo;
    onDonateClick: (npo: Npo) => void;
    onDetailClick: (npo: Npo) => void;
}

const NpoCard: React.FC<NpoCardProps> = ({ npo, onDonateClick, onDetailClick }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col border border-gray-200">
        <div className="p-5 flex-grow">
            <h3 className="text-xl font-bold text-gray-900 truncate">{npo.name}</h3>
            <p className="text-brand-green font-medium text-sm mt-1">{npo.sector}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p><span className="font-semibold">📍 Location:</span> {npo.city}</p>
                <p><span className="font-semibold">📞 Contact:</span> {npo.contactNumber}</p>
                 <p className="line-clamp-2"><span className="font-semibold">🎯 Objective:</span> {npo.primaryObjective}</p>
            </div>
        </div>
        <div className="bg-gray-50 px-5 py-3 flex items-center justify-between">
             <button onClick={() => onDetailClick(npo)} className="text-brand-green hover:text-brand-green-dark font-semibold text-sm">View More &rarr;</button>
             {npo.bankingDetails && (
                <button 
                    onClick={() => onDonateClick(npo)}
                    className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
                >
                    DONATE
                </button>
             )}
        </div>
    </div>
);

// === NPO TABLE COMPONENT ===
interface NpoTableProps {
    npos: Npo[];
    onDonateClick: (npo: Npo) => void;
    onDetailClick: (npo: Npo) => void;
}

const NpoTable: React.FC<NpoTableProps> = ({ npos, onDonateClick, onDetailClick }) => (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                    <th scope="col" className="px-6 py-3">Organisation Name</th>
                    <th scope="col" className="px-6 py-3">Sector</th>
                    <th scope="col" className="px-6 py-3">City</th>
                    <th scope="col" className="px-6 py-3">Contact</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {npos.map((npo: Npo) => (
                    <tr key={npo.id} className="bg-white border-b hover:bg-gray-50">
                        <th scope="row" className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                            <button onClick={() => onDetailClick(npo)} className="text-left hover:text-brand-green">{npo.name}</button>
                        </th>
                        <td className="px-6 py-4">{npo.sector}</td>
                        <td className="px-6 py-4">{npo.city}</td>
                        <td className="px-6 py-4">{npo.contactNumber}</td>
                        <td className="px-6 py-4 flex items-center space-x-2">
                             <button onClick={() => onDetailClick(npo)} className="text-brand-green hover:underline font-medium text-xs">VIEW</button>
                            {npo.bankingDetails && (
                                <button onClick={() => onDonateClick(npo)} className="text-red-600 hover:underline font-medium text-xs">DONATE</button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// === PAGINATION COMPONENT ===
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-center items-center space-x-2 mt-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page: number) => (
            <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${currentPage === page ? 'bg-brand-green text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
                {page}
            </button>
        ))}
    </div>
);

// === MAIN DIRECTORY PAGE COMPONENT ===
const DirectoryPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({ name: '', city: '', sector: '', year: '' });
    const [donationModalNpo, setDonationModalNpo] = useState<Npo | null>(null);
    const [detailModalNpo, setDetailModalNpo] = useState<Npo | null>(null);
    const debouncedName = useDebounce<string>(filters.name, 300);

    const filteredNpos = useMemo(() => {
        return npoData.filter(npo => {
            const nameMatch = debouncedName ? npo.name.toLowerCase().includes(debouncedName.toLowerCase()) : true;
            const cityMatch = filters.city ? npo.city === filters.city : true;
            const sectorMatch = filters.sector ? npo.sector === filters.sector : true;
            const yearMatch = filters.year ? new Date(npo.dateRegistered).getFullYear().toString() === filters.year : true;
            return nameMatch && cityMatch && sectorMatch && yearMatch;
        });
    }, [debouncedName, filters.city, filters.sector, filters.year]);

    const totalPages = Math.ceil(filteredNpos.length / ITEMS_PER_PAGE);
    const paginatedNpos = filteredNpos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, debouncedName]);

    const handleDonateFromDetail = (npo: Npo) => {
        setDetailModalNpo(null);
        setTimeout(() => setDonationModalNpo(npo), 150);
    };

    return (
        <>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Find Non-Profit Organisations in Gauteng</h1>
                    <p className="mt-2 text-lg text-gray-600">Search verified NPOs by name, sector, location or purpose.</p>
                </div>

                <SearchFilters filters={filters} setFilters={setFilters} />
                
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">Showing {paginatedNpos.length} of {filteredNpos.length} result{filteredNpos.length !== 1 ? 's' : ''}</p>
                    <div className="flex items-center space-x-2">
                        {/* View Toggle Buttons */}
                        <button onClick={() => setViewMode('card')} className={`p-2 rounded-md ${viewMode === 'card' ? 'bg-brand-green text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        </button>
                        <button onClick={() => setViewMode('table')} className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-brand-green text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>

                {paginatedNpos.length > 0 ? (
                    <>
                        {viewMode === 'card' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {paginatedNpos.map((npo: Npo) => <NpoCard key={npo.id} npo={npo} onDonateClick={setDonationModalNpo} onDetailClick={setDetailModalNpo} />)}
                            </div>
                        ) : (
                            <NpoTable npos={paginatedNpos} onDonateClick={setDonationModalNpo} onDetailClick={setDetailModalNpo} />
                        )}
                        {totalPages > 1 && (
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        )}
                    </>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800">No Organisations Found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search filters to find what you're looking for.</p>
                    </div>
                )}
            </main>
            {donationModalNpo && <DonationModal npo={donationModalNpo} onClose={() => setDonationModalNpo(null)} />}
            {detailModalNpo && <NpoDetailModal npo={detailModalNpo} onClose={() => setDetailModalNpo(null)} onDonateClick={handleDonateFromDetail} />}
        </>
    );
};

export default DirectoryPage;