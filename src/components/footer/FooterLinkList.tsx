
interface FooterLinkListProps {
  links: {
    text: string;
    href: string;
  }[];
}

const FooterLinkList = ({ links }: FooterLinkListProps) => {
  return (
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <a 
            href={link.href} 
            className="text-base text-slate-300 hover:text-primary transition-colors duration-300"
          >
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default FooterLinkList;
