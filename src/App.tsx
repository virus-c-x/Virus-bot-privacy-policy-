import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  FileCode, 
  ShieldCheck, 
  Search, 
  ArrowLeft,
  ArrowUp,
  Info,
  Lock,
  FileText,
  EyeOff
} from 'lucide-react';
import { SECTIONS as TERMS_SECTIONS, RAW_TERMS_HTML } from './termsData';
import { PRIVACY_SECTIONS, RAW_PRIVACY_HTML } from './privacyData';

type ActiveDocument = 'privacy' | 'terms';

export default function App() {
  const [activeDoc, setActiveDoc] = useState<ActiveDocument>('privacy');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotification, setShowNotification] = useState(true);

  const activeRawHtml = activeDoc === 'privacy' ? RAW_PRIVACY_HTML : RAW_TERMS_HTML;
  const activeFileName = activeDoc === 'privacy' ? 'privacy.html' : 'terms.html';
  const activeFileHref = activeDoc === 'privacy' ? '/privacy.html' : '/terms.html';

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(activeRawHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy HTML: ', err);
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([activeRawHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentSections = activeDoc === 'privacy' ? PRIVACY_SECTIONS : TERMS_SECTIONS;
  const filteredSections = currentSections.filter(sec => 
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.num.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#090514] text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Top GitHub Pages Export Toolbar */}
      {showNotification && (
        <aside 
          aria-label="GitHub Pages export status"
          className="bg-purple-950/90 border-b border-purple-800/60 backdrop-blur-md px-4 py-2.5 sticky top-0 z-50 text-xs sm:text-sm text-purple-200"
        >
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-purple-300" />
                Standalone <code className="bg-purple-900/80 px-1.5 py-0.5 rounded text-purple-200 text-xs">{activeFileName}</code> ready for GitHub Pages
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Document Switcher inside topbar */}
              <div className="flex items-center rounded-lg bg-[#140b2a] p-0.5 border border-purple-800/60">
                <button
                  onClick={() => { setActiveDoc('privacy'); setSearchQuery(''); }}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeDoc === 'privacy' 
                      ? 'bg-purple-600 text-white shadow-sm' 
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  <span>Privacy Policy</span>
                </button>
                <button
                  onClick={() => { setActiveDoc('terms'); setSearchQuery(''); }}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeDoc === 'terms' 
                      ? 'bg-purple-600 text-white shadow-sm' 
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>Terms of Service</span>
                </button>
              </div>

              <button
                id="copy-raw-html-btn"
                onClick={handleCopyHtml}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800/80 border border-purple-700/60 text-purple-100 font-medium transition cursor-pointer"
                title={`Copy full HTML of ${activeFileName}`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'HTML Copied!' : `Copy ${activeFileName}`}</span>
              </button>

              <button
                id="download-html-file-btn"
                onClick={handleDownloadHtml}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition shadow-sm cursor-pointer"
                title={`Download ${activeFileName} directly`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .html</span>
              </button>

              <a
                id="view-direct-html-link"
                href={activeFileHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900/60 border border-purple-800/80 text-purple-200 font-medium transition"
                title={`Open raw ${activeFileName} in new tab`}
              >
                <span>Open {activeFileHref}</span>
                <ExternalLink className="w-3 h-3 text-purple-400" />
              </a>

              <button 
                onClick={() => setShowNotification(false)}
                className="text-purple-400 hover:text-purple-200 p-1 rounded transition ml-1 cursor-pointer"
                aria-label="Dismiss banner"
              >
                ✕
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#090514]/90 backdrop-blur-md border-b border-purple-900/30 py-3.5 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-purple-500/25 border border-white/20">
              V
            </div>
            <div>
              <div className="font-extrabold tracking-wider text-white text-base leading-tight flex items-center gap-2">
                VIRUS
                <span className="text-[10px] uppercase font-bold tracking-widest bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-800/60">
                  Discord Activity
                </span>
              </div>
              <div className="text-xs text-purple-300/80 tracking-wide">
                Developed by VIRUS TEAM
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Nav Tabs */}
            <div className="flex items-center bg-[#160f2e] border border-purple-900/50 rounded-xl p-1">
              <button
                id="tab-privacy-policy"
                onClick={() => { setActiveDoc('privacy'); setSearchQuery(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeDoc === 'privacy'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Privacy Policy
              </button>
              <button
                id="tab-terms-of-service"
                onClick={() => { setActiveDoc('terms'); setSearchQuery(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeDoc === 'terms'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Terms of Service
              </button>
            </div>

            {/* Link back to the main VIRUS Activity */}
            <a
              id="activity-nav-link"
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 hover:bg-purple-900/60 border border-purple-600/40 text-white text-xs sm:text-sm font-semibold transition hover:shadow-lg hover:shadow-purple-500/20"
            >
              <ArrowLeft className="w-4 h-4 text-purple-300" />
              <span>Return to VIRUS Activity</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Legal Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        
        {/* =========================================================================
            PRIVACY POLICY VIEW
           ========================================================================= */}
        {activeDoc === 'privacy' && (
          <div>
            {/* Document Hero */}
            <section className="pt-4 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-purple-500/10 border border-purple-500/30 text-purple-300 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                Privacy & Data Transparency
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
                Privacy Policy
              </h1>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">
                This Privacy Policy details our unwavering commitment to player privacy, transparent data practices, and the technical principles governing the VIRUS Discord Activity.
              </p>

              {/* Metadata Card */}
              <div className="mt-6 bg-[#160f2e] border border-purple-900/40 rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-xl shadow-black/40">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Application</div>
                  <div className="text-sm font-semibold text-slate-100">VIRUS (Discord Activity)</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Developer</div>
                  <div className="text-sm font-semibold text-purple-200">VIRUS TEAM</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Effective Date</div>
                  <div className="text-sm font-semibold text-slate-100">September 18, 2026</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Data Retention</div>
                  <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                    <EyeOff className="w-3.5 h-3.5" />
                    Zero Persistent PII
                  </div>
                </div>
              </div>

              {/* Zero-Collection Highlight Card */}
              <div className="mt-6 bg-gradient-to-r from-emerald-950/30 to-[#160f2e] border border-emerald-500/40 rounded-xl p-4 sm:p-5 flex gap-3 sm:gap-4 items-start">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-black">
                  ✓
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white block sm:inline font-semibold">Core Privacy Commitment: No Personal Data Collected. </strong>
                  VIRUS is architected with a strict privacy-by-design standard. We do not harvest, monetize, sell, or maintain persistent databases of your personal identity, messages, or financial information. Any session data received is transient, volatile, and purged immediately upon exiting the Activity.
                </div>
              </div>
            </section>

            {/* Quick Search & Table of Contents */}
            <section className="my-8 bg-[#110b24] border border-purple-900/40 rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  <span>Privacy Policy Sections</span>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="search-privacy-sections"
                    type="text"
                    placeholder="Search privacy topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#160f2e] border border-purple-900/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className="text-left flex items-center gap-2.5 p-2 rounded-lg hover:bg-purple-900/20 text-slate-300 hover:text-purple-200 transition group text-xs sm:text-sm cursor-pointer"
                  >
                    <span className="font-mono text-xs font-bold text-purple-400 group-hover:text-purple-300 min-w-[22px]">
                      {sec.num}.
                    </span>
                    <span className="truncate group-hover:translate-x-0.5 transition-transform">
                      {sec.title}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Privacy Document Sections */}
            <div className="space-y-6 sm:space-y-8">

              {/* Section 01: Introduction */}
              <section id="section-1" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">01</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Introduction</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    Welcome to the official Privacy Policy for <strong>VIRUS</strong>, an interactive multiplayer Discord Activity developed, operated, and maintained by <strong>VIRUS TEAM</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
                  </p>
                  <p>
                    VIRUS operates directly within the Discord desktop, web, and mobile clients as an embedded application running inside Discord voice channels and servers via the official Discord Embedded App SDK. We respect the personal privacy of all players and believe that social gaming should be transparent, secure, and entirely devoid of intrusive user surveillance or covert behavioral monetization.
                  </p>
                  <p>
                    This Privacy Policy sets forth our clear standards regarding what minimal information may be handled during an active gameplay session, how that technical context is utilized exclusively to provide real-time game functions, and your rights and controls as a user. By launching, entering, or participating in the VIRUS Activity, you acknowledge the privacy practices outlined herein.
                  </p>
                  <div className="bg-purple-950/40 border-l-4 border-purple-500 p-4 rounded-r-lg text-slate-200 text-sm">
                    VIRUS TEAM is an independent developer group. VIRUS is not owned, operated, sponsored, or directly managed by Discord Inc. Discord&apos;s own data processing practices are governed exclusively by the <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline underline-offset-2">Discord Privacy Policy</a>.
                  </div>
                </div>
              </section>

              {/* Section 02: Data Collection */}
              <section id="section-2" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">02</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Data Collection</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    <strong className="text-white">No personal data is collected or stored unless explicitly stated otherwise.</strong> VIRUS is built on a zero-retention framework. We do not require you to create a proprietary third-party account, enter an email address, provide passwords, link payment methods, or submit any real-world identity documentation to use the Activity.
                  </p>

                  <h3 className="text-base font-bold text-white pt-2 flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-purple-500 rounded-sm inline-block" />
                    Information We Do NOT Collect
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-slate-300 text-sm">
                    <li><strong className="text-white">No Real-World Personal Identifiers:</strong> We do not collect your real name, physical address, phone number, email address, date of birth, or government ID.</li>
                    <li><strong className="text-white">No Financial or Payment Data:</strong> We do not collect credit card numbers, bank routing information, or billing records.</li>
                    <li><strong className="text-white">No Discord Private Data:</strong> We do not access, view, log, or store your Discord private direct messages (DMs), friend lists, server member directories, chat histories, or stored files.</li>
                    <li><strong className="text-white">No Tracking Cookies or Spyware:</strong> We do not inject persistent tracking cookies, advertising IDs, device fingerprinting scripts, keystroke loggers, or behavioral recording software.</li>
                  </ul>

                  <h3 className="text-base font-bold text-white pt-2 flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-purple-500 rounded-sm inline-block" />
                    Transient Technical Data Handled During Active Gameplay
                  </h3>
                  <p>
                    To render the multiplayer game inside your Discord voice channel, the Discord Embedded App SDK temporarily delivers standard runtime session context to the Activity. This technical context is processed <strong>strictly in volatile temporary memory (RAM)</strong> for the duration of the active match:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                    <div className="bg-[#110b24] border border-purple-900/40 rounded-xl p-4">
                      <div className="text-xs font-bold text-purple-300 mb-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        Discord Identifiers
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Public User ID, username, and avatar hash are processed temporarily in-memory to display your player tag and scoreboard icon.
                      </p>
                    </div>

                    <div className="bg-[#110b24] border border-purple-900/40 rounded-xl p-4">
                      <div className="text-xs font-bold text-purple-300 mb-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        Voice Channel Context
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Channel ID and Guild ID are referenced in real-time to group participants into the same interactive game room.
                      </p>
                    </div>

                    <div className="bg-[#110b24] border border-purple-900/40 rounded-xl p-4">
                      <div className="text-xs font-bold text-purple-300 mb-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        Real-Time Inputs
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Match selections, player actions, and match scores are synchronized across players and reset immediately when the match concludes.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300">
                    <strong className="text-white">Zero Persistent Database Storage:</strong> None of the transient technical attributes described above are saved to persistent databases, disk storage, or user profile dossiers. The instant you close the VIRUS Activity or disconnect from the Discord voice channel, your ephemeral session memory is automatically erased.
                  </p>
                </div>
              </section>

              {/* Section 03: Use of Information */}
              <section id="section-3" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">03</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Use of Information</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    Because we do not collect personal data, any processing of transient technical session context is strictly limited to the operational necessities of delivering real-time entertainment. Specifically, information is used solely to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-slate-300 text-sm">
                    <li><strong className="text-white">Enable Real-Time Multiplayer Gameplay:</strong> Synchronize game states, events, player actions, and match progression among users currently active in the same Discord voice session.</li>
                    <li><strong className="text-white">Display Player Interface & Leaderboards:</strong> Render your in-game presence, avatar representation, and current round score on the visual match screen.</li>
                    <li><strong className="text-white">Ensure Room Routing & Connectivity:</strong> Maintain stable peer-to-peer or server-coordinated state so all channel participants interact within the correct game room.</li>
                    <li><strong className="text-white">Protect Service Integrity & Prevent Abuse:</strong> Enforce rate limiting against automated packet flooding, botting, script injection, and disruptive exploits to guarantee a fair environment for all players.</li>
                  </ul>

                  <h3 className="text-base font-bold text-white pt-2 flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-purple-500 rounded-sm inline-block" />
                    Our Strict Commercial Prohibitions
                  </h3>
                  <p>
                    VIRUS TEAM adheres to an unequivocal policy against commercializing user information:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-300 text-sm">
                    <li>We <strong className="text-white">NEVER sell, rent, lease, or trade</strong> your session identifiers or gameplay records to data brokers, advertising agencies, or marketing companies.</li>
                    <li>We <strong className="text-white">DO NOT use</strong> your data for behavioral retargeting, targeted advertisements, or demographic profiling.</li>
                    <li>We <strong className="text-white">DO NOT train</strong> third-party machine learning models or commercial algorithmic classifiers on your voice, chat, or gameplay inputs.</li>
                  </ul>
                </div>
              </section>

              {/* Section 04: Data Security */}
              <section id="section-4" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">04</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Data Security</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    The security of your connection and the integrity of the VIRUS Activity are foundational priorities for VIRUS TEAM. We employ robust technical safeguards aligned with modern software standards:
                  </p>
                  <ul className="list-disc list-inside space-y-2.5 ml-2 text-slate-300 text-sm">
                    <li><strong className="text-white">End-to-End Transport Layer Security (TLS/HTTPS & WSS):</strong> All web assets, styles, scripts, and WebSocket communications between the Discord client interface and hosting endpoints are strictly encrypted using TLS 1.3/HTTPS and secure WebSockets (WSS). Unencrypted plain-text transport is prohibited.</li>
                    <li><strong className="text-white">Zero-Persistence Architecture:</strong> The most dependable defense against unauthorized database intrusion is refusing to store user databases. By holding zero persistent personal dossiers, there is no centralized database of your personal information subject to compromise.</li>
                    <li><strong className="text-white">Discord Sandboxed iFrame Environment:</strong> The VIRUS Activity executes within Discord&apos;s secure, restricted sandbox iframe. The Activity has no access to your host operating system, local computer files, personal Discord application credentials, or hardware peripherals (such as microphones or webcams) without Discord&apos;s explicit client permission dialogs.</li>
                    <li><strong className="text-white">Routine Dependency Audits:</strong> Third-party software libraries, build tools, and server configurations are routinely scanned and audited against known vulnerabilities and security advisories (CVEs).</li>
                  </ul>
                  <p className="text-xs text-slate-400">
                    While no method of digital transmission or distributed cloud hosting can guarantee absolute, impenetrable security, our minimal-exposure architecture reduces risk to the absolute lowest practical threshold.
                  </p>
                </div>
              </section>

              {/* Section 05: User Rights */}
              <section id="section-5" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">05</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">User Rights</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    VIRUS TEAM respects statutory privacy rights recognized under applicable global frameworks, including the European Union and United Kingdom General Data Protection Regulations (GDPR / UK GDPR), the California Consumer Privacy Act / California Privacy Rights Act (CCPA / CPRA), and similar international data privacy statutes.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-slate-300 text-sm">
                    <li><strong className="text-white">Right to Know & Access:</strong> You have the right to request confirmation of whether personal data is processed. As documented in this policy, VIRUS does not maintain or store personal data records regarding individual users.</li>
                    <li><strong className="text-white">Right to Erasure (&quot;Right to Be Forgotten&quot;):</strong> Because all in-game session data is volatile and purged automatically when you exit the Activity, your data is erased as a standard design feature. If you have communicated with VIRUS TEAM via email for support or feedback, you may request permanent deletion of that email communication at any time.</li>
                    <li><strong className="text-white">Right to Object & Restrict Processing:</strong> You have unconditional control over your participation. You can cease all processing immediately by closing the Activity window or exiting the Discord voice channel.</li>
                    <li><strong className="text-white">Right to Non-Discrimination:</strong> We will never discriminate, degrade service quality, or impose financial penalties on any user for exercising their statutory privacy rights.</li>
                  </ul>
                  <p className="text-xs sm:text-sm text-slate-300">
                    To submit a privacy inquiry or exercise any applicable rights regarding direct correspondence, please reach out to us using the contact details provided in Section 8.
                  </p>
                </div>
              </section>

              {/* Section 06: Third-Party Services */}
              <section id="section-6" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">06</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Third-Party Services</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    VIRUS operates as a Discord Activity and leverages specific trusted infrastructure providers to deliver web assets and connectivity. Below is a disclosure of third-party platforms involved:
                  </p>

                  <div className="space-y-3">
                    <div className="bg-[#110b24] border border-purple-900/40 rounded-xl p-4">
                      <div className="font-bold text-white text-sm mb-1">1. Discord Inc. (Discord Platform & SDK)</div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        VIRUS is integrated into Discord via the Discord Embedded App SDK. Discord provides user authentication tokens, voice channel room routing, and the sandboxed runtime frame. Your Discord account, voice channel activity, and platform relationship are governed directly by Discord Inc. We strongly recommend reviewing the <a href="https://discord.com/terms" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline">Discord Terms of Service</a> and the <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline">Discord Privacy Policy</a>.
                      </p>
                    </div>

                    <div className="bg-[#110b24] border border-purple-900/40 rounded-xl p-4">
                      <div className="font-bold text-white text-sm mb-1">2. Static Hosting & Edge Infrastructure</div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Static front-end files (HTML, CSS, images, and audio assets) and legal policy documents may be hosted on edge distribution networks such as GitHub Pages (GitHub Inc. / Microsoft Corporation) or Cloudflare. These infrastructure providers may generate standard web server access logs strictly for DDoS prevention, threat mitigation, and network reliability under their respective privacy policies.
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-950/40 border-l-4 border-purple-500 p-4 rounded-r-lg text-slate-200 text-xs sm:text-sm">
                    VIRUS does not incorporate external social network tracking pixels, Google Analytics, Meta ad SDKs, or third-party behavioral telemetry aggregators.
                  </div>
                </div>
              </section>

              {/* Section 07: Changes to the Privacy Policy */}
              <section id="section-7" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">07</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Changes to the Privacy Policy</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    VIRUS TEAM reserves the right to amend, update, or revise this Privacy Policy periodically to reflect enhancements to the Activity, updates to Discord&apos;s Embedded App SDK guidelines, changes in our infrastructure, or evolving legal and regulatory mandates.
                  </p>
                  <p>
                    When revisions occur, we will update the <strong>Effective Date</strong> prominently at the top and bottom of this document. In the event of material modifications that substantively alter our data practices, we will provide conspicuous notice via the VIRUS Activity loading screen, our official repository, or Discord community announcement channels prior to the changes taking effect.
                  </p>
                  <p>
                    Your continued launching, access, or utilization of the VIRUS Activity following the publication of any revised Privacy Policy confirms your acknowledgment and acceptance of the revised practices. We encourage you to review this policy periodically.
                  </p>
                </div>
              </section>

              {/* Section 08: Contact Information */}
              <section id="section-8" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">08</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Contact Information</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    If you have any questions, comments, feedback, or formal privacy inquiries regarding this Privacy Policy or the data handling practices of the VIRUS Activity, please contact the <strong>VIRUS TEAM</strong> development representatives directly:
                  </p>

                  <div className="bg-gradient-to-br from-[#160f2e] to-[#27144d]/60 border border-purple-500/40 rounded-2xl p-6 sm:p-8">
                    <div className="text-lg font-bold text-white mb-2">VIRUS TEAM — Privacy & Compliance</div>
                    <p className="text-slate-300 text-xs sm:text-sm mb-4">
                      For privacy verification, data inquiries, or security disclosures:
                    </p>
                    
                    <div className="inline-block bg-purple-900/40 border border-dashed border-purple-400/80 rounded-xl px-4 py-2.5 font-mono text-sm sm:text-base text-purple-200 tracking-wider select-all shadow-inner">
                      [CONTACT EMAIL]
                    </div>

                    <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                      Please replace <code className="text-purple-300 bg-purple-950 px-1.5 py-0.5 rounded">[CONTACT EMAIL]</code> with your actual support inbox (e.g. <code>privacy@yourdomain.com</code>) when deploying. Inquiries are generally addressed within 3 to 5 business days.
                    </p>
                  </div>

                  <div className="bg-purple-950/40 border-l-4 border-purple-500 p-4 rounded-r-lg text-slate-200 text-xs sm:text-sm">
                    For issues concerning your overarching Discord account, Discord Nitro subscriptions, or voice channel connectivity, please contact <a href="https://support.discord.com" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline underline-offset-2">Discord Support</a> directly.
                  </div>
                </div>
              </section>

            </div>
          </div>
        )}

        {/* =========================================================================
            TERMS OF SERVICE VIEW
           ========================================================================= */}
        {activeDoc === 'terms' && (
          <div>
            {/* Document Hero */}
            <section className="pt-4 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-purple-500/10 border border-purple-500/30 text-purple-300 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                Official Legal Agreement
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
                Terms of Service
              </h1>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">
                Please review these Terms of Service carefully before launching, joining, accessing, or interacting with the VIRUS Discord Activity.
              </p>

              {/* Metadata Card */}
              <div className="mt-6 bg-[#160f2e] border border-purple-900/40 rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-xl shadow-black/40">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Application</div>
                  <div className="text-sm font-semibold text-slate-100">VIRUS (Discord Activity)</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Developer</div>
                  <div className="text-sm font-semibold text-purple-200">VIRUS TEAM</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Effective Date</div>
                  <div className="text-sm font-semibold text-slate-100">September 18, 2026</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contact</div>
                  <div className="text-sm font-semibold text-purple-300 font-mono">[CONTACT EMAIL]</div>
                </div>
              </div>

              {/* Discord Affiliation Notice */}
              <div className="mt-6 bg-purple-950/30 border border-purple-600/40 rounded-xl p-4 sm:p-5 flex gap-3 sm:gap-4 items-start">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-600/50 flex items-center justify-center text-purple-300">
                  <Info className="w-4 h-4" />
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white block sm:inline font-semibold">Independent Development Notice: </strong>
                  The <strong>VIRUS</strong> Discord Activity is an independently created application developed and operated by <strong>VIRUS TEAM</strong>. VIRUS is not owned, operated, sponsored, or endorsed by Discord Inc. &quot;Discord&quot; is a registered trademark of Discord Inc.
                </div>
              </div>
            </section>

            {/* Quick Search & Table of Contents */}
            <section className="my-8 bg-[#110b24] border border-purple-900/40 rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  <span>Terms Sections</span>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="search-terms-sections"
                    type="text"
                    placeholder="Search legal sections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#160f2e] border border-purple-900/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className="text-left flex items-center gap-2.5 p-2 rounded-lg hover:bg-purple-900/20 text-slate-300 hover:text-purple-200 transition group text-xs sm:text-sm cursor-pointer"
                  >
                    <span className="font-mono text-xs font-bold text-purple-400 group-hover:text-purple-300 min-w-[22px]">
                      {sec.num}.
                    </span>
                    <span className="truncate group-hover:translate-x-0.5 transition-transform">
                      {sec.title}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Terms Sections */}
            <div className="space-y-6 sm:space-y-8">
              {/* Section 01 */}
              <section id="acceptance" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">01</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Introduction and Acceptance of the Terms</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>Welcome to <strong>VIRUS</strong>, an interactive Discord Activity created and maintained by <strong>VIRUS TEAM</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).</p>
                  <p>These Terms of Service (&quot;Terms&quot;) constitute a legally binding contract between you (&quot;you&quot;, &quot;user&quot;, or &quot;player&quot;) and VIRUS TEAM governing your access to and use of the VIRUS Discord Activity.</p>
                  <div className="bg-purple-950/40 border-l-4 border-purple-500 p-4 rounded-r-lg text-slate-200 text-sm">
                    By launching, joining, accessing, or playing the VIRUS Activity within Discord, you explicitly acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must immediately cease accessing and exit the Activity.
                  </div>
                </div>
              </section>

              {/* Section 02 */}
              <section id="description" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">02</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Description of the VIRUS Application</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                  <p><strong>VIRUS</strong> is an interactive digital application designed specifically as a Discord Activity. The application runs embedded directly within Discord voice and text channels via Discord&apos;s embedded application framework, offering interactive gameplay and entertainment experiences for Discord users and community servers.</p>
                  <p>The Activity is engineered solely for personal, non-commercial community entertainment. VIRUS is independently created by VIRUS TEAM and operates through Discord&apos;s platform infrastructure to render inside your Discord client.</p>
                </div>
              </section>

              {/* Section 03 */}
              <section id="responsibilities" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">03</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">User Responsibilities</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                  <p>When participating in the VIRUS Activity, you are responsible for maintaining proper conduct:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-slate-300 text-sm">
                    <li><strong className="text-white">Account Security:</strong> Safeguarding your personal Discord account credentials and authentication tokens.</li>
                    <li><strong className="text-white">Technical Prerequisites:</strong> Maintaining device hardware, internet connectivity, and Discord updates.</li>
                    <li><strong className="text-white">Community Courtesy:</strong> Treating all other players, server members, and voice channel participants with respect.</li>
                  </ul>
                </div>
              </section>

              {/* Section 04 */}
              <section id="acceptable-use" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">04</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Acceptable and Prohibited Use</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                  <p>To preserve integrity, security, and enjoyment, you agree not to engage in prohibited activities:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-slate-300 text-sm">
                    <li><strong className="text-white">Cheating and Exploits:</strong> Exploiting bugs, memory injection, speed hacks, packet spoofing, or automated bots.</li>
                    <li><strong className="text-white">Reverse Engineering:</strong> Decompiling, reverse engineering, disassembling, or deriving source code of the Activity.</li>
                    <li><strong className="text-white">Malicious Interference:</strong> Attempting denial-of-service (DoS) attacks, flood requests, or packet disruption.</li>
                    <li><strong className="text-white">Harassment and Toxic Behavior:</strong> Transmitting hateful, derogatory, defamatory, or abusive content in-game.</li>
                  </ul>
                </div>
              </section>

              {/* Section 05 */}
              <section id="discord-compliance" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">05</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Discord Compliance and Non-Affiliation</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                  <p>Your access to VIRUS is conditioned upon strict compliance with Discord&apos;s platform terms:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2 text-slate-300 text-sm">
                    <li><strong className="text-white">Discord Terms of Service:</strong> Compliance with <a href="https://discord.com/terms" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline">discord.com/terms</a>.</li>
                    <li><strong className="text-white">Discord Community Guidelines:</strong> Adherence to <a href="https://discord.com/guidelines" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline">discord.com/guidelines</a>.</li>
                    <li><strong className="text-white">Independent Entity:</strong> VIRUS TEAM operates independently of Discord Inc.</li>
                  </ul>
                </div>
              </section>

              {/* Section 06 */}
              <section id="intellectual-property" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">06</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Intellectual Property Rights</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                  <p>All intellectual property rights, trademarks, visual assets, game mechanics, sound design, and source code of the VIRUS Activity are the exclusive property of <strong>VIRUS TEAM</strong> or its licensors. You are granted a limited, personal, non-transferable, revocable license solely for personal entertainment inside Discord.</p>
                </div>
              </section>

              {/* Section 07 */}
              <section id="availability" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">07</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Availability and Service Changes</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                  <p>VIRUS TEAM strives for high availability, but the Activity may experience maintenance, network interruptions, or updates. Features may be updated, rebalanced, or deprecated without liability.</p>
                </div>
              </section>

              {/* Section 08 */}
              <section id="termination" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">08</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Suspension and Termination</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                  <p>VIRUS TEAM reserves the right to suspend or ban any user or Discord server from accessing VIRUS for violations of these Terms, exploitative behavior, harassment, or infrastructure abuse.</p>
                </div>
              </section>

              {/* Section 09 */}
              <section id="warranties" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">09</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Disclaimer of Warranties</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                  <p className="uppercase text-xs sm:text-sm tracking-wide bg-purple-950/50 border border-purple-900/60 p-4 rounded-xl text-slate-300">
                    THE VIRUS APPLICATION IS PROVIDED STRICTLY ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section id="liability" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">10</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Limitation of Liability</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                  <p className="uppercase text-xs sm:text-sm tracking-wide bg-purple-950/50 border border-purple-900/60 p-4 rounded-xl text-slate-300">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, VIRUS TEAM SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE ACTIVITY.
                  </p>
                </div>
              </section>

              {/* Section 11 */}
              <section id="changes" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">11</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Changes to These Terms</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                  <p>VIRUS TEAM reserves the right to modify these Terms. The updated Effective Date indicates revisions. Continued use of VIRUS constitutes acceptance of modified Terms.</p>
                </div>
              </section>

              {/* Section 12 */}
              <section id="contact" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">12</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Contact Information</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                  <p>For questions or notices regarding these Terms, contact VIRUS TEAM at:</p>
                  <div className="inline-block bg-purple-900/40 border border-dashed border-purple-400/80 rounded-xl px-4 py-2 font-mono text-purple-200">
                    [CONTACT EMAIL]
                  </div>
                </div>
              </section>

              {/* Section 13 */}
              <section id="effective-date" className="bg-[#160f2e] border border-purple-900/40 rounded-2xl p-6 sm:p-8 scroll-mt-24 hover:border-purple-700/50 transition">
                <div className="flex items-baseline gap-3 pb-3 mb-4 border-b border-purple-900/40">
                  <span className="text-xs font-mono font-black text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/50">13</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Effective Date</h2>
                </div>
                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-2">
                  <p className="font-bold text-white text-lg">September 18, 2026</p>
                  <p className="text-xs text-slate-400">These Terms supersede all previous statements or agreements.</p>
                </div>
              </section>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-purple-900/30 bg-[#070310] py-12 px-4 text-xs text-slate-400">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="flex flex-wrap justify-center gap-6 text-slate-300 text-xs sm:text-sm">
            <button
              onClick={() => { setActiveDoc('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`hover:text-purple-300 transition cursor-pointer ${activeDoc === 'privacy' ? 'text-purple-400 font-semibold' : ''}`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => { setActiveDoc('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`hover:text-purple-300 transition cursor-pointer ${activeDoc === 'terms' ? 'text-purple-400 font-semibold' : ''}`}
            >
              Terms of Service
            </button>
            <a 
              href="https://discord.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-purple-300 transition"
            >
              VIRUS on Discord
            </a>
            <a 
              href="https://discord.com/terms" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-purple-300 transition"
            >
              Discord Terms
            </a>
            <a 
              href="https://discord.com/privacy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-purple-300 transition"
            >
              Discord Privacy
            </a>
            <button
              onClick={() => scrollToSection(activeDoc === 'privacy' ? 'section-8' : 'contact')}
              className="hover:text-purple-300 transition cursor-pointer"
            >
              Contact
            </button>
          </div>

          <p className="max-w-xl text-slate-400 text-xs leading-relaxed">
            &copy; 2026 VIRUS TEAM. All rights reserved. VIRUS is an independent Discord Activity developed by VIRUS TEAM and is not affiliated with, endorsed by, or sponsored by Discord Inc. Discord is a registered trademark of Discord Inc.
          </p>

          <div className="flex items-center gap-3">
            <button
              id="footer-return-to-activity-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 text-purple-300 text-xs transition cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>

            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to VIRUS Activity</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
