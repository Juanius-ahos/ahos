import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";

const services = [
  {
    n: "01",
    name: "Smart Contracts",
    tag: "Secure, audited, built to last.",
    desc: "Tokens, NFTs, DAOs, DeFi — designed, gas-optimised, and audited before a single wei moves. Your community trusts the code because we tested it like their money depends on it. It does.",
    chips: ["ERC-20", "ERC-721 / 1155", "DAO Governance", "DeFi Protocols", "Multi-sig"],
  },
  {
    n: "02",
    name: "Web3 Frontend & Dapps",
    tag: "Wallets and chains, wrapped in interfaces people actually enjoy.",
    desc: "MetaMask, WalletConnect, Coinbase, on-chain data, marketplace flows — all behind a Web2-quality interface. Real-time, responsive, and no page refresh to see your balance.",
    chips: ["Wallet Integration", "Dapp UIs", "Marketplaces", "Chain APIs", "Responsive"],
  },
  {
    n: "03",
    name: "NFT & Token Launches",
    tag: "Zero to mint — without the launch-day panic.",
    desc: "Minting platforms, staking dashboards, allowlists, reveals, marketplace listings. Whether it's a genesis drop or a token-gated community, we've shipped it before and we'll ship yours clean.",
    chips: ["Minting", "Staking", "Allowlists", "Reveals", "Listings"],
    popular: true,
  },
  {
    n: "04",
    name: "Creative & Media",
    tag: "Make your project impossible to scroll past.",
    desc: "Trailers, motion, art direction, and a brand system that holds from Discord to OpenSea. In Web3, attention is the whole game — we make sure you win it.",
    chips: ["Trailers", "2D / 3D", "Art Direction", "Brand System", "Social Packs"],
  },
  {
    n: "05",
    name: "Strategy & Advisory",
    tag: "Get the foundations right before you write a line of code.",
    desc: "Tokenomics, whitepaper structure, go-to-market, community, and a technical roadmap with real milestones — so you launch with clarity and momentum instead of vibes.",
    chips: ["Tokenomics", "Whitepaper", "GTM", "Community", "Roadmap"],
  },
];

export default function Web3() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <SEOHead
        title="Web3 & Blockchain — Contracts, Dapps & Launches"
        description="Audited smart contracts, dapps, NFT and token launches, DeFi interfaces, and blockchain strategy — designed and deployed by AHOS."
        path="/web3"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Web3", url: "/web3" }]} />

      <style>{css}</style>

      <motion.header
        className="ed ed-page-hero w3-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="w3-hero-grid">
          <div>
            <div className="ed-label">
              <span className="ed-label-n">02</span><span className="ed-label-line" /><span className="ed-label-text">Web3 & Blockchain</span>
            </div>
            <h1 className="ed-h1">Your chain.<br /><em>Our build.</em></h1>
            <p className="ed-lead">From contracts to creative — every layer of your Web3 project, under one roof. Audited where it counts, beautiful where it shows.</p>
          </div>
          <div className="w3-terminal" aria-hidden="true">
            <div className="w3-term-head">
              <span className="w3-term-dot" style={{ background: "#ff5f56" }} />
              <span className="w3-term-dot" style={{ background: "#ffbd2e" }} />
              <span className="w3-term-dot" style={{ background: "#27c93f" }} />
            </div>
            <div className="w3-term-body">
              <span className="w3-term-prompt">$ </span>deploy --network mainnet<br />
              <span className="w3-term-prompt">$ </span>verify 0x7a...b3e<br />
              <span className="w3-term-out">\u2713 Contract verified</span><br />
              <span className="w3-term-prompt">$ </span>npx ahos audit ./contracts<br />
              <span className="w3-term-out">\u2713 0 critical, 0 high, 2 low</span><br />
              <span className="w3-term-prompt">$ </span><span className="w3-term-blink">_</span>
            </div>
          </div>
        </div>
      </motion.header>

      <section className="w3-rows-wrap">
        {services.map((s) => (
          <section key={s.n} className="ed ed-sec">
            <div className="w3-row">
              <div className="w3-row-head">
                <span className="w3-n">{s.n}</span>
                <h2 className="w3-name">{s.name}{s.popular && <span className="w3-pop">Most requested</span>}</h2>
              </div>
              <div className="w3-row-body">
                <p className="w3-tag">{s.tag}</p>
                <p className="w3-desc">{s.desc}</p>
                <div className="w3-chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
              </div>
            </div>
          </section>
        ))}
      </section>

      <motion.section
        className="ed ed-sec w3-cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="ed-h2" style={{ textAlign: "center" }}>Ready to launch?</h2>
        <p className="ed-lead" style={{ textAlign: "center", margin: "18px auto 30px" }}>Book a free 30-minute call and we'll map your full build — contracts, frontend, art, and go-to-market.</p>
        <div style={{ display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/contact" className="ed-btn ed-btn-lg">Book a call<span>↗</span></Link>
          <Link href="/services" className="ed-link-arrow">See all services →</Link>
        </div>
      </motion.section>

      <Footer />
    </>
  );
}

const css = `
.w3-hero-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: clamp(32px, 5vw, 72px); align-items: start; }

.w3-terminal { background: #0d0d10; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; font-family: var(--font-mono); font-size: 13px; line-height: 1.8; }
.w3-term-head { display: flex; gap: 8px; padding: 12px 16px; background: var(--bg-3); border-bottom: 1px solid var(--border); }
.w3-term-dot { width: 12px; height: 12px; border-radius: 50%; }
.w3-term-body { padding: 16px 20px; color: var(--text-dim); }
.w3-term-prompt { color: #27c93f; }
.w3-term-out { color: var(--text-muted); }
.w3-term-blink { animation: w3-blink 1s step-end infinite; }
@keyframes w3-blink { 50% { opacity: 0; } }

.w3-rows-wrap { border-top: 1px solid var(--border-soft); }
.w3-row { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(24px, 5vw, 72px); padding: clamp(32px, 4vw, 52px) 4px; border-bottom: 1px solid var(--border-soft); transition: background 0.3s; }
.w3-row:hover { background: linear-gradient(90deg, var(--orange-soft), transparent 55%); }
.w3-row-head { display: flex; align-items: baseline; gap: 18px; }
.w3-n { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--orange); }
.w3-name { font-family: var(--font-display); font-size: clamp(26px, 3.4vw, 42px); font-weight: 600; line-height: 1.02; letter-spacing: -0.03em; }
.w3-pop { display: inline-block; margin-left: 12px; padding: 4px 11px; border-radius: 999px; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; vertical-align: middle; white-space: nowrap; }
.w3-tag { font-size: 16px; font-weight: 500; color: var(--orange); margin-bottom: 12px; }
.w3-desc { font-size: 15.5px; line-height: 1.75; color: var(--text-muted); margin-bottom: 20px; max-width: 60ch; }
.w3-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.w3-chips span { padding: 6px 13px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-muted); font-size: 12px; font-weight: 600; }

@media (max-width: 760px) {
  .w3-hero-grid { grid-template-columns: 1fr; }
  .w3-row { grid-template-columns: 1fr; gap: 16px; }
}
`;
