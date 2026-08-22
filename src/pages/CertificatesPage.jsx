import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, CheckCircle, Search, Printer, Sparkles, ExternalLink, BookOpen, Loader2 } from 'lucide-react';
import enrollmentService from '../services/enrollmentService';
import Sidebar from '../components/Sidebar';
import CertificateModal from '../components/CertificateModal';
import Badge from '../components/Badge';
import toast from 'react-hot-toast';

export const CertificatesPage = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected Certificate to view
  const [selectedCert, setSelectedCert] = useState(null);

  // Certificate ID verification search
  const [verifyId, setVerifyId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const data = await enrollmentService.getMyEnrollments();
      const completed = (data.enrollments || []).filter((e) => e.isCompleted || e.progressPercentage === 100);
      setEnrollments(completed);
    } catch (error) {
      console.error('Failed to load certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verifyId.trim()) return;

    setVerifying(true);
    setVerifiedResult(null);
    try {
      const data = await enrollmentService.getCertificate(verifyId.trim());
      setVerifiedResult(data.certificate);
      toast.success('Valid certificate record found!');
    } catch (error) {
      toast.error('No matching certificate record found with this ID');
      setVerifiedResult(null);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <Sidebar type="student" />

      <main className="flex-1 p-6 sm:p-10 space-y-10 overflow-y-auto max-w-6xl">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="amber" size="sm">
              <Award className="w-3 h-3 text-amber-400" />
              <span>ACCREDITED CREDENTIALS</span>
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            My Earned Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Showcase and print your official verified certificates of completion.
          </p>
        </div>

        {/* Earned Certificates Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Your Achievements</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((n) => (
                <div key={n} className="glass-card rounded-2xl h-48 animate-pulse bg-slate-800/40" />
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="glass-panel p-8 rounded-3xl text-center space-y-3">
              <Award className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No certificates earned yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Complete 100% of the video lessons in any enrolled course to automatically unlock your verified certificate.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enr) => {
                const c = enr.course;
                if (!c) return null;

                const certData = {
                  studentName: user?.name,
                  courseTitle: c.title,
                  instructorName: c.instructor?.name || 'Lead Instructor',
                  certificateId: enr.certificateId || `LMS-CERT-${enr._id.slice(-6).toUpperCase()}`,
                  issuedDate: enr.completedAt || enr.updatedAt
                };

                return (
                  <div
                    key={enr._id}
                    className="glass-card p-6 rounded-2xl border border-amber-500/20 flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <Badge variant="amber" size="sm">
                          VERIFIED CREDENTIAL
                        </Badge>
                        <h3 className="text-base font-bold text-white pt-1">{c.title}</h3>
                        <p className="text-xs text-slate-400">Instructor: {c.instructor?.name}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                        <Award className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500 font-mono">
                        ID: <span className="text-slate-300 font-bold">{certData.certificateId}</span>
                      </div>
                      <button
                        onClick={() => setSelectedCert(certData)}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View & Print</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Public Certificate Verification Tool */}
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Public Certificate Verification</h3>
            <p className="text-xs text-slate-400">
              Verify the authenticity of any LearnPulse certificate by entering the unique Certificate ID.
            </p>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. LMS-CERT-2026-AI9988X"
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 uppercase placeholder:normal-case focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={verifying}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-glow flex items-center justify-center gap-2"
            >
              {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Verify Certificate</span>
            </button>
          </form>

          {verifiedResult && (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle className="w-5 h-5" />
                <span>Authentic Verified LearnPulse Certificate</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300 pt-2">
                <div>
                  <p className="text-slate-500">Student</p>
                  <p className="font-bold text-white">{verifiedResult.studentName}</p>
                </div>
                <div>
                  <p className="text-slate-500">Course</p>
                  <p className="font-bold text-white">{verifiedResult.courseTitle}</p>
                </div>
                <div>
                  <p className="text-slate-500">Instructor</p>
                  <p className="font-bold text-white">{verifiedResult.instructorName}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          isOpen={Boolean(selectedCert)}
          onClose={() => setSelectedCert(null)}
          certificateData={selectedCert}
        />
      )}
    </div>
  );
};

export default CertificatesPage;
