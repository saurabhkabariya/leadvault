import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, ArrowUpDown, ChevronDown, X, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AddLeadModal from '../components/AddLeadModal';
import { leadAPI } from '../utils/api';
import StatusBadge from '../components/Statusbadge';

const Leads = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    matchType: 'AND'
  });

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, filters]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadAPI.getLeads();
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (!searchTerm && !filters.status) {
      setFilteredLeads(filtered);
      return;
    }

    if (filters.matchType === 'OR') {
      if (searchTerm || filters.status) {
        filtered = filtered.filter(lead => {
          const matchesSearch = searchTerm ? (
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone.includes(searchTerm)
          ) : false;

          const matchesStatus = filters.status ? 
            lead.status.toLowerCase() === filters.status.toLowerCase() : false;

          return matchesSearch || matchesStatus;
        });
      }
    } else {
      if (searchTerm) {
        filtered = filtered.filter(lead => 
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone.includes(searchTerm)
        );
      }

      if (filters.status) {
        filtered = filtered.filter(lead => 
          lead.status.toLowerCase() === filters.status.toLowerCase()
        );
      }
    }

    setFilteredLeads(filtered);
  };

  const handleAddLead = async (leadData) => {
    try {
      const response = await leadAPI.createLead(leadData);
      setLeads(prev => [response.data, ...prev]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating lead:', error);
      setShowAddModal(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      matchType: 'AND'
    });
    setSearchTerm('');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="inline-flex lg:hidden items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle sidebar"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Leads</h1>
                <p className="text-xs md:text-sm text-gray-600 mt-1">Manage and track your leads</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-2 md:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus size={16} className="md:mr-2" />
              Add Lead
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 md:p-6 p-3 mb-6">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none"
                >
                  <Filter size={16} className="mr-2" />
                  {showFilters ? 'Hide Filters' : 'Filters'}
                </button>
                
                {/* Results count */}
                <span className="text-sm text-gray-600">
                  {filteredLeads.length} of {leads.length} leads
                </span>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Filters</h3>
                  
                  <div className="flex items-center space-x-6 mb-4">
                    <span className="text-sm font-medium text-gray-700">Match</span>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="matchType"
                        value="AND"
                        checked={filters.matchType === 'AND'}
                        onChange={(e) => setFilters(prev => ({ ...prev, matchType: e.target.value }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">ALL conditions (AND)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="matchType"
                        value="OR"
                        checked={filters.matchType === 'OR'}
                        onChange={(e) => setFilters(prev => ({ ...prev, matchType: e.target.value }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">ANY condition (OR)</span>
                    </label>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-1">
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select status</option>
                        <option value="New">New</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Follow-Up">Follow-Up</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>
                    {filters.status && (
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, status: '' }))}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                      Add Filter
                    </button>
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Clear
                    </button>
                    <button className="px-4 py-2 text-sm text-white bg-gray-800 rounded-lg hover:bg-gray-900">
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Loading leads...</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>Name</span>
                            <ArrowUpDown size={14} />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>Contact</span>
                            <ArrowUpDown size={14} />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>Status</span>
                            <ArrowUpDown size={14} />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>Qualification</span>
                            <ArrowUpDown size={14} />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>Interest</span>
                            <ArrowUpDown size={14} />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>Source</span>
                            <ArrowUpDown size={14} />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>Assigned To</span>
                            <ArrowUpDown size={14} />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>Updated At</span>
                            <ArrowUpDown size={14} />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <ChevronDown size={14} />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredLeads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                              {lead.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{lead.phone}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={lead.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.qualification}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.interestfield}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.source}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.assignedto}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(lead.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-gray-400 hover:text-gray-600">
                              <ChevronDown size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredLeads.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-500">No leads found</div>
                      <p className="text-gray-400 text-sm mt-1">
                        {searchTerm || filters.status 
                          ? 'Try adjusting your search or filters' 
                          : 'Get started by adding your first lead'
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddLead}
      />
    </div>
  );
};

export default Leads;
