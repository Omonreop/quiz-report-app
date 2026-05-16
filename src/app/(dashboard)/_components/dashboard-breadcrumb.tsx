"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

function formatPath(path: string) {
  return path.replace(/-/g, " ");
}

export default function DashboardBreadCrumb() {
  const paths = usePathname().split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const isLast = index === paths.length - 1;

          return (
            <Fragment key={`${path}-${index}`}>
              <BreadcrumbItem className="capitalize">
                {isLast ? (
                  <BreadcrumbPage>{formatPath(path)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={<Link href={href}>{formatPath(path)}</Link>}
                  />
                )}
              </BreadcrumbItem>
              {!isLast ? <BreadcrumbSeparator /> : null}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
