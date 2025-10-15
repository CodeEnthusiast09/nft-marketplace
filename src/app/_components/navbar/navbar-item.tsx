"use client";

import clsx from "clsx";
import type { NavItem } from "@/interfaces/global";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavBarItemProps = {
  item: NavItem;
  onClick: Function;
};

export const NavBarItem = ({ item, onClick }: NavBarItemProps) => {
  const pathname = usePathname();

  const isActive =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href));

  return (
    <li className={clsx("relative")}>
      <Link
        href={item.href}
        onClick={() => onClick()}
        className={clsx(
          "px-4 py-2 rounded-lg flex items-center transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2",
          isActive
            ? "bg-primary-500 text-primary-100 font-semibold shadow-sm"
            : "text-primary-600 hover:bg-primary-100 hover:text-primary-500 font-medium",
        )}
      >
        <span className="text-sm text-nowrap">{item.name}</span>
      </Link>
    </li>
  );
};
