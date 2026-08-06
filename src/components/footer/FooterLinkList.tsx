import { Link } from "react-router-dom";

interface FooterLinkListProps {
  links: {
    text: string;
    href: string;
  }[];
}

const linkClass =
  "text-base text-slate-300 hover:text-blue-400 transition-colors duration-300 inline-flex items-center group leading-tight py-1";

const FooterLinkList = ({ links }: FooterLinkListProps) => {
  return (
    <ul className="space-y-3">
      {links.map((link, index) => {
        const label = (
          <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">
            {link.text}
          </span>
        );

        return (
          <li key={index}>
            {link.href.startsWith("/") ? (
              <Link to={link.href} className={linkClass}>
                {label}
              </Link>
            ) : (
              <a href={link.href} className={linkClass}>
                {label}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default FooterLinkList;
