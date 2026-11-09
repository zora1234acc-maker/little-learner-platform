import { useState } from "react";
import { Backpack, Shield, UserRound, UsersRound, GraduationCap, PawPrint } from "lucide-react";

const sizes = {
  xs: "h-7 w-7 text-sm",
  sm: "h-9 w-9 text-base",
  md: "h-11 w-11 text-lg",
  lg: "h-14 w-14 text-2xl",
  xl: "h-20 w-20 text-4xl",
};

const fallbacks = {
  admin: Shield,
  teacher: GraduationCap,
  teacher2: GraduationCap,
  parent: UsersRound,
  parent2: UsersRound,
  student: Backpack,
  bear: PawPrint,
  cat: PawPrint,
  dog: PawPrint,
  lion: PawPrint,
};

/** Renders an image avatar, falling back to an icon or the user's initials. */
export function Avatar({ src, name = "", emoji, size = "md", className = "", ring = false }) {
  const [broken, setBroken] = useState(false);
  const sizeClass = sizes[size] || sizes.md;
  const shape = "rounded-xl";
  const base = `inline-flex shrink-0 items-center justify-center overflow-hidden bg-blueberry/10 text-blueberry ${shape} ${sizeClass} ${
    ring ? "ring-2 ring-white shadow-sm" : ""
  } ${className}`;

  if (src && !broken) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setBroken(true)}
        className={`${base} object-cover`}
      />
    );
  }

  const FallbackIcon = emoji || fallbacks[name];

  if (FallbackIcon) {
    return (
      <span className={base} aria-label={name || "User"} title={name || "User"}>
        <FallbackIcon aria-hidden="true" className="h-1/2 w-1/2" />
      </span>
    );
  }

  const glyph = name ? name.trim().charAt(0).toUpperCase() : <UserRound className="h-1/2 w-1/2" />;
  return (
    <span className={base} aria-label={name || "User"} title={name || "User"}>
      {glyph}
    </span>
  );
}
