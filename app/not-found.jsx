import SmartLink from "@/components/SmartLink";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="nf" aria-labelledby="nf-h">
      <div className="wrap">
        <p className="eyebrow">Error 404</p>
        <h1 id="nf-h">This page is off the trend line</h1>
        <p>The page you’re looking for doesn’t exist in this concept, or it has moved. Press <kbd>Ctrl</kbd> <kbd>K</kbd> to search, or try one of these:</p>
        <ul className="chips">
          {[["Home", "/"], ["Latest work", "/latest"], ["Trends in AI", "/trends"], ["Data on AI", "/data"], ["About", "/about"]].map(([l, h]) => <li key={h}><SmartLink href={h}>{l}</SmartLink></li>)}
        </ul>
      </div>
    </section>
  );
}
