import Link from "next/link";
import { isExternal } from "@/lib/nav";

/**
 * Internal pages use client-side navigation; links to the live epoch.ai site
 * get a small ↗ and a screen-reader hint so nobody is surprised by the jump.
 */
export default function SmartLink({ href, children, mark = false, ...rest }) {
  if (isExternal(href)) {
    const onEpoch = href.startsWith("https://epoch.ai");
    return (
      <a href={href} {...rest}>
        {children}
        {mark && <span className="ext" aria-hidden="true">↗</span>}
        {mark && <span className="sr-only">{onEpoch ? " (on epoch.ai)" : " (external site)"}</span>}
      </a>
    );
  }
  return <Link href={href} {...rest}>{children}</Link>;
}
