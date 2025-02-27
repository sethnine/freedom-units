"use client";

import NextLink from "next/link";

import { useRouter } from "next/navigation";
import React from "react";

interface CustomLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}

export default function Link({ href, children, ...props }: CustomLinkProps) {
  const router = useRouter();
  const handleMouseDown = (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.TouchEvent<HTMLAnchorElement>
  ) => {
    console.log("Mouse down", event);
    event.preventDefault();
    router.push(href);
  };
  return (
    <NextLink
      href={href}
      {...props}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {children}
    </NextLink>
  );
}
