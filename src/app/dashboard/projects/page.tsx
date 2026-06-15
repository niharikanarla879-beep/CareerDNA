'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useResume } from '@/lib/resume-context';
import {
  ArrowLeft,
  GitFork,
  Award,
  Plus,
  Trash2,
  Code,
  Globe
} from 'lucide-react';

export default function ProjectsTrackerPage() {
  const { user } = useAuth();
  const { projects, addProject, deleteProject, certs, addCert, removeCert } = useResume();

  // Project form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tech, setTech] = useState('');
  const [github, setGithub] = useState('');
  const [demo, setDemo] = useState('');

  // Cert form states
  const [newCert, setNewCert] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out Project Title and Description.');
      return;
    }

    addProject({
      title: title.trim(),
      description: description.trim(),
      tech: tech.trim(),
      github: github.trim(),
      demo: demo.trim()
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setTech('');
    setGithub('');
    setDemo('');
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.trim()) return;
    addCert(newCert.trim());
    setNewCert('');
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
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl text-xs transition-smooth flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-teal-600/15"
              >
                <Plus className="h-4 w-4 stroke-[3]" /> Add Project to Portfolio
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
                        onClick={() => deleteProject(project.id)}
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

            <form onSubmit={handleAddCert} className="flex gap-2">
              <input
                type="text"
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                placeholder="AWS Developer, PMP..."
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-1.5 text-xs text-white outline-none transition-smooth"
              />
              <button
                type="submit"
                className="p-2 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded-xl transition-smooth flex items-center justify-center cursor-pointer shadow-lg"
              >
                <Plus className="h-4.5 w-4.5 stroke-[3]" />
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {certs.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-900 text-center text-xs text-slate-500 font-semibold">
                  No certifications registered.
                </div>
              ) : (
                certs.map((cert, index) => (
                  <div 
                    key={index}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-900 flex justify-between items-center gap-2 text-xs"
                  >
                    <span className="text-slate-200 font-bold leading-normal break-all min-w-0 flex-1">{cert}</span>
                    <button
                      onClick={() => removeCert(index)}
                      className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer shrink-0"
                      title="Remove credential"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-3 font-mono leading-relaxed">
              * Certifications score bonus: +{Math.min(10, certs.length * 2)}% overall.
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
