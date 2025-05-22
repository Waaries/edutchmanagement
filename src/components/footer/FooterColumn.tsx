
import React from 'react';

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="text-left w-full">
      <h4 className="text-xl font-medium mb-5 border-b border-white/10 pb-2 relative">
        <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-16 after:h-[3px] after:bg-primary">
          {title}
        </span>
      </h4>
      {children}
    </div>
  );
};

export default FooterColumn;
