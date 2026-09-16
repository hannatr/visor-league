"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { RiMenuLine } from "@remixicon/react";
import logo from "@/assets/images/logo-white.png";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/rules", label: "Rules" },
  { href: "/history", label: "History" },
  { href: "/classic", label: "Classic" },
  { href: "/dfs", label: "DFS League" },
] as const;

function NavLink({
  href,
  label,
  pathname,
  onClick,
  className,
}: {
  href: string;
  label: string;
  pathname: string;
  onClick?: () => void;
  className?: string;
}) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/15",
        active && "bg-primary-foreground/20",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-primary/80 bg-primary">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
                  />
                }
              >
                <RiMenuLine data-icon="inline-start" />
                <span className="sr-only">Open main menu</span>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-primary text-primary-foreground"
                closeButtonClassName="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              >
                <SheetHeader>
                  <SheetTitle className="text-primary-foreground">
                    Visor League
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Site navigation links
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 flex flex-col gap-1 px-2">
                  {links.map((link) => (
                    <NavLink
                      key={link.href}
                      {...link}
                      pathname={pathname}
                      className="block"
                      onClick={() => setMobileOpen(false)}
                    />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <Link className="flex shrink-0 items-center" href="/">
              <Image
                className="h-10 w-auto"
                src={logo}
                priority
                alt="Visor League"
              />
              <span className="ml-2 hidden font-heading text-2xl font-bold text-primary-foreground md:block">
                Visor League
              </span>
            </Link>
            <div className="hidden md:ml-6 md:block">
              <div className="flex gap-1">
                {links.map((link) => (
                  <NavLink key={link.href} {...link} pathname={pathname} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
