import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** "dark" = dark artwork for light backgrounds, "light" = light artwork for dark backgrounds */
  variant?: "dark" | "light";
  className?: string;
  alt?: string;
}

const Logo = ({ variant = "dark", className, alt = "eDutch Management" }: LogoProps) => (
  <img
    src={variant === "light" ? logoLight : logoDark}
    alt={alt}
    className={cn("w-auto object-contain", className)}
  />
);

export default Logo;
