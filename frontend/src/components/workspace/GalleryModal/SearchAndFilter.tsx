import React from 'react';
import { Search } from 'lucide-react';

interface SearchAndFilterProps {
  isDarkMode: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ 
  isDarkMode, 
  searchTerm, 
  setSearchTerm, 
  selectedStyle, 
  setSelectedStyle 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <input
          type="text"
          placeholder="Search by prompt..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      <select
        value={selectedStyle}
        onChange={(e) => setSelectedStyle(e.target.value)}
        className={`px-4 py-2 border rounded-lg ${
          isDarkMode 
            ? 'bg-gray-700 border-gray-600 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        <option value="all">All Styles</option>
        <option value="realistic">Realistic</option>
        <option value="anime">Anime</option>
      </select>
    </div>
  );
};

export default SearchAndFilter; 