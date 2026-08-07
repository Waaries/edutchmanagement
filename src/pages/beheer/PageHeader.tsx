interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => (
  <div className="mb-6">
    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
      {title}
    </h1>
    {description && <p className="text-slate-400 mt-1">{description}</p>}
  </div>
);

export default PageHeader;
