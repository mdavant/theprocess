import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-primary border-t border-secondary flex justify-around items-center z-50">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
            currentPath === item.to ? 'text-accent' : 'text-text-dark hover:text-text-light'
          }`}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;