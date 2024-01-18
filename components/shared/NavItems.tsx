"use client"

import { headerLinks } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const NavItems = () => {
  const pathname = usePathname();
  return (
    <ul className="md:flex md:justify-between md:items-center flex w-full items-start flex-col gap-5 md:flex-row">
      {headerLinks.map((item) => {
        const isActive = pathname === item.route;
        return (
          <li
            key={item.route}
            className={`${
              isActive && "text-primary-500"
            } flex-center p-medium-16 whitespace-nowrap`}
          >
            <Link href={item.route}>{item.label}</Link>
          </li>
        );
      })}
    </ul>
  );
}

export default NavItems