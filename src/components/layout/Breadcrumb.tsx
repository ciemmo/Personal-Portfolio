"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  // Only show breadcrumbs for nested routes (not home, not api routes)
  const pathSegments = pathname.split("/").filter(Boolean);
  const showBreadcrumbs =
    pathname !== "/" &&
    !pathname.startsWith("/api") &&
    pathSegments.length > 0;

  if (!showBreadcrumbs) return null;

  const pathParts = pathname.split("/").filter(Boolean);
  const items = [];
  let currentPath = "";

  for (let i = 0; i < pathParts.length; i++) {
    const segment = pathParts[i];
    currentPath += `/${segment}`;

    items.push(
      <li
        key={segment}
        className={i === pathParts.length - 1 ? "active" : ""}
      >
        {i === pathParts.length - 1 ? (
          <span aria-current="page">{segment}</span>
        ) : (
          <Link href={currentPath}>
            {segment}
          </Link>
        )}
      </li>
    );
  }

  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {items}
      </ol>
    </nav>
  );
}