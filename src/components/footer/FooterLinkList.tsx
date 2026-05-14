
interface FooterLinkListProps {
  links: {
    text: string;
    href: string;
  }[];
}

const FooterLinkList = ({ links }: FooterLinkListProps) => {
  return (
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <a
            href={link.href}
            className="text-base text-slate-300 hover:text-blue-400 transition-colors duration-300 inline-flex items-center group leading-tight py-1"
          >
            <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">
              {link.text}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default FooterLinkList;
