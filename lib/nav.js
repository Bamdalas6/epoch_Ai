export const HOME = "/";

/**
 * Every link stays on this site. Paths that had different names on epoch.ai are mapped
 * to the matching page here; anything not listed is already a local route.
 */
const ALIAS = {
  "/publications": "/latest",
  "/eci": "/benchmarks/eci",
  "/frontiermath": "/benchmarks/frontiermath",
  "/frontiermath/open-problems": "/benchmarks/frontiermath-open-problems",
  "/MirrorCode": "/benchmarks/mirrorcode",
  "/gradient-updates": "/newsletter",
  "/epoch-after-hours": "/podcast",
  "/privacy": "/legal/privacy",
  "/cookies": "/legal/cookies",
  "/data/benchmarks": "/benchmarks",
  "/data-insights/eci-frontier-trend": "/trends#model-performance",
  "/data-insights/ai-computing-capacity-additions-doubling": "/publications/new-global-ai-computing-capacity-is-doubling-every-9-months",
};

export const isExternal = (href) => /^https?:/.test(href);
export const u = (p) => {
  const bare = p.split(/[?#]/)[0] || "/";
  return ALIAS[bare] ?? p;
};
const L = (label, path) => ({ label, href: u(path) });

export const NAV = [
  { label: "Latest", href: "/latest" },
  {
    label: "Our work", cols: 3,
    intro: { title: "Research and data", text: "Reports, data insights and open databases on how fast AI is advancing.", href: "/latest", cta: "See the latest work" },
    groups: [
      { title: "Publications", links: [L("Trends in AI", "/trends"), L("Latest work", "/latest"), L("Data Insights", "/data-insights"), L("Newsletter", "/gradient-updates"), L("Podcast", "/epoch-after-hours")] },
      { title: "Data explorers", links: [L("All data on AI", "/data"), L("AI models", "/data/ai-models"), L("AI data centers", "/data/ai-data-centers"), L("AI chip sales", "/data/ai-chip-sales"), L("AI companies", "/data/ai-companies"), L("Polling on AI usage", "/data/polling")] },
      { title: "Benchmarks", links: [L("Benchmarking hub", "/benchmarks"), L("Epoch Capabilities Index", "/eci"), L("FrontierMath", "/frontiermath"), L("FrontierMath: Open Problems", "/frontiermath/open-problems"), L("MirrorCode", "/MirrorCode"), L("Epoch Automation Reports", "/benchmarks/epoch-automation-reports")] },
    ],
  },
  {
    label: "Topics", cols: 4,
    intro: { title: "Browse by topic", text: "Data, charts and analysis on each area of AI’s trajectory.", href: "/topics", cta: "All topics" },
    groups: [
      { title: "AI progress", links: [L("Scaling", "/topics/scaling"), L("Software progress", "/topics/software-progress"), L("Open models", "/topics/open-models"), L("Capabilities", "/topics/capabilities"), L("Math", "/topics/math")] },
      { title: "Industry", links: [L("Leading companies", "/topics/leading-companies"), L("Finances", "/topics/finances"), L("Geopolitics", "/topics/geopolitics")] },
      { title: "Infrastructure", links: [L("Chips", "/topics/chips"), L("Data centers", "/topics/data-centers"), L("Energy", "/topics/energy")] },
      { title: "Impacts", links: [L("Adoption & use", "/topics/adoption-and-use"), L("Economic impact", "/topics/economic-impact"), L("Future of AI", "/topics/future-of-ai"), L("AI impacts observatory", "/topics/ai-impacts")] },
    ],
  },
  {
    label: "About", cols: 2,
    intro: { title: "About Epoch AI", text: "An independent nonprofit helping the world understand AI from a neutral, evidence-based perspective.", href: "/about", cta: "Our mission" },
    groups: [
      { title: "Who we are", links: [L("About us", "/about"), L("Our team", "/about/team"), L("Transparency", "/about/transparency"), L("Press", "/about/press")] },
      { title: "Engage with us", links: [L("Careers", "/about/careers"), L("Work with our experts", "/about/consultations"), L("Donate", "/about/donate"), L("Contact", "/contact")] },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const FOOTER = [
  { title: "Our work", links: [L("Latest", "/latest"), L("Trends in AI", "/trends"), L("Data Insights", "/data-insights"), L("Topics", "/topics"), L("Newsletter: Gradient Updates", "/gradient-updates"), L("Podcast", "/epoch-after-hours")] },
  { title: "Data on AI", links: [L("All data", "/data"), L("Models", "/data/ai-models"), L("AI data centers", "/data/ai-data-centers"), L("Hardware", "/data/machine-learning-hardware"), L("Companies", "/data/ai-companies"), L("Chip sales", "/data/ai-chip-sales"), L("Polling", "/data/polling")] },
  { title: "Benchmarking", links: [L("Capabilities & benchmarking", "/benchmarks"), L("Epoch Capabilities Index", "/eci"), L("FrontierMath", "/frontiermath"), L("MirrorCode", "/MirrorCode")] },
  { title: "Company", links: [L("About", "/about"), L("Team", "/about/team"), L("Transparency", "/about/transparency"), L("Press", "/about/press"), L("Consultations", "/about/consultations"), L("Careers", "/about/careers"), L("Donate", "/about/donate"), L("Contact", "/contact")] },
];

export const LEGAL = [L("Privacy policy", "/privacy"), L("Cookie policy", "/cookies")];

/** Epoch AI's official social profiles (external platforms, not the epoch.ai website). */
export const SOCIAL = [
  ["X", "https://x.com/EpochAIResearch"],
  ["Substack", "https://substack.com/@epochai"],
  ["Bluesky", "https://bsky.app/profile/epochai.bsky.social"],
  ["GitHub", "https://github.com/epoch-research"],
  ["LinkedIn", "https://www.linkedin.com/company/epochai"],
];

export const LINKS = {
  trends: "/trends",
  latest: "/latest",
  insights: "/data-insights",
  data: "/data",
  consult: "/about/consultations",
  endorsements: "/about",
  subscribe: "/newsletter#subscribe",
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
  [["Home", "/"], ["Latest work", "/latest"], ["Trends in AI", "/trends"], ["Data on AI", "/data"], ["Data Insights", "/data-insights"],
    ["Benchmarks", "/benchmarks"], ["Topics", "/topics"], ["Newsletter", "/newsletter"], ["Podcast", "/podcast"], ["About", "/about"],
    ["Team", "/about/team"], ["Transparency", "/about/transparency"], ["Press", "/about/press"], ["Consultations", "/about/consultations"],
    ["Careers", "/about/careers"], ["Donate", "/about/donate"], ["Contact", "/contact"]]
    .forEach(([l, h]) => add(l, h, "Pages"));
  NAV.forEach((item) => item.groups?.forEach((g) => g.links.forEach((l) => add(l.label, l.href, g.title))));
  FOOTER.forEach((col) => col.links.forEach((l) => add(l.label, l.href, col.title)));
  LEGAL.forEach((l) => add(l.label, l.href, "Legal"));
  return out;
})();
