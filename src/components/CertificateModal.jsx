import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Download, Printer, Share2, Sparkles, X } from 'lucide-react';
import Modal from './Modal';

export const CertificateModal = ({
  isOpen,
  onClose,
  certificateData
}) => {
  const certRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti explosion
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 }
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 }
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen || !certificateData) return null;

  const {
    studentName = 'Alex Johnson',
    courseTitle = 'Full-Stack Web Development Masterclass',
    instructorName = 'Dr. Angela Vance',
    certificateId = 'LMS-CERT-2026-99X8',
    issuedDate = new Date()
  } = certificateData;

  const formattedDate = new Date(issuedDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl" showClose={false}>
      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Course Completion Certificate</h3>
              <p className="text-xs text-slate-400">Verified official digital credential</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/feed/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition-all shadow-md"
              title="Share on LinkedIn feed"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on LinkedIn</span>
            </a>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div
          id="certificate-print-area"
          ref={certRef}
          className="relative bg-gradient-to-br from-slate-900 via-[#0E131F] to-slate-950 text-slate-100 p-8 sm:p-12 rounded-2xl border-4 border-amber-500/40 shadow-2xl overflow-hidden text-center space-y-6"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400/70 pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400/70 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400/70 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400/70 pointer-events-none" />

          {/* Watermark Crest */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-amber-400" />
          </div>

          {/* Certificate Header */}
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Certificate of Completion</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight pt-2">
              LearnPulse Academy
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest">
              International Online Learning Credential
            </p>
          </div>

          {/* Recipient */}
          <div className="space-y-2 py-4 relative z-10">
            <p className="text-xs text-slate-400 italic">This is proudly presented to</p>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-300 font-serif tracking-wide underline decoration-amber-500/40 underline-offset-8">
              {studentName}
            </h2>
            <p className="text-xs text-slate-400 pt-2 max-w-lg mx-auto leading-relaxed">
              for successfully completing all curriculum modules, practical hands-on assessments, and technical requirements for:
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white pt-1">
              "{courseTitle}"
            </h3>
          </div>

          {/* Footer details & Signatures */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 items-end relative z-10 text-xs">
            <div className="text-left space-y-1">
              <p className="text-slate-500 font-semibold uppercase text-[10px]">Issued Date</p>
              <p className="text-slate-200 font-medium">{formattedDate}</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Official Credential
              </span>
            </div>

            <div className="text-right space-y-1">
              <p className="text-slate-500 font-semibold uppercase text-[10px]">Course Instructor</p>
              <p className="text-slate-200 font-medium">{instructorName}</p>
            </div>
          </div>

          {/* Verification Code */}
          <div className="pt-2 text-[11px] text-slate-500 font-mono">
            Certificate Verification ID: <span className="text-indigo-400 font-semibold">{certificateId}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CertificateModal;
