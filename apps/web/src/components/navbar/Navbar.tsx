"use client";

import Image from "next/image";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Edit Resume", href: "/editor" },
  { label: "Apply", href: "/apply" },
  { label: "Profile", href: "/" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-6 border-b bg-[#282828] shadow-sm">
      <div className="container mx-auto  flex items-center justify-between">
        <Link href={"/"}>
          <Image src="/logo.svg" alt="Logo" width={150} height={150} />
        </Link>

        <div className="flex gap-4 space-x-10">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-lg font-normal transition-colors ",
                pathname === href ? "text-white" : "text-white"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
