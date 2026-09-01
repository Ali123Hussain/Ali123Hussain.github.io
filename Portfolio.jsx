import { useState, useEffect, useRef, useMemo } from "react";
import {
  ArrowUpRight, Download, Linkedin, Mail, Phone, Github, Sun, Moon,
  Database, Code2, BarChart3, BrainCircuit, Landmark, Wrench,
  GraduationCap, Award, Copy, Check, MapPin, X
} from "lucide-react";

/* ------------------------------------------------------------------
   THEME + GLOBAL CSS
   All colour lives in CSS variables so the dark-mode toggle is a
   single attribute flip on the root element.
-------------------------------------------------------------------*/
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

.ay-root{
  --bg:#FBFAF7; --bg-2:#F3F1EB; --surface:#FFFFFF;
  --text:#0A1020; --muted:#606B80; --line:#E3DFD5;
  --accent:#A8701A; --accent-soft:rgba(168,112,26,.10);
  --teal:#0E8C7E; --shadow:0 1px 2px rgba(10,16,32,.04), 0 12px 32px -12px rgba(10,16,32,.14);
  --grid:rgba(10,16,32,.05);
}
.ay-root[data-theme="dark"]{
  --bg:#070B14; --bg-2:#0A1020; --surface:#0D1424;
  --text:#ECEFF5; --muted:#8994A8; --line:#1A2337;
  --accent:#E7AC55; --accent-soft:rgba(231,172,85,.12);
  --teal:#3ED8C4; --shadow:0 1px 2px rgba(0,0,0,.4), 0 18px 40px -18px rgba(0,0,0,.7);
  --grid:rgba(255,255,255,.045);
}

.ay-root{
  background:var(--bg); color:var(--text);
  font-family:'Manrope',ui-sans-serif,sans-serif;
  -webkit-font-smoothing:antialiased;
  transition:background .5s ease, color .5s ease;
  overflow-x:hidden;
}
.ay-root *{ box-sizing:border-box; }
.display{ font-family:'Sora',ui-sans-serif,sans-serif; font-weight:600; letter-spacing:-.035em; }
.mono{ font-family:'JetBrains Mono',ui-monospace,monospace; }

/* --- section chrome --- */
.eyebrow{
  font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.18em;
  text-transform:uppercase; color:var(--muted); display:flex; align-items:center; gap:12px;
}
.eyebrow::after{ content:""; height:1px; flex:1; background:var(--line); }
.eyebrow b{ color:var(--accent); font-weight:500; }

.rule{ height:1px; background:var(--line); }

/* --- reveal on scroll --- */
.reveal{ opacity:0; transform:translateY(22px); transition:opacity .8s cubic-bezier(.2,.7,.3,1), transform .8s cubic-bezier(.2,.7,.3,1); }
.reveal.in{ opacity:1; transform:none; }

/* --- surfaces --- */
.card{
  background:var(--surface); border:1px solid var(--line); border-radius:14px;
  transition:transform .45s cubic-bezier(.2,.7,.3,1), border-color .35s, box-shadow .45s;
  position:relative; overflow:hidden;
}
.card:hover{ transform:translateY(-4px); box-shadow:var(--shadow); }
.card::after{
  content:""; position:absolute; inset:0; pointer-events:none; opacity:0;
  background:radial-gradient(420px circle at var(--mx,50%) var(--my,0%), var(--accent-soft), transparent 65%);
  transition:opacity .4s;
}
.card:hover::after{ opacity:1; }

/* --- border trace: a line draws itself around the outline on hover --- */
.trace{ position:absolute; left:0; top:0; overflow:visible; pointer-events:none; z-index:2; }
.trace rect{
  fill:none; stroke:var(--accent);
  stroke-dasharray:100; stroke-dashoffset:100;
  transition:stroke-dashoffset .6s cubic-bezier(.4,0,.2,1);
}
.btn:hover .trace rect, .card:hover .trace rect{ stroke-dashoffset:0; }

/* --- buttons --- */
.btn{
  position:relative;
  display:inline-flex; align-items:center; gap:9px; padding:12px 20px; border-radius:999px;
  font-size:14px; font-weight:600; cursor:pointer; border:1px solid var(--line);
  background:transparent; color:var(--text); transition:all .3s cubic-bezier(.2,.7,.3,1);
  text-decoration:none;
}
.btn:hover{ color:var(--accent); transform:translateY(-2px); }
.btn-solid{ background:var(--text); color:var(--bg); border-color:var(--text); }
.btn-solid:hover{ background:var(--accent); border-color:var(--accent); color:#fff; }

.chip{
  font-family:'JetBrains Mono',monospace; font-size:11px; padding:5px 10px; border-radius:6px;
  border:1px solid var(--line); color:var(--muted); background:var(--bg-2); white-space:nowrap;
}
.chip-accent{ color:var(--accent); border-color:var(--accent); background:var(--accent-soft); }

/* --- hero atmosphere --- */
.hero-grid{
  position:absolute; inset:0;
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);
  background-size:64px 64px;
  mask-image:radial-gradient(ellipse 80% 60% at 60% 35%,#000 20%,transparent 78%);
  -webkit-mask-image:radial-gradient(ellipse 80% 60% at 60% 35%,#000 20%,transparent 78%);
}
.glow{
  position:absolute; border-radius:50%; filter:blur(90px); opacity:.5; pointer-events:none;
  animation:drift 18s ease-in-out infinite alternate;
}
@keyframes drift{ from{ transform:translate3d(0,0,0) scale(1);} to{ transform:translate3d(30px,-26px,0) scale(1.12);} }

/* --- data-viz animations --- */
@keyframes dash{ to{ stroke-dashoffset:0; } }
@keyframes pulse{ 0%,100%{ r:3.2; opacity:.85 } 50%{ r:5.4; opacity:.35 } }
@keyframes flow{ to{ stroke-dashoffset:-120; } }
@keyframes rise{ from{ transform:scaleY(0);} to{ transform:scaleY(1);} }
.node{ animation:pulse 3.6s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.edge{ stroke-dasharray:4 6; animation:flow 3s linear infinite; }
.spark{ stroke-dasharray:1400; stroke-dashoffset:1400; animation:dash 3.2s ease-out .3s forwards; }
.bar{ transform-origin:bottom; animation:rise .9s cubic-bezier(.2,.8,.3,1) both; }

/* --- staggered hero entrance --- */
@keyframes up{ from{ opacity:0; transform:translateY(26px);} to{ opacity:1; transform:none;} }
.enter{ opacity:0; animation:up .9s cubic-bezier(.2,.7,.3,1) both; }

/* --- heatmap --- */
.hm{ width:10px; height:10px; border-radius:2px; transition:transform .2s; }
.hm:hover{ transform:scale(1.5); }

/* --- timeline --- */
.tl{ position:relative; padding-left:28px; }
.tl::before{ content:""; position:absolute; left:5px; top:6px; bottom:6px; width:1px; background:var(--line); }
.tl-dot{ position:absolute; left:0; top:6px; width:11px; height:11px; border-radius:50%; background:var(--bg); border:2px solid var(--accent); }

/* --- input --- */
.field{
  width:100%; background:var(--bg-2); border:1px solid var(--line); border-radius:10px;
  padding:13px 15px; color:var(--text); font-family:'Manrope',sans-serif; font-size:14px;
  outline:none; transition:border-color .3s, background .3s;
}
.field:focus{ border-color:var(--accent); background:var(--surface); }
.field::placeholder{ color:var(--muted); }

/* --- nav --- */
.nav{ position:sticky; top:0; z-index:50; backdrop-filter:blur(14px); background:color-mix(in srgb,var(--bg) 82%, transparent); border-bottom:1px solid transparent; transition:border-color .3s; }
.nav.stuck{ border-color:var(--line); }
.navlink{ font-size:13px; color:var(--muted); text-decoration:none; transition:color .25s; position:relative; }
.navlink:hover{ color:var(--text); }
.navlink::after{ content:""; position:absolute; left:0; right:100%; bottom:-4px; height:1px; background:var(--accent); transition:right .3s cubic-bezier(.2,.7,.3,1); }
.navlink:hover::after{ right:0; }

@media (max-width:640px){ .hero-grid{ background-size:40px 40px; } }
`;

/* ------------------------------------------------------------------
   HOOKS
-------------------------------------------------------------------*/

// Adds .in when the element scrolls into view (our Framer-Motion stand-in)
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (el.classList.add("in"), io.unobserve(el)),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

// Counts 0 -> target once visible
function useCountUp(target, duration = 1600) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.unobserve(el);
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return [ref, val];
}

/* ------------------------------------------------------------------
   SMALL PIECES
-------------------------------------------------------------------*/
function Section({ id, num, label, children, className = "" }) {
  const ref = useReveal();
  return (
    <section id={id} className={`px-6 md:px-10 py-20 md:py-28 ${className}`}>
      <div ref={ref} className="reveal max-w-6xl mx-auto">
        <div className="eyebrow mb-10"><b>{num}</b> {label}</div>
        {children}
      </div>
    </section>
  );
}

function Spotlight({ children, className = "", ...rest }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div className={`card ${className}`} onMouseMove={onMove} {...rest}>
      {children}
      <Trace rx={14} w={3} />
    </div>
  );
}

/* Draws a line around an element's outline on hover.
   pathLength="100" normalises the perimeter to 100 units, so the trace
   takes the same time on a small button and on a large card. */
function Trace({ rx = 14, w = 1.5 }) {
  return (
    <svg className="trace" width="100%" height="100%" aria-hidden="true">
      <rect x="0" y="0" width="100%" height="100%" rx={rx} pathLength="100" style={{ strokeWidth: w }} />
    </svg>
  );
}

/* Animated hero visual: node graph + sparkline + bars, pure SVG */
function DataViz() {
  const nodes = [
    [60, 120], [140, 60], [150, 190], [230, 110], [255, 220],
    [330, 60], [340, 165], [415, 120], [420, 225], [200, 265],
  ];
  const edges = [[0,1],[0,2],[1,3],[2,3],[3,5],[3,6],[2,9],[6,7],[6,8],[5,7],[4,6],[2,4],[9,4]];
  const spark = "M20,320 L60,300 L100,308 L140,272 L180,286 L220,240 L260,252 L300,206 L340,220 L380,168 L420,182 L460,124";
  const bars = [34, 52, 44, 70, 58, 86, 76, 104];

  return (
    <svg viewBox="0 0 500 400" className="w-full h-auto" aria-hidden="true">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
      </defs>

      {edges.map(([a, b], i) => (
        <line key={i} className="edge"
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="var(--accent)" strokeWidth="1" opacity=".38"
          style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} className="node" cx={x} cy={y} r="3.2" fill="var(--accent)"
          style={{ animationDelay: `${i * 0.32}s` }} />
      ))}

      {bars.map((h, i) => (
        <rect key={i} className="bar" x={20 + i * 58} y={400 - h} width="26" height={h}
          rx="3" fill="var(--teal)" opacity=".16"
          style={{ animationDelay: `${0.5 + i * 0.09}s` }} />
      ))}

      <path className="spark" d={spark} fill="none" stroke="url(#sg)"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* GitHub-style contribution grid, deterministic so it never re-shuffles */
function Heatmap() {
  const weeks = 52, days = 7;
  const cells = useMemo(() => {
    const seeded = (n) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
    return Array.from({ length: weeks }, (_, w) =>
      Array.from({ length: days }, (_, d) => {
        const r = seeded(w * 7 + d);
        const season = 0.45 + 0.55 * Math.sin((w / weeks) * Math.PI * 1.4);
        const v = r * season;
        return v > 0.62 ? 4 : v > 0.46 ? 3 : v > 0.32 ? 2 : v > 0.18 ? 1 : 0;
      })
    );
  }, []);
  const alpha = [0.06, 0.28, 0.5, 0.72, 1];
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex gap-1" style={{ minWidth: 700 }}>
        {cells.map((col, w) => (
          <div key={w} className="flex flex-col gap-1">
            {col.map((lvl, d) => (
              <div key={d} className="hm"
                title={`${lvl} contributions`}
                style={{
                  background: lvl === 0 ? "var(--bg-2)" : "var(--accent)",
                  opacity: lvl === 0 ? 1 : alpha[lvl],
                  border: lvl === 0 ? "1px solid var(--line)" : "none",
                }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   DATA
-------------------------------------------------------------------*/
const SKILLS = [
  { icon: Database, title: "Data Analytics", items: ["Data Cleaning", "Exploratory Data Analysis", "Business Analytics", "Customer Behavior Analysis"] },
  { icon: Code2, title: "Programming", items: ["Python", "SQL", "Pandas", "NumPy"] },
  { icon: BarChart3, title: "Visualization", items: ["Power BI", "Excel Dashboards", "Data Storytelling"] },
  { icon: BrainCircuit, title: "Machine Learning", items: ["Classification", "Regression", "Predictive Analytics", "XGBoost"] },
  { icon: Landmark, title: "Business & FinTech", items: ["Digital Transformation", "FinTech Applications", "E-commerce Analytics"] },
  { icon: Wrench, title: "Tools", items: ["Git / GitHub", "AI Tools", "Canva", "CapCut"] },
];

const PROJECTS = [
  {
    id: "income",
    tag: "Capstone",
    title: "Adult Income Prediction",
    blurb: "A classification model predicting whether an individual earns above or below $50K from the Adult Census dataset.",
    detail: "Compared Logistic Regression, Decision Tree, Random Forest and XGBoost across the full pipeline — cleaning, encoding, class-imbalance handling and threshold tuning. XGBoost was selected as the final model on F1 and ROC-AUC.",
    tech: ["Python", "Machine Learning", "XGBoost", "Pandas"],
    metrics: [{ k: "F1 Score", v: "0.72" }, { k: "ROC-AUC", v: "0.92" }],
    year: "2026",
  },
  {
    id: "customer",
    tag: "Analytics",
    title: "Customer Analytics Project",
    blurb: "Analysis of customer and business datasets to surface behavioural trends and support better commercial decisions.",
    detail: "Built the full analytical path from raw data to recommendation: data preparation, segmentation, trend analysis and a visual report written for a non-technical audience.",
    tech: ["Python", "SQL", "Excel", "Data Visualization"],
    metrics: [{ k: "Focus", v: "Segmentation" }, { k: "Output", v: "Insight report" }],
    year: "2026",
  },
  {
    id: "tameenak",
    tag: "InsurTech",
    title: "Ta'meenak — Insurance Aggregator",
    blurb: "University InsurTech concept developed for an insurance aggregator application, led on market research.",
    detail: "Led market research for a concept proposed to the National Bank of Bahrain. Defined the target segments, designed the proposed feature set and built a pricing structure grounded in customer needs and competitor analysis.",
    tech: ["Market Research", "Product Strategy", "Pricing"],
    metrics: [{ k: "Role", v: "Research lead" }, { k: "Partner", v: "NBB concept" }],
    year: "2025",
  },
  {
    id: "salla",
    tag: "E-commerce",
    title: "Salla Online Store",
    blurb: "A digital-products store selling software subscriptions, run end to end from pricing to performance tracking.",
    detail: "Owned product research, pricing analysis and marketing campaigns. Sales handled through WhatsApp and Instagram, with business performance tracked and analysed in Excel and creative produced in Canva and CapCut.",
    tech: ["Pricing Analysis", "Meta Ads", "Excel", "Salla"],
    metrics: [{ k: "Model", v: "Digital goods" }, { k: "Channels", v: "IG + WhatsApp" }],
    year: "2025",
  },
];

const EXPERIENCE = [
  { role: "Data Science Bootcamp Fellow", org: "General Assembly — Bahrain", date: "Jun 2026 – Sep 2026",
    points: ["Completed three end-to-end projects covering analytics, predictive modelling and a machine-learning capstone.", "Worked across the full workflow: collection, cleaning, EDA, modelling and communication of results."] },
  { role: "Sales & Customer Service Specialist", org: "Bahrain", date: "2026 – Present",
    points: ["Manage daily customer interactions across Instagram, WhatsApp and other digital channels.", "Process orders, prepare shipping details and coordinate with delivery partners.", "Analyse customer inquiries and feedback to improve service quality."] },
  { role: "E-commerce Projects", org: "Khotwah · Movie Products · Home Essentials", date: "2021 – 2025",
    points: ["Launched a digital e-book store, researching profitable niches and testing pricing strategies.", "Built a niche merchandise store on Instagram with self-produced content.", "Ran a Shopify dropshipping store covering product research and basic ad campaigns."] },
  { role: "Sales Assistant", org: "Family Ceramics Business", date: "2020 – 2021",
    points: ["Supported daily sales operations and customer communication.", "Developed negotiation and communication skills through direct customer contact."] },
];

const CERTS = [
  "Psychology of Design & Color",
  "Smart Targeting",
  "Strategic Marketing Planning",
  "Content Marketing (Instagram)",
  "Profitable Pricing",
];

const EMAIL = "Alihussainctc@gmail.com";
const LINKEDIN = "https://www.linkedin.com/";

/* ------------------------------------------------------------------
   APP
-------------------------------------------------------------------*/
export default function Portfolio() {
  const [theme, setTheme] = useState("dark");
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyEmail = () => {
    const ta = document.createElement("textarea");
    ta.value = EMAIL; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) { /* clipboard blocked */ }
    document.body.removeChild(ta);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const sendMail = () => {
    const subject = encodeURIComponent(`Portfolio enquiry — ${form.name || "Hello"}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  const stats = [
    { n: 8, suffix: "+", label: "Projects completed" },
    { n: 12, suffix: "", label: "Technologies used" },
    { n: 5, suffix: "+", label: "Years building businesses" },
  ];

  const nav = [
    ["About", "about"], ["Skills", "skills"], ["Projects", "projects"],
    ["Experience", "experience"], ["Contact", "contact"],
  ];

  return (
    <div className="ay-root" data-theme={theme} style={{ minHeight: "100vh" }}>
      <style>{CSS}</style>

      {/* ============ NAV ============ */}
      <header className={`nav ${stuck ? "stuck" : ""}`}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5" style={{ textDecoration: "none", color: "var(--text)" }}>
            <span className="mono text-sm font-semibold" style={{ color: "var(--accent)" }}>AY</span>
            <span className="text-sm font-semibold tracking-tight">Ali Hussain Yousif</span>
          </a>
          <nav className="hidden md:flex items-center gap-7">
            {nav.map(([l, h]) => <a key={h} className="navlink" href={`#${h}`}>{l}</a>)}
          </nav>
          <button
            onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
            aria-label="Toggle colour theme"
            className="btn" style={{ padding: "9px 12px" }}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            <Trace rx={999} />
          </button>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section id="top" className="relative px-6 md:px-10 pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="hero-grid" />
        <div className="glow" style={{ width: 460, height: 460, top: -110, right: -60, background: "var(--accent)", opacity: .22 }} />
        <div className="glow" style={{ width: 380, height: 380, top: 220, left: -140, background: "var(--teal)", opacity: .14, animationDelay: "3s" }} />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="enter mono text-xs flex items-center gap-2 mb-7" style={{ color: "var(--muted)", animationDelay: ".05s" }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--teal)", display: "inline-block" }} />
              OPEN TO INTERNSHIPS &amp; ENTRY-LEVEL ROLES
            </div>

            <h1 className="enter display" style={{ fontSize: "clamp(2.6rem,7.6vw,5.1rem)", lineHeight: 1.02, letterSpacing: "-.045em", animationDelay: ".15s" }}>
              Ali Hussain<br />
              <span style={{ color: "var(--accent)" }}>Yousif</span>
            </h1>

            <p className="enter mono mt-6 text-xs md:text-sm" style={{ color: "var(--muted)", letterSpacing: ".06em", animationDelay: ".25s" }}>
              DATA ANALYST &nbsp;/&nbsp; FINTECH STUDENT &nbsp;/&nbsp; DATA SCIENCE ENTHUSIAST
            </p>

            <p className="enter mt-7 text-base md:text-lg max-w-xl" style={{ color: "var(--muted)", lineHeight: 1.75, animationDelay: ".35s" }}>
              A FinTech student passionate about using data, artificial intelligence and
              technology to create data-driven solutions and solve real-world business challenges.
            </p>

            <div className="enter flex flex-wrap gap-3 mt-9" style={{ animationDelay: ".45s" }}>
              <a href="#projects" className="btn btn-solid">View Projects <ArrowUpRight size={16} /></a>
              {/* Place your PDF in /public and this link works as-is */}
              <a href="/Ali_Hussain_Yousif_CV.pdf" download className="btn"><Download size={16} /> Download CV<Trace rx={999} /></a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="btn"><Linkedin size={16} /> LinkedIn<Trace rx={999} /></a>
            </div>

            <div className="enter flex items-center gap-5 mt-9 text-xs mono" style={{ color: "var(--muted)", animationDelay: ".55s" }}>
              <span className="flex items-center gap-1.5"><MapPin size={13} /> Bahrain</span>
              <span className="flex items-center gap-1.5"><Mail size={13} /> {EMAIL}</span>
            </div>
          </div>

          <div className="lg:col-span-5 enter" style={{ animationDelay: ".3s" }}>
            <DataViz />
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <div className="px-6 md:px-10 pb-4">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4">
          {stats.map((s) => <Stat key={s.label} {...s} />)}
        </div>
      </div>

      {/* ============ ABOUT ============ */}
      <Section id="about" num="01" label="About">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h2 className="display" style={{ fontSize: "clamp(1.65rem,3.4vw,2.5rem)", lineHeight: 1.15 }}>
              Finance, technology and analytics —<br />
              <span style={{ color: "var(--muted)" }}>treated as one discipline.</span>
            </h2>
            <div className="mt-7 space-y-5 text-base" style={{ color: "var(--muted)", lineHeight: 1.8 }}>
              <p>
                I'm a Financial Technology student at Bahrain Polytechnic, drawn to the point where
                finance, technology and analytics meet. Most of what I know came from building things
                that had to actually work — stores with real customers, models with real error, projects
                with real deadlines.
              </p>
              <p>
                My day-to-day sits in data analysis, visualization, machine-learning fundamentals and
                digital transformation projects. Alongside my degree I completed a Data Science bootcamp
                at General Assembly, where I built three end-to-end projects including a classification
                capstone on the Adult Census dataset.
              </p>
              <p>
                Before that, five years of e-commerce taught me the commercial half of the job: pricing,
                customer behaviour, campaign performance and the difference between a number and a decision.
                That's the perspective I bring to an analytics team.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Spotlight className="p-7">
              <div className="eyebrow mb-6" style={{ fontSize: 10 }}><b>Focus</b></div>
              {[
                ["Analytics", "Turning messy business data into decisions"],
                ["FinTech", "Digital transformation and financial applications"],
                ["Machine Learning", "Classification, regression, predictive analytics"],
                ["Commercial", "Pricing, customer behaviour, campaign performance"],
              ].map(([k, v], i) => (
                <div key={k} className="py-4" style={{ borderTop: i ? "1px solid var(--line)" : "none" }}>
                  <div className="text-sm font-semibold">{k}</div>
                  <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>{v}</div>
                </div>
              ))}
              <div className="pt-5 mt-1 flex flex-wrap gap-2" style={{ borderTop: "1px solid var(--line)" }}>
                <span className="chip">Arabic — Native</span>
                <span className="chip">English — Professional</span>
              </div>
            </Spotlight>
          </div>
        </div>
      </Section>

      {/* ============ SKILLS ============ */}
      <Section id="skills" num="02" label="Skills">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILLS.map(({ icon: Icon, title, items }) => (
            <Spotlight key={title} className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center"
                  style={{ width: 34, height: 34, borderRadius: 9, background: "var(--accent-soft)", color: "var(--accent)" }}>
                  <Icon size={17} />
                </div>
                <h3 className="text-[15px] font-bold tracking-tight">{title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((it) => <span key={it} className="chip">{it}</span>)}
              </div>
            </Spotlight>
          ))}
        </div>
      </Section>

      {/* ============ PROJECTS ============ */}
      <Section id="projects" num="03" label="Selected Projects">
        <div className="grid md:grid-cols-2 gap-4">
          {PROJECTS.map((p) => (
            <Spotlight key={p.id} className="p-7 flex flex-col cursor-pointer"
              onClick={() => setOpen(p)}>
              <div className="flex items-start justify-between gap-4">
                <span className="chip chip-accent">{p.tag}</span>
                <span className="mono text-xs" style={{ color: "var(--muted)" }}>{p.year}</span>
              </div>

              <h3 className="display mt-5" style={{ fontSize: "1.45rem", lineHeight: 1.15 }}>{p.title}</h3>
              <p className="mt-3 text-sm flex-1" style={{ color: "var(--muted)", lineHeight: 1.7 }}>{p.blurb}</p>

              <div className="flex gap-8 mt-6 mb-6">
                {p.metrics.map((m) => (
                  <div key={m.k}>
                    <div className="mono text-lg font-semibold" style={{ color: "var(--accent)" }}>{m.v}</div>
                    <div className="mono text-[10px] mt-1" style={{ color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase" }}>{m.k}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 pt-5" style={{ borderTop: "1px solid var(--line)" }}>
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 3).map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
                <ArrowUpRight size={17} style={{ color: "var(--accent)", flexShrink: 0 }} />
              </div>
            </Spotlight>
          ))}
        </div>

        {/* activity strip */}
        <div className="mt-14">
          <div className="flex items-baseline justify-between mb-5 flex-wrap gap-2">
            <h3 className="text-sm font-bold tracking-tight">Learning activity</h3>
            <span className="mono text-xs" style={{ color: "var(--muted)" }}>Last 12 months</span>
          </div>
          <Spotlight className="p-6">
            <Heatmap />
            <div className="flex items-center gap-2 mt-5 mono text-[10px]" style={{ color: "var(--muted)" }}>
              Less
              {[0, 1, 2, 3, 4].map((l) => (
                <span key={l} className="hm" style={{
                  background: l === 0 ? "var(--bg-2)" : "var(--accent)",
                  opacity: l === 0 ? 1 : [0, .28, .5, .72, 1][l],
                  border: l === 0 ? "1px solid var(--line)" : "none",
                }} />
              ))}
              More
            </div>
          </Spotlight>
        </div>
      </Section>

      {/* ============ EXPERIENCE ============ */}
      <Section id="experience" num="04" label="Experience">
        <div className="tl space-y-10">
          {EXPERIENCE.map((e) => (
            <div key={e.role} className="relative">
              <span className="tl-dot" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold tracking-tight">{e.role}</h3>
                <span className="mono text-xs" style={{ color: "var(--accent)" }}>{e.date}</span>
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>{e.org}</div>
              <ul className="mt-4 space-y-2">
                {e.points.map((pt) => (
                  <li key={pt} className="text-sm flex gap-3" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0 }}>—</span>{pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ============ EDUCATION + CERTS ============ */}
      <Section id="education" num="05" label="Education & Certifications">
        <div className="grid lg:grid-cols-2 gap-4">
          <Spotlight className="p-7">
            <div className="flex items-center gap-2.5 mb-6" style={{ color: "var(--accent)" }}>
              <GraduationCap size={18} />
              <span className="mono text-[11px]" style={{ letterSpacing: ".14em" }}>EDUCATION</span>
            </div>
            {[
              ["BSc in Financial Technology", "Bahrain Polytechnic", "Expected 2027"],
              ["Data Science Bootcamp Program", "General Assembly — Bahrain", "Completed"],
            ].map(([d, s, y], i) => (
              <div key={d} className="py-5" style={{ borderTop: i ? "1px solid var(--line)" : "none" }}>
                <div className="font-semibold text-[15px]">{d}</div>
                <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>{s}</div>
                <div className="mono text-xs mt-2" style={{ color: "var(--accent)" }}>{y}</div>
              </div>
            ))}
          </Spotlight>

          <Spotlight className="p-7">
            <div className="flex items-center gap-2.5 mb-6" style={{ color: "var(--accent)" }}>
              <Award size={18} />
              <span className="mono text-[11px]" style={{ letterSpacing: ".14em" }}>CERTIFICATIONS</span>
            </div>
            {CERTS.map((c, i) => (
              <div key={c} className="flex items-center justify-between gap-4 py-4"
                style={{ borderTop: i ? "1px solid var(--line)" : "none" }}>
                <div>
                  <div className="font-semibold text-[14px]">{c}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Tenmeya — Kuwait</div>
                </div>
                <span className="mono text-[11px] flex-shrink-0" style={{ color: "var(--muted)" }}>2024</span>
              </div>
            ))}
          </Spotlight>
        </div>
      </Section>

      {/* ============ CONTACT ============ */}
      <Section id="contact" num="06" label="Contact">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <h2 className="display" style={{ fontSize: "clamp(1.75rem,3.8vw,2.8rem)", lineHeight: 1.1 }}>
              Let's build something<br />with the data.
            </h2>
            <p className="mt-5 text-base" style={{ color: "var(--muted)", lineHeight: 1.75 }}>
              Open to internships and entry-level roles in data analytics, FinTech,
              business intelligence and data science.
            </p>

            <div className="mt-8 space-y-3">
              <button onClick={copyEmail} className="btn w-full" style={{ justifyContent: "space-between" }}>
                <span className="flex items-center gap-2.5"><Mail size={16} /> {EMAIL}</span>
                {copied ? <Check size={15} style={{ color: "var(--teal)" }} /> : <Copy size={15} />}
                <Trace rx={999} />
              </button>
              <a href="tel:+97337323193" className="btn w-full" style={{ justifyContent: "flex-start" }}>
                <Phone size={16} /> +973 3732 3193
                <Trace rx={999} />
              </a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="btn w-full" style={{ justifyContent: "flex-start" }}>
                <Linkedin size={16} /> LinkedIn
                <Trace rx={999} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* div-based, not <form> — submits via mailto */}
            <Spotlight className="p-7">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="mono text-[10px] block mb-2" style={{ color: "var(--muted)", letterSpacing: ".12em" }}>NAME</label>
                  <input className="field" placeholder="Your name" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="mono text-[10px] block mb-2" style={{ color: "var(--muted)", letterSpacing: ".12em" }}>EMAIL</label>
                  <input className="field" type="email" placeholder="you@company.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="mt-4">
                <label className="mono text-[10px] block mb-2" style={{ color: "var(--muted)", letterSpacing: ".12em" }}>MESSAGE</label>
                <textarea className="field" rows={5} placeholder="What would you like to work on?" value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button onClick={sendMail} className="btn btn-solid mt-5">
                Send message <ArrowUpRight size={16} />
              </button>
            </Spotlight>
          </div>
        </div>
      </Section>

      {/* ============ FOOTER ============ */}
      <footer className="px-6 md:px-10 py-10" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="mono text-xs" style={{ color: "var(--muted)" }}>
            © {new Date().getFullYear()} Ali Hussain Yousif
          </span>
          <div className="flex items-center gap-5">
            <a href={LINKEDIN} target="_blank" rel="noreferrer" style={{ color: "var(--muted)" }}><Linkedin size={16} /></a>
            <a href="#" style={{ color: "var(--muted)" }}><Github size={16} /></a>
            <a href={`mailto:${EMAIL}`} style={{ color: "var(--muted)" }}><Mail size={16} /></a>
          </div>
        </div>
      </footer>

      {/* ============ PROJECT MODAL ============ */}
      {open && (
        <div onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: "rgba(4,7,14,.7)", backdropFilter: "blur(6px)" }}>
          <div onClick={(e) => e.stopPropagation()}
            className="card p-8 w-full enter"
            style={{ maxWidth: 620, maxHeight: "86vh", overflowY: "auto", animationDelay: "0s" }}>
            <div className="flex items-start justify-between gap-4">
              <span className="chip chip-accent">{open.tag}</span>
              <button onClick={() => setOpen(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                <X size={19} />
              </button>
            </div>
            <h3 className="display mt-5" style={{ fontSize: "1.75rem", lineHeight: 1.1 }}>{open.title}</h3>
            <p className="mt-4 text-sm" style={{ color: "var(--muted)", lineHeight: 1.8 }}>{open.blurb}</p>
            <p className="mt-3 text-sm" style={{ color: "var(--muted)", lineHeight: 1.8 }}>{open.detail}</p>
            <div className="flex gap-10 mt-7">
              {open.metrics.map((m) => (
                <div key={m.k}>
                  <div className="mono text-2xl font-semibold" style={{ color: "var(--accent)" }}>{m.v}</div>
                  <div className="mono text-[10px] mt-1" style={{ color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase" }}>{m.k}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-7 pt-6" style={{ borderTop: "1px solid var(--line)" }}>
              {open.tech.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Stat card kept separate so each gets its own count-up observer */
function Stat({ n, suffix, label }) {
  const [ref, val] = useCountUp(n);
  return (
    <div ref={ref} className="card p-5 md:p-7 text-center">
      <div className="display" style={{ fontSize: "clamp(1.7rem,4.4vw,2.8rem)", lineHeight: 1, color: "var(--accent)" }}>
        {val}{suffix}
      </div>
      <div className="mono text-[10px] md:text-[11px] mt-3" style={{ color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
}
