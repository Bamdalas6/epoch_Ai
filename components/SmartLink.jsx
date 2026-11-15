import Link from "next/link";
import { isExternal, u } from "@/lib/nav";

const EPOCH = /^https?:\/\/(www\.)?epoch\.ai/i;

/**
 * Internal pages use client-side navigation. Any epoch.ai address is rewritten to the
 * matching page on this site, so no click ever leaves for the original website.
 * Truly external links (social profiles, donation platform) get a ↗ and a hint.
 */
export default function SmartLink({ href, children, mark = false, ...rest }) {
  const target = EPOCH.test(href) ? u(href.replace(EPOCH, "") || "/") : href;
  if (isExternal(target)) {
    return (
      <a href={target} rel="noopener" {...rest}>
        {children}
        {mark && <span className="ext" aria-hidden="true">↗</span>}
        {mark && <span className="sr-only"> (external site)</span>}
      </a>
    );
  }
  return <Link href={target} {...rest}>{children}</Link>;
}
