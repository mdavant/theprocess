
import React from 'react';

interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, actions }) => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-text-light">{title}</h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
};

export default Header;
