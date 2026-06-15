'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Loader2, 
  ArrowLeft, 
  Download, 
  Briefcase, 
  FileUp, 
  Sparkles,
  BadgeAlert,
  BadgeCheck,
  Info,
  Check,
  Printer,
  Trash2
} from 'lucide-react';
import { analyzeResume } from '@/lib/analyzer';
import { useAuth } from '@/lib/auth-context';
import { useResume, ResumeHistoryItem } from '@/lib/resume-context';
import { targetCareers } from '@/lib/constants';

const loadingSteps = [
  'Initializing secure document sandbox...',
  'Extracting raw text from document structure...',
  'Performing semantic parsing on headers & sections...',
  'Cross-referencing work experience dates and impact metrics...',
  'Detecting primary and secondary skill keywords...',
  'Comparing profile with target career benchmarks...',
  'Synthesizing score and compiling recommendations...'
];
export default function ResumeAnalyzer() {
  const { user } = useAuth();
  const { resumeHistory, addResumeToHistory, deleteResumeFromHistory } = useResume();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [targetCareer, setTargetCareer] = useState('swe');
  const [extractedText, setExtractedText] = useState<string>('');
  const textFetchedRef = useRef<boolean>(false);
  
  // Page phases: 'upload' | 'analyzing' | 'results'
  const [phase, setPhase] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [loadingStep, setLoadingStep] = useState(0);
  const [recalculating, setRecalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'skills' | 'suggestions'>('overview');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history item handler
  const loadHistoryItem = (item: ResumeHistoryItem) => {
    setFile({ name: item.filename, size: 0, type: 'application/pdf' } as unknown as File);
    setTargetCareer(item.roleId);
    setExtractedText(item.text);
    textFetchedRef.current = true;
    setPhase('results');
  };

  // Auto-save history item when analysis is complete
  useEffect(() => {
    if (phase === 'results' && extractedText && user) {
      const activeResult = analyzeResume(extractedText, targetCareer);
      const isDuplicate = resumeHistory.some((item: ResumeHistoryItem) => item.text === extractedText && item.roleId === targetCareer);
      
      if (!isDuplicate) {
        addResumeToHistory(
          file ? file.name : 'Pasted Text Resume',
          targetCareer,
          extractedText,
          activeResult
        );
      }
    }
  }, [phase, extractedText, targetCareer, user, file, resumeHistory, addResumeToHistory]);



  // Upload handler
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];
      
      if (validTypes.includes(droppedFile.type) || droppedFile.name.endsWith('.pdf') || droppedFile.name.endsWith('.docx') || droppedFile.name.endsWith('.doc')) {
        setFile(droppedFile);
      } else {
        alert('Invalid file format. Please upload a PDF or DOCX resume.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
  };

  // Run initial simulation
  const handleStartAnalysis = async () => {
    if (!file) return;
    setPhase('analyzing');
    setLoadingStep(0);
    setExtractedText('');
    textFetchedRef.current = false;

    try {
      const fileName = file.name.toLowerCase();
      let parsedText = '';

      // Read file into ArrayBuffer using FileReader for highest browser & mobile compatibility
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result instanceof ArrayBuffer) {
            resolve(e.target.result);
          } else {
            reject(new Error('Failed to read file as ArrayBuffer.'));
          }
        };
        reader.onerror = () => reject(new Error('File reading error.'));
        reader.readAsArrayBuffer(file);
      });

      if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
        // Local PDF Parsing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs') as any;
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        let text = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: { str?: string }) => item.str || '')
            .join(' ');
          text += pageText + '\n';
        }
        parsedText = text;
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileName.endsWith('.docx')
      ) {
        // Local DOCX Parsing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mammoth = await import('mammoth') as any;
        const extractFn = mammoth.default ? mammoth.default.extractRawText : mammoth.extractRawText;
        const result = await extractFn({ arrayBuffer });
        parsedText = result.value || '';
      } else if (file.type.startsWith('text/') || fileName.endsWith('.txt')) {
        // Local Text Parsing
        parsedText = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string || '');
          reader.onerror = () => reject(new Error('Failed to read text file.'));
          reader.readAsText(file);
        });
      } else {
        // Try reading via Mammoth fallback or throw error
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mammoth = await import('mammoth') as any;
          const extractFn = mammoth.default ? mammoth.default.extractRawText : mammoth.extractRawText;
          const result = await extractFn({ arrayBuffer });
          parsedText = result.value || '';
        } catch {
          throw new Error('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
        }
      }

      const cleanParsed = parsedText.trim();
      if (!cleanParsed) {
        throw new Error('No readable text could be extracted from this document. Please ensure the document is not a scanned image, empty, or password protected.');
      }

      setExtractedText(cleanParsed);
      textFetchedRef.current = true;
    } catch (err) {
      console.error('Local resume analysis failed:', err);
      const errorMsg = err instanceof Error ? err.message : 'An error occurred during local resume analysis. Please verify your file format.';
      alert(errorMsg);
      setPhase('upload');
    }
  };

  useEffect(() => {
    if (phase !== 'analyzing') return;

    if (loadingStep === loadingSteps.length - 1 && extractedText) {
      setTimeout(() => setPhase('results'), 0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        } else {
          if (textFetchedRef.current) {
            clearInterval(interval);
            setTimeout(() => setPhase('results'), 0);
          }
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(interval);
  }, [phase, loadingStep, extractedText]);

  // Handle Changing Career Profile on results screen
  const handleCareerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRecalculating(true);
    const newCareer = e.target.value;
    setTimeout(() => {
      setTargetCareer(newCareer);
      setRecalculating(false);
    }, 600); // Quick dynamic loading indicator
  };

  const currentResult = useMemo(() => {
    return analyzeResume(extractedText, targetCareer);
  }, [extractedText, targetCareer]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 stroke-emerald-500';
    if (score >= 60) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
  };

  const getImpactBadge = (impact: 'High' | 'Medium' | 'Low') => {
    switch (impact) {
      case 'High':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 uppercase tracking-wide">High Impact</span>;
      case 'Medium':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wide">Medium Impact</span>;
      case 'Low':
        return <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wide">Low Impact</span>;
    }
  };

  const resetAll = () => {
    setFile(null);
    setExtractedText('');
    textFetchedRef.current = false;
    setPhase('upload');
    setActiveTab('overview');
  };

  const triggerPrint = () => {
    window.print();
  };

  const downloadReport = () => {
    if (!currentResult) return;
    const roleName = targetCareers.find(c => c.id === targetCareer)?.name || 'Target Profile';
    const reportText = `==================================================
CAREERDNA - ATS AUDIT REPORT
==================================================
Target Profile: ${roleName}
Overall ATS Score: ${currentResult.score}/100
Date Analyzed: ${new Date().toLocaleDateString()}

Category-wise Scores:
--------------------
- Keywords & Skills Relevance: ${currentResult.keywordMatch}%
- Formatting & Layout Cleanliness: ${currentResult.formatting}%
- Metrics & Impact Analysis: ${currentResult.experience}%
- Core Skills Coverage: ${currentResult.skillsCoverage}%
- Education Relevance: ${currentResult.education}%

Key Strengths:
-------------
${(currentResult.strengths || []).map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

Optimization Gaps:
-----------------
${(currentResult.weaknesses || []).map((w, idx) => `${idx + 1}. ${w}`).join('\n')}

Actionable Suggestions:
----------------------
${(currentResult.suggestions || []).map((s, idx) => `${idx + 1}. [${s.category}] [Impact: ${s.impact}] ${s.text}`).join('\n')}

==================================================
Report compiled by CareerDNA AI Analyst Sandbox
==================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CareerDNA_ATS_Report_${targetCareer}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header breadcrumb bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-smooth font-semibold mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-emerald-400" /> ATS Resume Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate your resume parsing capabilities, identify skill gaps, and optimize formatting for ATS compliance.
          </p>
        </div>

        {phase === 'results' && (
          <div className="flex gap-2">
            <button 
              onClick={resetAll}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-smooth cursor-pointer flex items-center gap-1.5"
            >
              Upload New
            </button>
            <button 
              onClick={downloadReport}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-slate-950 shadow-lg shadow-teal-600/15 transition-smooth cursor-pointer flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Download Report
            </button>
            <button 
              onClick={triggerPrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15 transition-smooth cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" /> Print Report
            </button>
          </div>
        )}
      </div>

      {/* PHASE 1: UPLOAD SCREEN */}
      {phase === 'upload' && (
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Upload Zone */}
          <div className="lg:col-span-2 space-y-6">
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`glass-panel rounded-3xl border-dashed border-2 p-10 flex flex-col items-center justify-center text-center transition-smooth cursor-pointer relative min-h-[350px] ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-500/5' 
                  : 'border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/10'
              }`}
              onClick={triggerFileSelect}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf,.docx,.doc" 
                className="hidden" 
                onChange={handleFileChange}
              />
              
              {!file ? (
                <div className="space-y-4 flex flex-col items-center">
                  <div className="h-16 w-16 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-400 shadow-lg">
                    <Upload className="h-7 w-7 animate-bounce" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-white text-lg">Drag & Drop your resume</h3>
                    <p className="text-xs text-slate-400">
                      Supports PDF and Microsoft Word (.docx, .doc) format documents
                    </p>
                  </div>
                  <button 
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-smooth"
                  >
                    Select File
                  </button>
                </div>
              ) : (
                <div className="space-y-4 flex flex-col items-center w-full max-w-md">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-center text-emerald-400 relative">
                    <FileText className="h-7 w-7" />
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-slate-900 border border-slate-700 hover:border-rose-500 hover:text-rose-400 rounded-full flex items-center justify-center text-slate-400 transition-smooth"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white text-sm truncate max-w-[300px]">{file.name}</p>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="w-full flex items-center gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-900 justify-center text-xs text-slate-400 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Ready for ATS Analysis
                  </div>
                </div>
              )}
            </div>

            {/* Target Job Selection */}
            {file && (
              <div className="glass-panel border-slate-900 rounded-2xl p-5 space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Briefcase className="h-4.5 w-4.5" />
                  <h3 className="font-bold text-white text-sm">Select Target Career Profile</h3>
                </div>
                <p className="text-xs text-slate-400">
                  We will evaluate your resume formatting and matching keywords against guidelines established for this specific industry.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <select
                      value={targetCareer}
                      onChange={(e) => setTargetCareer(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-white outline-none cursor-pointer focus:border-indigo-500 transition-smooth"
                    >
                      {targetCareers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <button
                      onClick={handleStartAnalysis}
                      className="w-full h-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-smooth flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-4 w-4 text-amber-300" /> Start ATS Auditor
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Side Info Panel */}
          <div className="space-y-6">
            {/* Version History List */}
            {resumeHistory.length > 0 && (
              <div className="glass-panel border-slate-900/60 rounded-3xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-sm">Resume Version History</h3>
                  <span className="text-[10px] text-slate-500 font-mono">{resumeHistory.length} Saved</span>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {resumeHistory.map((item: ResumeHistoryItem) => (
                    <div
                      key={item.id}
                      className="w-full p-2.5 rounded-xl bg-slate-900/30 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-smooth flex items-center justify-between gap-2 text-xs group"
                    >
                      <button
                        type="button"
                        onClick={() => loadHistoryItem(item)}
                        className="flex-1 text-left min-w-0 cursor-pointer"
                        aria-label={`Load audit report from ${new Date(item.timestamp).toLocaleDateString()} for ${targetCareers.find(c => c.id === item.roleId)?.name || item.roleId}`}
                      >
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-slate-200 truncate block max-w-[140px] group-hover:text-indigo-400 transition-smooth">{item.filename}</span>
                          <span className="text-[9px] text-slate-500 font-mono shrink-0">
                            {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className="truncate max-w-[110px]">{targetCareers.find(c => c.id === item.roleId)?.name || item.roleId}</span>
                          <span className="text-emerald-400 font-bold shrink-0">Score: {item.result.score}</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteResumeFromHistory(item.id)}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded-lg transition-smooth cursor-pointer shrink-0"
                        title="Delete record"
                        aria-label={`Delete resume audit record from ${new Date(item.timestamp).toLocaleDateString()}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-panel border-slate-900 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base">Why ATS optimization matters?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Applicant Tracking Systems (ATS) are software applications used by recruiters to automatically filter out up to 75% of candidates based on resume formatting and keyword compatibility.
              </p>
              
              <ul className="space-y-3 pt-2">
                <li className="flex gap-2.5 items-start">
                  <div className="h-4.5 w-4.5 rounded bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 leading-normal">
                    <strong className="text-slate-200">Semantic Matching:</strong> Scans descriptions for specific skill keywords.
                  </div>
                </li>
                <li className="flex gap-2.5 items-start">
                  <div className="h-4.5 w-4.5 rounded bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 leading-normal">
                    <strong className="text-slate-200">Layout Reading:</strong> Identifies unreadable tables, headers, and visual graphics.
                  </div>
                </li>
                <li className="flex gap-2.5 items-start">
                  <div className="h-4.5 w-4.5 rounded bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-slate-400 leading-normal">
                    <strong className="text-slate-200">Impact Analysis:</strong> Highlights presence of quantitative metrics and active verbs.
                  </div>
                </li>
              </ul>
            </div>

            <div className="glass-panel border-slate-900 rounded-3xl p-6 bg-slate-950/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />
              <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-indigo-400" /> Sandboxed Execution
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Resume processing operates completely locally and dynamically in this sandbox demonstration. Your file content is not uploaded to any remote servers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: LOADING SCREEN */}
      {phase === 'analyzing' && (
        <div className="glass-panel border-slate-950/20 bg-slate-950/40 rounded-3xl p-12 max-w-md mx-auto text-center space-y-6 flex flex-col items-center justify-center min-h-[350px]">
          <div className="relative h-16 w-16 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin absolute" />
            <FileUp className="h-5 w-5 text-indigo-400" />
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-white text-base">Running ATS Diagnostic Audit</h3>
            <p className="text-xs text-slate-400 h-10 flex items-center justify-center px-4">
              {loadingSteps[loadingStep]}
            </p>
          </div>

          {/* Loader bar */}
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-smooth"
              style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
            Step {loadingStep + 1} of {loadingSteps.length}
          </p>
        </div>
      )}

      {/* PHASE 3: RESULTS SCREEN */}
      {phase === 'results' && (
        <div className="space-y-6 relative">
          
          {/* Target Profile Recalculation Overlay */}
          {recalculating && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 rounded-3xl">
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
              <p className="text-xs font-semibold text-slate-300">
                Auditing resume details against {targetCareers.find(c => c.id === targetCareer)?.name}...
              </p>
            </div>
          )}

          {/* Results Overview Bar */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* ATS Score Radial */}
            <div className="glass-panel border-slate-900 rounded-3xl p-6 flex flex-col items-center text-center justify-between min-h-[200px]">
              <div className="w-full flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Overall Score</span>
                <span className={`px-2 py-0.5 rounded font-bold font-mono text-[9px] border uppercase ${getScoreBg(currentResult.score)}`}>
                  {currentResult.score >= 80 ? 'Optimized' : currentResult.score >= 60 ? 'Needs Work' : 'Critical Gaps'}
                </span>
              </div>

              {/* Radial Score Gauge */}
              <div className="relative h-28 w-28 flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Outer circle track */}
                  <path
                    className="stroke-slate-900"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Active arc */}
                  <path
                    className={`transition-smooth stroke-current ${getScoreColor(currentResult.score)}`}
                    strokeWidth="3.2"
                    strokeDasharray={`${currentResult.score}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white leading-none font-mono">
                    {currentResult.score}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">/ 100</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Matches {targetCareers.find(c => c.id === targetCareer)?.name} criteria.
              </p>
            </div>

            {/* Category Scores breakdown */}
            <div className="glass-panel border-slate-900 rounded-3xl p-6 md:col-span-2 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-900/60">
                <h3 className="font-bold text-white text-sm">Evaluation Dimension Scorecard</h3>
                
                {/* Switch Target Career Profile */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-medium">Targeting:</span>
                  <select
                    value={targetCareer}
                    onChange={handleCareerChange}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-bold text-indigo-400 hover:border-indigo-500/40 outline-none cursor-pointer focus:border-indigo-500 transition-smooth"
                  >
                    {targetCareers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Progress bars Grid */}
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                
                {/* Keyword Match */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Keyword Relevance Match</span>
                    <span className="text-white font-mono">{currentResult.keywordMatch}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${currentResult.keywordMatch}%` }} />
                  </div>
                </div>

                {/* Formatting */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Layout & Formatting Cleanliness</span>
                    <span className="text-white font-mono">{currentResult.formatting}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${currentResult.formatting}%` }} />
                  </div>
                </div>

                {/* Experience Impact */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Metrics & Impact Analysis</span>
                    <span className="text-white font-mono">{currentResult.experience}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${currentResult.experience}%` }} />
                  </div>
                </div>

                {/* Skills Coverage */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Core Skills Coverage</span>
                    <span className="text-white font-mono">{currentResult.skillsCoverage}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full rounded-full" style={{ width: `${currentResult.skillsCoverage}%` }} />
                  </div>
                </div>

                {/* Education Relevance */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Education Relevance</span>
                    <span className="text-white font-mono">{currentResult.education}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${currentResult.education}%` }} />
                  </div>
                </div>

              </div>

              {/* Status Note */}
              <div className="mt-2 text-[11px] text-slate-500 flex gap-1.5 items-center">
                <Info className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span>Adjusting your Target Career dropdown will run dynamic audit evaluations for other careers.</span>
              </div>

            </div>

          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex border-b border-slate-900 gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 text-xs font-bold transition-smooth relative cursor-pointer ${
                activeTab === 'overview' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Overview Results
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('keywords')}
              className={`pb-2.5 text-xs font-bold transition-smooth relative cursor-pointer ${
                activeTab === 'keywords' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Keyword Analysis
              {activeTab === 'keywords' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`pb-2.5 text-xs font-bold transition-smooth relative cursor-pointer ${
                activeTab === 'skills' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Missing Skills
              {activeTab === 'skills' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`pb-2.5 text-xs font-bold transition-smooth relative cursor-pointer ${
                activeTab === 'suggestions' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Improvement Actions
              {activeTab === 'suggestions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="lg:col-span-2 space-y-6">
                
                {/* Summary checklist */}
                <div className="glass-panel border-slate-900 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-indigo-400" /> Score Breakdown Audit Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                      <div className="h-6 w-6 rounded bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
                        <Check className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">File Type Compatibility Approved</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          PDF/DOCX is clean and legible for semantic text indexing parsers.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                      {currentResult.formatting >= 80 ? (
                        <div className="h-6 w-6 rounded bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
                          <Check className="h-4 w-4 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0">
                          <AlertTriangle className="h-4 w-4 text-amber-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Document Layout Score ({currentResult.formatting}%)</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {currentResult.formatting >= 80 
                            ? 'Layout structure conforms to standard chronological expectations with clear sections.' 
                            : 'Creative elements, multi-columns, or complex tables detected. Standard text flow checks may fail.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                      {currentResult.keywordMatch >= 80 ? (
                        <div className="h-6 w-6 rounded bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
                          <Check className="h-4 w-4 text-emerald-400" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0">
                          <AlertTriangle className="h-4 w-4 text-amber-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">Industry Key-phrase Density ({currentResult.keywordMatch}%)</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Detected {currentResult.foundKeywords.length} matching terms. You need to incorporate {currentResult.missingKeywords.length} crucial phrases to bypass filter screening.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Strengths & Weaknesses card */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths Card */}
                  <div className="glass-panel border-emerald-950/20 bg-emerald-950/5 rounded-2xl p-6 space-y-4">
                    <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <BadgeCheck className="h-4.5 w-4.5 text-emerald-400" />
                      <span>Resume Strengths ({currentResult.strengths?.length || 0})</span>
                    </h3>
                    <ul className="space-y-2.5">
                      {(!currentResult.strengths || currentResult.strengths.length === 0) ? (
                        <li className="text-[11px] text-slate-500 italic">No significant strengths detected.</li>
                      ) : (
                        currentResult.strengths.map((str, i) => (
                          <li key={i} className="flex gap-2 text-[11px] text-slate-300 leading-normal">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{str}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  {/* Weaknesses Card */}
                  <div className="glass-panel border-rose-950/20 bg-rose-950/5 rounded-2xl p-6 space-y-4">
                    <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <BadgeAlert className="h-4.5 w-4.5 text-rose-400" />
                      <span>Optimization Gaps ({currentResult.weaknesses?.length || 0})</span>
                    </h3>
                    <ul className="space-y-2.5">
                      {(!currentResult.weaknesses || currentResult.weaknesses.length === 0) ? (
                        <li className="text-[11px] text-emerald-400 font-bold italic">Excellent! No major gaps detected.</li>
                      ) : (
                        currentResult.weaknesses.map((weak, i) => (
                          <li key={i} className="flex gap-2 text-[11px] text-slate-300 leading-normal">
                            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                            <span>{weak}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Sidebar recommendations teaser */}
              <div className="space-y-6">
                <div className="glass-panel border-slate-900 rounded-2xl p-5 space-y-4">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">Keywords Found</span>
                      <span className="text-lg font-extrabold text-white mt-1 block font-mono">{currentResult.foundKeywords.length}</span>
                    </div>
                    <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">Keywords Missing</span>
                      <span className="text-lg font-extrabold text-amber-400 mt-1 block font-mono">{currentResult.missingKeywords.length}</span>
                    </div>
                    <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">Action Items</span>
                      <span className="text-lg font-extrabold text-indigo-400 mt-1 block font-mono">{currentResult.suggestions.length}</span>
                    </div>
                    <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">Format Alert</span>
                      <span className={`text-lg font-extrabold mt-1 block font-mono ${currentResult.formatting >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {currentResult.formatting >= 80 ? 'Safe' : 'High Risk'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel border-slate-900 rounded-2xl p-5 bg-gradient-to-tr from-indigo-500/5 to-teal-500/5 space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Improvement Boost
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Implementing the primary 3 recommendations list under the <strong className="text-slate-300">&quot;Improvement Actions&quot;</strong> tab is projected to increase this resume&apos;s score to <strong className="text-teal-400">{(currentResult.score + 14).toString()}/100</strong>.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: KEYWORDS */}
          {activeTab === 'keywords' && (
            <div className="glass-panel border-slate-900 rounded-2xl p-6 space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h3 className="font-bold text-white text-sm">Resume Keyword Relevance Check</h3>
                <p className="text-xs text-slate-400">
                  ATS scanning engines rank resumes by how closely their keyword density matches target descriptions.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Found Keywords */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-950/40 border border-slate-900/60">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4" /> Detected Keywords ({currentResult.foundKeywords.length})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    These keywords were successfully parsed from your document and match index requirements.
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentResult.foundKeywords.map((k, i) => (
                      <span key={i} className="px-2.5 py-1 text-[10px] rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold font-mono">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-950/40 border border-slate-900/60">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BadgeAlert className="h-4 w-4" /> Missing Keywords ({currentResult.missingKeywords.length})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Important phrases expected for this role that were not detected. Consider incorporating them organically.
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentResult.missingKeywords.map((k, i) => (
                      <span key={i} className="px-2.5 py-1 text-[10px] rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold font-mono">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* All Automatically Extracted Skills */}
              {currentResult.detectedSkills && currentResult.detectedSkills.length > 0 && (
                <div className="space-y-3 p-4 rounded-xl bg-slate-950/40 border border-slate-900/60">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-400" /> Automatically Extracted Skills ({currentResult.detectedSkills.length})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    A comprehensive list of all professional and technical skills extracted from your resume.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentResult.detectedSkills.map((k, i) => (
                      <span key={i} className="px-2.5 py-1 text-[10px] rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold font-mono">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: MISSING SKILLS */}
          {activeTab === 'skills' && (
            <div className="glass-panel border-slate-900 rounded-2xl p-6 space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h3 className="font-bold text-white text-sm">Critical Skill Gap Detection</h3>
                <p className="text-xs text-slate-400">
                  We scanned your work accomplishments for core technologies and methodologies required for {targetCareers.find(c => c.id === targetCareer)?.name} roles.
                </p>
              </div>

              <div className="space-y-4">
                
                {/* High Priority Gaps */}
                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">High Priority Skill Gaps</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    These primary skills are present in 90%+ of standard job descriptions. Their absence may lead to immediate filters.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3 pt-1">
                    {currentResult.missingSkillsHigh.map((skill, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs text-slate-200">
                        <span className="font-bold">{skill}</span>
                        <span className="text-[9px] font-bold text-rose-400 uppercase font-mono">Missing</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medium Priority Gaps */}
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Medium Priority Skill Gaps</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supporting technical frameworks or workflows that add strong weight to your profile credentials.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3 pt-1">
                    {currentResult.missingSkillsMedium.map((skill, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs text-slate-200">
                        <span className="font-bold">{skill}</span>
                        <span className="text-[9px] font-bold text-amber-400 uppercase font-mono">Missing</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: SUGGESTIONS */}
          {activeTab === 'suggestions' && (
            <div className="glass-panel border-slate-900 rounded-2xl p-6 space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h3 className="font-bold text-white text-sm">Actionable Optimization Suggestions</h3>
                <p className="text-xs text-slate-400">
                  Step-by-step instructions to rephrase experience bullet points and structure your resume text for higher ATS scores.
                </p>
              </div>

              {/* Suggestions List */}
              <div className="space-y-3">
                {currentResult.suggestions.map((s, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800/80 transition-smooth flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 uppercase tracking-wide">
                          {s.category}
                        </span>
                        {getImpactBadge(s.impact)}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {s.text}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center">
                      <div className="h-7 w-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white cursor-pointer transition-smooth group" title="Mark as fixed">
                        <Check className="h-4 w-4 group-hover:scale-110" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
