import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Sparkles, Image, Video, FileText, CheckCircle2 } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, Input, Textarea, Badge } from '../../components/ui/index.jsx';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export default function UploadImage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [topic, setTopic] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      addToast('Note uploaded & AI Validated! +50 XP', 'success');
      navigate('/feed');
    }, 1200);
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6 pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E293B]">Publish Educational Note</h1>
          <p className="text-sm text-[#64748B]">Share diagrams, infographics, or study handwritten notes with peers.</p>
        </div>

        {/* Upload Mode Switcher */}
        <div className="grid grid-cols-4 gap-2">
          {['Image', 'Reel', 'PDF', 'Notes'].map((mode, i) => (
            <button
              key={mode}
              onClick={() => navigate(`/upload/${mode.toLowerCase()}`)}
              className={`p-3 rounded-[14px] border text-xs font-bold flex flex-col items-center gap-1.5 cursor-pointer transition-all ${i === 0 ? 'bg-[#EEF4FF] border-[#4F7DF6] text-[#4F7DF6]' : 'bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F5F7FB]'}`}
            >
              <Upload className="w-4 h-4" /> {mode}
            </button>
          ))}
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File Dropzone */}
            <div className="border-2 border-dashed border-[#E2E8F0] rounded-[18px] p-8 text-center bg-[#F8FAFC] hover:bg-[#EEF4FF]/40 transition-colors cursor-pointer space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#EEF4FF] text-[#4F7DF6] mx-auto flex items-center justify-center">
                <Image className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#1E293B]">Drag & drop educational image or diagram</p>
              <p className="text-xs text-[#94A3B8]">Supports PNG, JPG, WebP up to 15MB</p>
            </div>

            <Input label="Topic Title" placeholder="e.g. Backpropagation Algorithm Flowchart" value={topic} onChange={e => setTopic(e.target.value)} required />
            <Textarea label="Academic Caption & Key Points" placeholder="Explain the key takeaways for fellow students..." value={caption} onChange={e => setCaption(e.target.value)} rows={4} required />

            <div className="p-4 bg-purple-50 rounded-[14px] border border-purple-100 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#8B5CF6] shrink-0" />
              <p className="text-xs text-[#8B5CF6]">StudyVerse AI will automatically check this note for factual accuracy and generate a 3-question quiz upon publication.</p>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
              {loading ? 'Validating via AI...' : 'Publish to Feed (+50 XP)'}
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
