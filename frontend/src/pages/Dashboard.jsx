import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Clock, CheckCircle, AlertCircle, XCircle, ArrowRight, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { leadAPI } from '../utils/api';
import StatusBadge from '../components/Statusbadge';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    qualified: 0,
    followUp: 0,
    converted: 0,
    lost: 0
  });
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  
  useEffect(() => {
    fetchLeads();
  }, []);

  
  useEffect(() => {
    calculateStats();
  }, [leads]);

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

  const calculateStats = () => {
    const newStats = {
      total: leads.length,
      new: leads.filter(lead => lead.status.toLowerCase() === 'new').length,
      qualified: leads.filter(lead => lead.status.toLowerCase() === 'qualified').length,
      followUp: leads.filter(lead => lead.status.toLowerCase() === 'follow-up').length,
      converted: leads.filter(lead => lead.status.toLowerCase() === 'converted').length,
      lost: leads.filter(lead => lead.status.toLowerCase() === 'lost').length
    };
    setStats(newStats);
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

  const getLatestLeads = () => {
    return leads
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'New Leads',
      value: stats.new,
      icon: AlertCircle,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Qualified',
      value: stats.qualified,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Follow-Up',
      value: stats.followUp,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Converted',
      value: stats.converted,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Lost',
      value: stats.lost,
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="inline-flex lg:hidden items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening with your leads.</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading dashboard...</div>
              </div>
            ) : (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                  {statCards.map((card, index) => {
                    const IconComponent = card.icon;
                    return (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-lg ${card.bgColor} mr-4`}>
                            <IconComponent className={`h-6 w-6 ${card.textColor}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Leads */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">Latest Leads</h2>
                      <button
                        onClick={() => navigate('/leads')}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Show More
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Interest
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Source
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assigned To
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created At
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getLatestLeads().map((lead) => (
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
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {getLatestLeads().length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-gray-500">No leads found</div>
                        <p className="text-gray-400 text-sm mt-1">
                          Start by adding your first lead
                        </p>
                        <button
                          onClick={() => navigate('/leads')}
                          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Go to Leads
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
