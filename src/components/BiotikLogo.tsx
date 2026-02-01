import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

interface BiotikLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { icon: "w-6 h-6", container: "w-8 h-8", text: "text-lg" },
  md: { icon: "w-6 h-6", container: "w-10 h-10", text: "text-xl" },
  lg: { icon: "w-8 h-8", container: "w-12 h-12", text: "text-2xl" },
};

export function BiotikLogo({ className = "", showText = true, size = "md" }: BiotikLogoProps) {
  const sizes = sizeMap[size];

  return (
    <Link to="/" className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}>
      <div className={`${sizes.container} bg-primary rounded-lg flex items-center justify-center`}>
        <Leaf className={`${sizes.icon} text-primary-foreground`} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizes.text} font-display font-bold tracking-tight text-foreground`}>Biotik</span>
          {size !== "sm" && (
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Livestock Antibiotic Stewardship
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
