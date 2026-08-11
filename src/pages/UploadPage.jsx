import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Image as ImageIcon, Video, FileCode,
  CheckCircle2, Sparkles, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { RightSidebar } from '../components/layout/RightSidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const UploadPage = () => {
  const { setActiveTab, addXP } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [fileType, setFileType] = useState('notes');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [tags, setTags] = useState('Algorithm, Tree, Graph');
  const [isPublishing, setIsPublishing] = useState(false);

  const fileTypes = [
    { id: 'notes', label: 'Notes / Markdown', icon: FileText, desc: 'Write formatted markdown notes or paste content.' },
    { id: 'image', label: 'Diagram / Image', icon: ImageIcon, desc: 'Upload PNG, JPG, SVG visual diagrams.' },
    { id: 'pdf', label: 'Lecture PDF', icon: FileCode, desc: 'Upload slide decks or textbook chapters.' },
    { id: 'video', label: 'Short Video', icon: Video, desc: 'Upload 1–3 minute educational explanations.' },
  ];

  const steps = [
    { n: 1, label: 'Choose Format' },
    { n: 2, label: 'Preview' },
    { n: 3, label: 'Metadata' },
    { n: 4, label: 'AI Check' },
  ];

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      addXP(200);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setActiveTab('feed');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-4 sm:p-8 max-w-3xl mx-auto w-full space-y-8 overflow-y-auto pb-24 md:pb-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">Upload Educational Note</h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">Share knowledge with 250,000+ students and earn <span className="font-bold text-[#4F7DF6]">+200 XP</span>.</p>
          </div>

          {/* Step Progress Bar */}
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <React.Fragment key={s.n}>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                    currentStep > s.n
                      ? 'bg-[#4F7DF6] border-[#4F7DF6] text-white'
                      : currentStep === s.n
                      ? 'bg-[#EEF4FF] border-[#4F7DF6] text-[#4F7DF6]'
                      : 'bg-[#F5F7FB] border-[#E2E8F0] text-[#94A3B8]'
                  }`}>
                    {currentStep > s.n ? <CheckCircle2 className="w-4 h-4" strokeWidth={2} /> : s.n}
                  </div>
                  <span className={`text-[10px] font-semibold whitespace-nowrap ${currentStep === s.n ? 'text-[#4F7DF6]' : 'text-[#94A3B8]'}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mt-[-18px] ${currentStep > s.n ? 'bg-[#4F7DF6]' : 'bg-[#E2E8F0]'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Wizard Steps */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-5">
                <h3 className="text-lg font-bold text-[#1E293B]">Select Content Format</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fileTypes.map((item) => {
                    const Icon = item.icon;
                    const isSelected = fileType === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setFileType(item.id)}
                        className={`p-4 rounded-[16px] border-2 cursor-pointer transition-all flex items-center gap-4 ${
                          isSelected ? 'border-[#4F7DF6] bg-[#EEF4FF]' : 'border-[#E2E8F0] bg-white hover:border-[#4F7DF6]/30 hover:bg-[#F5F7FB]'
                        }`}
                      >
                        <div className={`p-3 rounded-[12px] ${isSelected ? 'bg-[#4F7DF6] text-white' : 'bg-[#F5F7FB] text-[#64748B] border border-[#E2E8F0]'}`}>
                          <Icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#1E293B]">{item.label}</h4>
                          <p className="text-xs text-[#64748B]">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-8 border-2 border-dashed border-[#E2E8F0] rounded-[20px] text-center space-y-3 hover:border-[#4F7DF6] cursor-pointer transition-colors bg-white">
                  <div className="w-12 h-12 rounded-[14px] bg-[#EEF4FF] text-[#4F7DF6] mx-auto flex items-center justify-center border border-[#E2E8F0]">
                    <Upload className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <p className="text-sm font-bold text-[#1E293B]">Click or Drag & Drop</p>
                  <p className="text-xs text-[#94A3B8]">Supports Markdown, PNG, JPG, PDF up to 50MB</p>
                </div>

                <div className="flex justify-end">
                  <Button variant="primary" icon={ArrowRight} onClick={() => setCurrentStep(2)}>Next: Preview</Button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-5">
                <h3 className="text-lg font-bold text-[#1E293B]">Content Preview</h3>
                <Card className="space-y-4">
                  <div className="p-4 bg-[#1E293B] rounded-[14px] font-mono text-xs space-y-2 overflow-x-auto">
                    <div className="text-[#4F7DF6] font-bold"># Binary Search Tree — Inorder Traversal</div>
                    <div className="text-slate-300">Inorder traversal visits Left → Root → Right. Result is a sorted array.</div>
                    <div className="text-slate-400 mt-2">{'function inorder(node) {'}</div>
                    <div className="text-slate-300 pl-4">{'if (!node) return;'}</div>
                    <div className="text-slate-300 pl-4">{'inorder(node.left);'}</div>
                    <div className="text-slate-300 pl-4">{'console.log(node.val);'}</div>
                    <div className="text-slate-300 pl-4">{'inorder(node.right);'}</div>
                    <div className="text-slate-400">{'}'}</div>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
                    alt="Code preview"
                    className="w-full h-44 object-cover rounded-[14px] border border-[#E2E8F0]"
                  />
                </Card>
                <div className="flex justify-between">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setCurrentStep(1)}>Back</Button>
                  <Button variant="primary" icon={ArrowRight} onClick={() => setCurrentStep(3)}>Next: Metadata</Button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-5">
                <h3 className="text-lg font-bold text-[#1E293B]">Content Details & Metadata</h3>
                <Card className="space-y-4">
                  <Input label="Title" placeholder="e.g. Master Binary Search Trees in 5 Minutes" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">Educational Caption</label>
                    <textarea
                      rows={4}
                      placeholder="Write a step-by-step breakdown..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full rounded-[14px] bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] focus:bg-white p-3 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F7DF6]/20 transition-all resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">Subject</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-[14px] bg-[#F5F7FB] border border-transparent focus:border-[#4F7DF6] p-3 text-sm text-[#1E293B] focus:outline-none transition-all"
                      >
                        <option>Computer Science</option>
                        <option>Quantum Physics</option>
                        <option>Competitive Exams (UPSC)</option>
                        <option>Medicine & USMLE</option>
                        <option>Design Systems</option>
                      </select>
                    </div>
                    <Input label="Tags" placeholder="Algorithms, BinaryTrees, C++" value={tags} onChange={(e) => setTags(e.target.value)} />
                  </div>
                </Card>
                <div className="flex justify-between">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setCurrentStep(2)}>Back</Button>
                  <Button variant="accent" icon={Sparkles} onClick={() => setCurrentStep(4)}>Run AI Quality Check</Button>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#1E293B]">AI Quality Scorecard</h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#22C55E] text-xs font-extrabold border border-emerald-200/60">
                    Score: 96 / 100 ✨
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="space-y-2">
                    <div className="flex items-center gap-2 text-[#22C55E] font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" strokeWidth={2} /> High Clarity Caption
                    </div>
                    <p className="text-xs text-[#64748B]">Step-by-step logic is accurate and includes clearly defined key terms.</p>
                  </Card>
                  <Card className="space-y-2">
                    <div className="flex items-center gap-2 text-[#8B5CF6] font-bold text-sm">
                      <Sparkles className="w-5 h-5" strokeWidth={2} /> AI Quiz Auto-Generated
                    </div>
                    <p className="text-xs text-[#64748B]">3 practice questions prepared automatically for student reinforcement.</p>
                  </Card>
                </div>
                <div className="flex justify-between">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setCurrentStep(3)}>Back</Button>
                  <Button variant="primary" size="lg" icon={Sparkles} onClick={handlePublish} disabled={isPublishing}>
                    {isPublishing ? 'Publishing...' : 'Publish Note (+200 XP)'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <RightSidebar />
    </div>
  );
};
