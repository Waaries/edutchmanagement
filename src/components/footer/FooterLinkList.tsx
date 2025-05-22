
interface FooterLinkListProps {
  links: {
    text: string;
    href: string;
  }[];
}

const FooterLinkList = ({ links }: FooterLinkListProps) => {
  return (
    <ul className="space-y-1.5">
      {links.map((link, index) => (
        <li key={index}>
          <a 
            href={link.href} 
            className="text-slate-300 text-sm hover:text-primary transition-colors duration-300"
          >
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default FooterLinkList;
