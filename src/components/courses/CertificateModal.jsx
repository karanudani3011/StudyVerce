import React, { useRef } from 'react';
import { X, Download, Award, Star } from 'lucide-react';

// ─── Format date helper ────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Certificate Design (A4 Landscape) ────────────────────────────────────
export function CertificateDesign({ certificate, forPrint = false }) {
  const {
    studentName,
    courseName,
    instructorName,
    courseStartDate,
    courseCompletionDate,
    quizCompleted,
    quizScore,
    certificateNumber,
    issuedAt,
  } = certificate;

  return (
    <div
      id="studyverse-certificate"
      style={{
        width: forPrint ? '297mm' : '100%',
        minHeight: forPrint ? '210mm' : undefined,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
        padding: forPrint ? '20mm' : '32px',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        color: '#fff',
      }}
    >
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'radial-gradient(circle at 20% 20%, #4F7DF6 0%, transparent 50%), radial-gradient(circle at 80% 80%, #7C3AED 0%, transparent 50%)',
      }} />
      
      {/* Outer Gold Border */}
      <div style={{
        position: 'absolute', inset: 12,
        border: '2px solid rgba(245,158,11,0.6)',
        borderRadius: 8,
        pointerEvents: 'none',
      }} />
      {/* Inner Gold Border */}
      <div style={{
        position: 'absolute', inset: 18,
        border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: 4,
        pointerEvents: 'none',
      }} />

      {/* Corner Ornaments */}
      {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...(i < 2 ? { top: 24 } : { bottom: 24 }),
          ...(i % 2 === 0 ? { left: 24 } : { right: 24 }),
          width: 32, height: 32,
          border: '2px solid rgba(245,158,11,0.5)',
          borderRadius: 2,
          transform: 'rotate(45deg)',
        }} />
      ))}

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: forPrint ? '8mm' : '20px',
        paddingTop: forPrint ? '4mm' : '8px',
      }}>
        
        {/* Logo / Platform Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 48, height: 48,
            background: 'linear-gradient(135deg, #4F7DF6, #7C3AED)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(79,125,246,0.4)',
          }}>
            <span style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>S</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: forPrint ? '18pt' : 22, fontWeight: 900, letterSpacing: 3, color: '#fff', fontFamily: 'Georgia, serif' }}>
              STUDYVERSE
            </div>
            <div style={{ fontSize: forPrint ? '7pt' : 9, letterSpacing: 4, color: 'rgba(245,158,11,0.9)', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif' }}>
              Educational Platform
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '80%' }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.5))' }} />
          <div style={{ color: 'rgba(245,158,11,0.8)', fontSize: 14 }}>✦</div>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(245,158,11,0.5))' }} />
        </div>

        {/* Certificate Title */}
        <div>
          <div style={{
            fontSize: forPrint ? '11pt' : 13,
            letterSpacing: 6, color: 'rgba(245,158,11,0.9)',
            textTransform: 'uppercase',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 700,
            marginBottom: 8,
          }}>
            Certificate of Completion
          </div>
          <div style={{ fontSize: forPrint ? '8pt' : 11, color: 'rgba(148,163,184,0.9)', fontFamily: 'Arial, sans-serif' }}>
            This certificate is proudly presented to
          </div>
        </div>

        {/* Student Name */}
        <div>
          <div style={{
            fontSize: forPrint ? '28pt' : 38,
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'Georgia, serif',
            letterSpacing: 1,
            lineHeight: 1.1,
            textShadow: '0 2px 20px rgba(79,125,246,0.3)',
          }}>
            {studentName}
          </div>
          <div style={{
            width: '60%', height: 2,
            background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.6), transparent)',
            margin: '8px auto 0',
          }} />
        </div>

        {/* Course Name */}
        <div>
          <div style={{ fontSize: forPrint ? '8pt' : 11, color: 'rgba(148,163,184,0.9)', fontFamily: 'Arial, sans-serif', marginBottom: 6 }}>
            for successfully completing
          </div>
          <div style={{
            fontSize: forPrint ? '16pt' : 20,
            fontWeight: 700,
            color: '#93C5FD',
            fontFamily: 'Georgia, serif',
            maxWidth: 600,
            lineHeight: 1.3,
          }}>
            {courseName}
          </div>
          {instructorName && (
            <div style={{ fontSize: forPrint ? '8pt' : 11, color: 'rgba(148,163,184,0.8)', fontFamily: 'Arial, sans-serif', marginTop: 4 }}>
              Instructor: {instructorName}
            </div>
          )}
        </div>

        {/* Details Row */}
        <div style={{
          display: 'flex', gap: forPrint ? '12mm' : '32px',
          flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: forPrint ? '7pt' : 9, letterSpacing: 2, color: 'rgba(245,158,11,0.7)', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif', marginBottom: 3 }}>
              Course Started
            </div>
            <div style={{ fontSize: forPrint ? '9pt' : 12, color: '#fff', fontWeight: 700, fontFamily: 'Arial, sans-serif' }}>
              {formatDate(courseStartDate)}
            </div>
          </div>

          <div style={{ width: 1, background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: forPrint ? '7pt' : 9, letterSpacing: 2, color: 'rgba(245,158,11,0.7)', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif', marginBottom: 3 }}>
              Completed On
            </div>
            <div style={{ fontSize: forPrint ? '9pt' : 12, color: '#fff', fontWeight: 700, fontFamily: 'Arial, sans-serif' }}>
              {formatDate(courseCompletionDate)}
            </div>
          </div>

          {quizCompleted && quizScore !== null && (
            <>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: forPrint ? '7pt' : 9, letterSpacing: 2, color: 'rgba(245,158,11,0.7)', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif', marginBottom: 3 }}>
                  Final Quiz
                </div>
                <div style={{ fontSize: forPrint ? '9pt' : 12, color: '#34D399', fontWeight: 700, fontFamily: 'Arial, sans-serif' }}>
                  Passed — {quizScore}%
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '80%' }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.3))' }} />
          <div style={{ color: 'rgba(245,158,11,0.5)', fontSize: 12 }}>✦</div>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(245,158,11,0.3))' }} />
        </div>

        {/* Footer: Issued by & Certificate ID */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          width: '100%', maxWidth: 600, flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid rgba(245,158,11,0.4)', paddingTop: 8, width: 160 }}>
              <div style={{ fontSize: forPrint ? '9pt' : 12, fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif' }}>
                StudyVerse
              </div>
              <div style={{ fontSize: forPrint ? '6pt' : 8, color: 'rgba(148,163,184,0.8)', fontFamily: 'Arial, sans-serif', letterSpacing: 1 }}>
                AUTHORIZED ISSUER
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: forPrint ? '6pt' : 8, color: 'rgba(148,163,184,0.6)', fontFamily: 'Arial, sans-serif', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>
              Certificate ID
            </div>
            <div style={{
              fontSize: forPrint ? '8pt' : 11,
              fontFamily: 'monospace',
              color: 'rgba(245,158,11,0.9)',
              letterSpacing: 1,
            }}>
              {certificateNumber}
            </div>
            <div style={{ fontSize: forPrint ? '6pt' : 8, color: 'rgba(148,163,184,0.6)', fontFamily: 'Arial, sans-serif', marginTop: 2 }}>
              Issued: {formatDate(issuedAt)}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid rgba(245,158,11,0.4)', paddingTop: 8, width: 160 }}>
              <div style={{ fontSize: forPrint ? '9pt' : 12, fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif' }}>
                Digital Certificate
              </div>
              <div style={{ fontSize: forPrint ? '6pt' : 8, color: 'rgba(148,163,184,0.8)', fontFamily: 'Arial, sans-serif', letterSpacing: 1 }}>
                VERIFIED & AUTHENTIC
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Certificate Modal ─────────────────────────────────────────────────────
export default function CertificateModal({ certificate, onClose }) {
  const certRef = useRef(null);

  const handleDownloadPDF = async () => {
    try {
      // Use html2canvas + jsPDF approach via window.print
      const sanitizedCourseName = certificate.courseName
        .replace(/[^a-z0-9\s]/gi, '')
        .replace(/\s+/g, '-')
        .slice(0, 50);
      const filename = `StudyVerse-Certificate-${sanitizedCourseName}.pdf`;

      // Create a hidden print-specific window
      const printContent = document.getElementById('studyverse-certificate');
      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (!printWindow) {
        alert('Please allow popups to download the certificate as PDF.');
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${filename}</title>
            <style>
              @page { size: A4 landscape; margin: 0; }
              body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            ${printContent ? printContent.outerHTML : ''}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </scr` + `ipt>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
      onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-[#1E293B] to-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Certificate of Completion</h3>
              <p className="text-xs text-slate-400">ID: {certificate.certificateNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="flex-1 overflow-auto p-4 bg-slate-100">
          <div ref={certRef} className="rounded-xl overflow-hidden shadow-2xl" style={{ maxWidth: 900, margin: '0 auto' }}>
            <CertificateDesign certificate={certificate} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>This certificate is verified by StudyVerse</span>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-[#4F7DF6] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF (A4 Landscape)
          </button>
        </div>
      </div>
    </div>
  );
}
