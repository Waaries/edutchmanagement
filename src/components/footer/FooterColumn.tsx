
import React from 'react';

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="text-left w-full">
      <h4 className="text-lg font-semibold tracking-wide text-white mb-5 pb-3 relative">
        {title}
        <span className="absolute bottom-0 left-0 h-px w-10 bg-blue-400/70" />
      </h4>
      {children}
    </div>
  );
};

export default FooterColumn;
