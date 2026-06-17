'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import { useToast } from '@/lib/toast-context';
import {
  ArrowLeft,
  GitFork,
  Award,
  Plus,
  Trash2,
  Code,
  Globe,
  Loader2,
  Star,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Info
} from 'lucide-react';

export default function ProjectsTrackerPage() {
  const { user } = useAuth();
  const { projects, addProject, deleteProject, certs, addCert, removeCert } = useResume();
  const { showToast } = useToast();

  // Project form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tech, setTech] = useState('');
  const [github, setGithub] = useState('');
  const [demo, setDemo] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Cert form states
  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertUrlOrId, setNewCertUrlOrId] = useState('');
  const [newCertExpiryDate, setNewCertExpiryDate] = useState('');

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please fill out Project Title and Description.', 'error');
      return;
    }
    if (!github.trim()) {
      showToast('Please provide a GitHub Repository link.', 'error');
      return;
    }

    setVerifying(true);
    const result = await addProject({
      title: title.trim(),
      description: description.trim(),
      tech: tech.trim(),
      github: github.trim(),
      demo: demo.trim()
    });
    setVerifying(false);

    if (result.success) {
      if (result.error) {
        showToast(`Project logged, but verification failed: ${result.error}`, 'info');
      } else {
        showToast('Project added to portfolio successfully!', 'success');
      }
      // Reset fields
      setTitle('');
      setDescription('');
      setTech('');
      setGithub('');
      setDemo('');
    } else {
      showToast(result.error || 'Failed to log project.', 'error');
    }
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim() || !newCertIssuer.trim() || !newCertUrlOrId.trim()) {
      showToast('Please fill out name, issuer, and credential ID or URL.', 'error');
      return;
    }
    
    // Check for duplicates
    const isDuplicate = certs.some(c => 
      c.name.toLowerCase() === newCertName.toLowerCase() &&
      c.issuer.toLowerCase() === newCertIssuer.toLowerCase() &&
      c.credentialIdOrUrl.toLowerCase() === newCertUrlOrId.toLowerCase()
    );
    if (isDuplicate) {
      showToast('Duplicate certification detected. This credential is already logged.', 'error');
      return;
    }

    addCert({
      name: newCertName.trim(),
      issuer: newCertIssuer.trim(),
      credentialIdOrUrl: newCertUrlOrId.trim(),
      expiryDate: newCertExpiryDate ? newCertExpiryDate : undefined
    });
    
    showToast('Certification added successfully!', 'success');
    setNewCertName('');
    setNewCertIssuer('');
    setNewCertUrlOrId('');
    setNewCertExpiryDate('');
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <GitFork className="h-6 w-6 text-teal-400" /> Projects & Certifications Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build your portfolio credentials. Log projects to compute portfolio scores and log completed certifications to gain system bonuses.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* LEFT COLUMN: PROJECTS FORM & CURRENT LIST */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Projects logger Form */}
          <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Code className="h-4.5 w-4.5 text-teal-400" />
              <span>Log Portfolio Project</span>
            </h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Project Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="InsightX AI Research Engine"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-white outline-none transition-smooth"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Technologies (Comma separated)</label>
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => setTech(e.target.value)}
                    placeholder="TypeScript, React, Node.js, Redis"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-white outline-none transition-smooth"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Project Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Elaborate on the project goals, tech stack, and quantitative metrics (e.g. 'Optimized index structures reducing latency queries by 40%')..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-white outline-none transition-smooth resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">GitHub Repository Link</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-white outline-none transition-smooth"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Live Demo Link</label>
                  <input
                    type="url"
                    value={demo}
                    onChange={(e) => setDemo(e.target.value)}
                    placeholder="https://myproject.vercel.app"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-white outline-none transition-smooth"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-smooth flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-teal-600/15"
              >
                {verifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-950" /> Verifying Repository...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 stroke-[3]" /> Add Project to Portfolio
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Current Projects List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Your Portfolio Projects ({projects.length})</h3>
            
            {projects.length === 0 ? (
              <div className="glass-panel border-slate-900 rounded-2xl p-6 text-center text-xs text-slate-500 font-semibold py-8">
                No projects registered in your portfolio. Use the form above to add projects.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    className="glass-panel border-slate-900 bg-slate-950/40 p-5 rounded-2xl flex flex-col justify-between gap-4 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 blur-2xl rounded-full" />
                    
                    <div className="space-y-3 relative z-10">
                      <div className="flex justify-between items-start gap-3">
                        <h4 className="font-bold text-white text-sm truncate max-w-[200px]">{project.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                          project.strengthScore >= 80 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : project.strengthScore >= 50 
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          Strength: {project.strengthScore}%
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-400 leading-relaxed text-justify line-clamp-3">
                        {project.description}
                      </p>

                      {project.tech && (
                        <div className="flex flex-wrap gap-1">
                          {project.tech.split(',').map((t, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-semibold text-slate-400 font-mono">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* GitHub verification metadata section */}
                      <div className="pt-2">
                        {project.isGithubVerified ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
                              {project.isOfflineVerified ? (
                                <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wide flex items-center gap-0.5">
                                  <AlertTriangle className="h-3 w-3" /> Offline Verified
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide flex items-center gap-0.5">
                                  <CheckCircle2 className="h-3 w-3" /> GitHub Verified
                                </span>
                              )}
                              {project.isFork && (
                                <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wide">
                                  Forked (50% weight)
                                </span>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 text-[9px] text-slate-500 mt-1">
                              {project.stars !== undefined && (
                                <span className="flex items-center gap-0.5">⭐ {project.stars}</span>
                              )}
                              {project.forksCount !== undefined && (
                                <span className="flex items-center gap-0.5">🍴 {project.forksCount}</span>
                              )}
                              {project.primaryLanguage && (
                                <span className="flex items-center gap-0.5">💻 {project.primaryLanguage}</span>
                              )}
                              {project.lastUpdated && (
                                <span className="flex items-center gap-0.5">🕒 {new Date(project.lastUpdated).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wide flex items-center gap-0.5 w-fit text-[9px]">
                              <AlertTriangle className="h-3 w-3" /> Verification Failed (0 Score)
                            </span>
                            {project.githubVerificationError && (
                              <p className="text-[9px] text-rose-400/80 leading-normal pl-1 italic">
                                Reason: {project.githubVerificationError}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-900/60 relative z-10 text-xs">
                      <div className="flex gap-2">
                        {project.github && (
                          <a 
                            href={project.github} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-smooth flex items-center gap-1 text-[10px]"
                            title="GitHub Repository"
                          >
                            <Code className="h-3.5 w-3.5" /> Code
                          </a>
                        )}
                        {project.demo && (
                          <a 
                            href={project.demo} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-smooth flex items-center gap-1 text-[10px]"
                            title="Live Demo"
                          >
                            <Globe className="h-3.5 w-3.5" /> Live
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => { deleteProject(project.id); showToast('Project removed.', 'info'); }}
                        className="text-rose-400 hover:text-rose-300 p-1 transition-smooth cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: CERTIFICATIONS LEDGER */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-teal-400" />
              <span>Certifications Ledger</span>
            </h3>
            <p className="text-xs text-slate-400">
              Manage your industry credentials. Verified certs provide a +2% score increment up to a maximum +10% dashboard bonus.
            </p>

            <form onSubmit={handleAddCert} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">Cert Name</label>
                <input
                  type="text"
                  value={newCertName}
                  onChange={(e) => setNewCertName(e.target.value)}
                  placeholder="AWS Developer Associate"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-1.5 text-xs text-white outline-none transition-smooth"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">Issuer</label>
                <input
                  type="text"
                  value={newCertIssuer}
                  onChange={(e) => setNewCertIssuer(e.target.value)}
                  placeholder="Amazon Web Services"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-1.5 text-xs text-white outline-none transition-smooth"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">Credential ID or URL</label>
                <input
                  type="text"
                  value={newCertUrlOrId}
                  onChange={(e) => setNewCertUrlOrId(e.target.value)}
                  placeholder="https://credly.com/certs/abc"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-1.5 text-xs text-white outline-none transition-smooth"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={newCertExpiryDate}
                  onChange={(e) => setNewCertExpiryDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-1.5 text-xs text-white outline-none transition-smooth"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl text-xs transition-smooth flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Plus className="h-4 w-4 stroke-[3]" /> Add Certificate
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {certs.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-900 text-center text-xs text-slate-500 font-semibold">
                  No certifications registered.
                </div>
              ) : (
                certs.map((cert, index) => {
                  const name = typeof cert === 'string' ? cert : cert.name;
                  const issuer = typeof cert === 'string' ? 'Legacy Cert' : cert.issuer;
                  const platform = typeof cert === 'string' ? 'Other' : cert.platform;
                  const isVerified = typeof cert === 'string' ? false : cert.isVerified;
                  const credentialIdOrUrl = typeof cert === 'string' ? 'N/A' : cert.credentialIdOrUrl;
                  const expiryDate = typeof cert === 'string' ? undefined : cert.expiryDate;
                  const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;

                  const getPlatformBadge = (plat: typeof platform) => {
                    const badgeStyles: Record<string, string> = {
                      AWS: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                      Google: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                      Microsoft: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                      Cisco: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                      Coursera: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
                      Udemy: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                      Other: 'bg-slate-800 text-slate-400 border-slate-700'
                    };
                    return (
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono border uppercase tracking-wide ${badgeStyles[plat] || badgeStyles.Other}`}>
                        {plat}
                      </span>
                    );
                  };

                  return (
                    <div 
                      key={index}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-900 flex flex-col gap-2 relative overflow-hidden group text-xs"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <h4 className="text-white font-bold truncate">{name}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold">{issuer}</p>
                        </div>
                        <button
                          onClick={() => { removeCert(index); showToast('Certification removed.', 'info'); }}
                          className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer shrink-0"
                          title="Remove credential"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-900/40">
                        {getPlatformBadge(platform)}
                        
                        {isVerified ? (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                            Verified
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wide">
                            User Submitted
                          </span>
                        )}

                        {isExpired && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wide">
                            Expired
                          </span>
                        )}
                      </div>

                      {credentialIdOrUrl && credentialIdOrUrl !== 'Legacy Value' && (
                        <p className="text-[9px] text-slate-500 font-mono truncate pt-0.5">
                          ID: {credentialIdOrUrl}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-3 font-mono leading-relaxed">
              * Certifications score weighting adds to your ledger overall.
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
