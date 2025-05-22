
import React from 'react';

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="text-left w-full">
      <h4 className="text-lg font-medium mb-3 border-b border-white/10 pb-1">
        {title}
      </h4>
      {children}
    </div>
  );
};

export default FooterColumn;
