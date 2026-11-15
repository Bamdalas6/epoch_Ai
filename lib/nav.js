export const HOME = "/";
const EPOCH = "https://epoch.ai";

/** Pages rebuilt in this concept. Everything else links out to epoch.ai. */
export const LOCAL = new Set([
  "/latest", "/trends", "/data", "/data-insights", "/benchmarks", "/topics",
  "/about", "/about/team", "/about/consultations", "/about/careers", "/about/donate", "/contact",
]);
const ALIAS = { "/publications": "/latest", "/eci": null };

export const isExternal = (href) => /^https?:/.test(href);
export const u = (p) => {
  const bare = p.split("?")[0];
  if (ALIAS[bare]) return ALIAS[bare];
  return LOCAL.has(bare) ? p : `${EPOCH}${p}`;
};
const L = (label, path) => ({ label, href: u(path) });

export const NAV = [
  { label: "Latest", href: "/latest" },
  {
    label: "Our work", cols: 3,
    intro: { title: "Research and data", text: "Reports, data insights and open databases on how fast AI is advancing.", href: "/latest", cta: "See the latest work" },
    groups: [
      { title: "Publications", links: [L("Trends in AI", "/trends"), L("Latest work", "/latest"), L("Data Insights", "/data-insights"), L("Newsletter", "/gradient-updates"), L("Podcast", "/epoch-after-hours")] },
      { title: "Data explorers", links: [L("All data on AI", "/data"), L("AI capabilities", "/benchmarks"), L("AI models", "/data/ai-models"), L("AI data centers", "/data/ai-data-centers"), L("AI chip sales", "/data/ai-chip-sales"), L("AI companies", "/data/ai-companies")] },
      { title: "Benchmarks", links: [L("Benchmarking hub", "/benchmarks"), L("Epoch Capabilities Index", "/eci"), L("FrontierMath", "/frontiermath"), L("MirrorCode", "/MirrorCode"), L("Epoch Automation Reports", "/benchmarks/epoch-automation-reports")] },
    ],
  },
  {
    label: "Topics", cols: 4,
    intro: { title: "Browse by topic", text: "Data, charts and analysis on each area of AI’s trajectory.", href: "/topics", cta: "All topics" },
    groups: [
      { title: "AI progress", links: [L("Scaling", "/topics/scaling"), L("Software progress", "/topics/software-progress"), L("Open models", "/topics/open-models"), L("Capabilities", "/topics/capabilities"), L("Math", "/topics/math")] },
      { title: "Industry", links: [L("Leading companies", "/topics/leading-companies"), L("Finances", "/topics/finances"), L("Geopolitics", "/topics/geopolitics")] },
      { title: "Infrastructure", links: [L("Chips", "/topics/chips"), L("Data centers", "/topics/data-centers"), L("Energy", "/topics/energy")] },
      { title: "Impacts", links: [L("Adoption & use", "/topics/adoption-and-use"), L("Economic impact", "/topics/economic-impact"), L("Future of AI", "/topics/future-of-ai"), L("All topics", "/topics")] },
    ],
  },
  {
    label: "About", cols: 2,
    intro: { title: "About Epoch AI", text: "An independent nonprofit helping the world understand AI from a neutral, evidence-based perspective.", href: "/about", cta: "Our mission" },
    groups: [
      { title: "Who we are", links: [L("About us", "/about"), L("Our team", "/about/team"), L("Transparency", "/about/transparency")] },
      { title: "Engage with us", links: [L("Careers", "/about/careers"), L("Work with our experts", "/about/consultations"), L("Donate", "/about/donate"), L("Press", "/about/press")] },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const FOOTER = [
  { title: "Our work", links: [L("Latest", "/latest"), L("Trends in AI", "/trends"), L("Data Insights", "/data-insights"), L("Topics", "/topics"), L("Newsletter: Gradient Updates", "/gradient-updates"), L("Podcast", "/epoch-after-hours")] },
  { title: "Data on AI", links: [L("All data", "/data"), L("Models", "/data/ai-models"), L("AI data centers", "/data/ai-data-centers"), L("Hardware", "/data/machine-learning-hardware"), L("Companies", "/data/ai-companies"), L("Chip sales", "/data/ai-chip-sales")] },
  { title: "Benchmarking", links: [L("Capabilities & benchmarking", "/benchmarks"), L("FrontierMath", "/frontiermath"), L("Epoch Capabilities Index", "/eci")] },
  { title: "Company", links: [L("About", "/about"), L("Team", "/about/team"), L("Consultations", "/about/consultations"), L("Careers", "/about/careers"), L("Donate", "/about/donate"), L("Contact", "/contact")] },
];

export const LEGAL = [L("Privacy policy", "/privacy"), L("Cookie policy", "/cookies")];
export const SOCIAL = ["X", "Substack", "Bluesky", "GitHub", "LinkedIn"];

export const LINKS = {
  trends: "/trends",
  latest: "/latest",
  insights: "/data-insights",
  data: "/data",
  consult: "/about/consultations",
  endorsements: "/about",
  subscribe: "https://epochai.substack.com/subscribe",
};

/** Flat list of every destination, used by the search palette. */
export const SEARCH_INDEX = (() => {
  const seen = new Set();
  const out = [];
  const add = (label, href, group) => {
    if (seen.has(href) || href.startsWith("#")) return;
    seen.add(href);
    out.push({ label, href, group });
  };
  [["Home", "/"], ["Latest work", "/latest"], ["Trends in AI", "/trends"], ["Data on AI", "/data"], ["Data Insights", "/data-insights"], ["Benchmarks", "/benchmarks"], ["Topics", "/topics"], ["About", "/about"], ["Team", "/about/team"], ["Consultations", "/about/consultations"], ["Careers", "/about/careers"], ["Donate", "/about/donate"], ["Contact", "/contact"]]
    .forEach(([l, h]) => add(l, h, "Pages"));
  NAV.forEach((item) => item.groups?.forEach((g) => g.links.forEach((l) => add(l.label, l.href, g.title))));
  FOOTER.forEach((col) => col.links.forEach((l) => add(l.label, l.href, col.title)));
  return out;
})();
