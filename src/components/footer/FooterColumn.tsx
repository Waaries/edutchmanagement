
import React from 'react';

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="text-left">
      <h4 className="text-xl font-semibold mb-6 border-b border-white/10 pb-2">
        {title}
      </h4>
      {children}
    </div>
  );
};

export default FooterColumn;
