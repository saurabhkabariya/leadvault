import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', active: location.pathname === '/' },
    { icon: Users, label: 'Leads', path: '/leads', active: location.pathname === '/leads' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        bg-white h-screen border-r border-gray-200 transition-all duration-300 flex flex-col z-50
        ${isOpen ? 'w-64' : 'w-24'}
        fixed lg:relative
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                LV
              </div>
              {isOpen && (
                <span className="ml-3 text-xl font-semibold text-gray-900">LeadVault</span>
              )}
            </div>
            <button
              onClick={onToggle}
              className="hidden lg:inline-flex p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isOpen ? <IoIosArrowBack size={20} /> : <IoIosArrowDown size={20} />}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-4 flex-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center px-4 py-3 mx-2 rounded-lg cursor-pointer transition-colors group relative ${
                  item.active 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={!isOpen ? item.label : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isOpen && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
                {!isOpen && (
                  <div className="absolute left-16 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
