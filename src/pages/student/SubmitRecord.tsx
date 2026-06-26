import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, FileText, X, CheckCircle2, ChevronRight, Save } from 'lucide-react';
import { subjects } from '../../data/mockData';
import Button from '../../components/ui/Button';
import { useDashboard } from '../../hooks/useDashboard';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function SubmitRecord() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refreshData, submitRecord } = useDashboard();
  const { user } = useAuth();

  // Set document title
  useEffect(() => {
    document.title = "RecordFlow — Submit Record";
  }, []);

  // Form states
  const [subjectId, setSubjectId] = useState(subjects[0].id);
  const [expNo, setExpNo] = useState(1);
  const [faculty, setFaculty] = useState(subjects[0].faculty);
  const [submissionType, setSubmissionType] = useState('Lab Record');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-fill faculty based on subject selection
  useEffect(() => {
    const matchedSubject = subjects.find((s) => s.id === subjectId);
    if (matchedSubject) {
      setFaculty(matchedSubject.faculty);
    }
  }, [subjectId]);

  // Handle Drag Events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (!user) throw new Error('Not authenticated');

      let filePath = '';
      if (isSupabaseConfigured) {
        // 1. Upload file to Supabase Storage
        const timestamp = Date.now();
        filePath = `${user.id}/${subjectId}/${expNo}_${timestamp}.pdf`;

        const { data: fileData, error: uploadError } = await supabase.storage
          .from('records')
          .upload(filePath, file, {
            contentType: 'application/pdf',
            upsert: false,
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
      } else {
        filePath = `mock/${user.id}/${subjectId}/${expNo}_${Date.now()}.pdf`;
      }

      // 2. Insert submission (using dashboard context submitRecord helper which handles both Supabase and LocalStorage modes)
      const res = await submitRecord(
        subjectId,
        Number(expNo),
        title,
        notes,
        filePath,
        formatFileSize(file.size)
      );

      if (!res.success) {
        throw new Error(res.error || 'Submission failed');
      }

      // 3. Success
      setIsSuccess(true);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setNotes('');
    setFile(null);
    setIsSuccess(false);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-12 items-center">
      <div className="w-full max-w-[640px] flex flex-col gap-2">
        <h2 className="text-xl font-bold font-satoshi text-white text-center md:text-left">
          Submit a Record
        </h2>
        <p className="text-[13px] text-[#475569] font-satoshi text-center md:text-left">
          Upload your lab work and assign it to the right faculty
        </p>
      </div>

      <div className="w-full max-w-[640px] relative">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* SUCCESS STATE DISPLAY */
            <motion.div
              key="success-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="bg-[#090B14] border border-white/[0.06] rounded-[16px] p-8 flex flex-col items-center text-center shadow-xl relative z-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.05, 1] }}
                transition={{ duration: 0.4, type: 'spring' }}
                className="w-16 h-16 rounded-full bg-[#22C55E]/10 flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
              </motion.div>

              <h3 className="text-2xl font-bold font-satoshi text-white mb-2">
                Record submitted!
              </h3>
              <p className="text-[14px] text-[#64748B] font-satoshi mb-8 max-w-xs leading-normal">
                {faculty} will be notified to review and grade your submission.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={resetForm}
                  className="rounded-[10px] text-xs font-semibold px-6 cursor-pointer select-none"
                  data-interactive="true"
                >
                  Submit another
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  showArrow
                  onClick={() => navigate('/student/records')}
                  className="rounded-[10px] text-xs font-semibold px-6 cursor-pointer select-none"
                  data-interactive="true"
                >
                  View my records
                </Button>
              </div>
            </motion.div>
          ) : (
            /* ACTUAL FORM WIZARD */
            <motion.form
              key="form-container"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6 w-full bg-[#090B14]/40 border border-white/[0.04] p-6 md:p-8 rounded-[16px]"
            >
              {/* Step 1: Experiment Details */}
              <div className="flex flex-col gap-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-satoshi">
                  Step 1 — Experiment Details
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Subject selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-slate-400 tracking-[0.5px] uppercase font-satoshi select-none">
                      Subject / Lab
                    </label>
                    <select
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      className="w-full bg-[#090B14] text-[#F8FAFC] font-satoshi text-[14px] rounded-[10px] py-[13px] px-3.5 border border-white/8 outline-none focus:border-accent-blue/50 focus:ring-3 focus:ring-accent-blue/10 transition-all select-none cursor-pointer"
                      data-interactive="true"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#050816]">
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experiment Number */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-slate-400 tracking-[0.5px] uppercase font-satoshi select-none">
                      Experiment No.
                    </label>
                    <select
                      value={expNo}
                      onChange={(e) => setExpNo(Number(e.target.value))}
                      className="w-full bg-[#090B14] text-[#F8FAFC] font-satoshi text-[14px] rounded-[10px] py-[13px] px-3.5 border border-white/8 outline-none focus:border-accent-blue/50 focus:ring-3 focus:ring-accent-blue/10 transition-all select-none cursor-pointer"
                      data-interactive="true"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num} className="bg-[#050816]">
                          Experiment {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Faculty Selector (Pre-filled, editable) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-slate-400 tracking-[0.5px] uppercase font-satoshi select-none">
                      Faculty Evaluator
                    </label>
                    <input
                      type="text"
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      className="w-full bg-[#090B14] text-[#F8FAFC] font-satoshi text-[14px] rounded-[10px] py-[13px] px-3.5 border border-white/8 outline-none focus:border-accent-blue/50 focus:ring-3 focus:ring-accent-blue/10 transition-all"
                    />
                  </div>

                  {/* Submission Type */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-slate-400 tracking-[0.5px] uppercase font-satoshi select-none">
                      Submission Type
                    </label>
                    <select
                      value={submissionType}
                      onChange={(e) => setSubmissionType(e.target.value)}
                      className="w-full bg-[#090B14] text-[#F8FAFC] font-satoshi text-[14px] rounded-[10px] py-[13px] px-3.5 border border-white/8 outline-none focus:border-accent-blue/50 focus:ring-3 focus:ring-accent-blue/10 transition-all select-none cursor-pointer"
                      data-interactive="true"
                    >
                      {['Lab Record', 'Assignment', 'Mini Project'].map((t) => (
                        <option key={t} value={t} className="bg-[#050816]">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Experiment Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-slate-400 tracking-[0.5px] uppercase font-satoshi select-none">
                    Experiment Title / Aim
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AVL Tree insertion and deletion with C++"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#090B14] text-[#F8FAFC] font-satoshi text-[14px] rounded-[10px] py-[13px] px-3.5 border border-white/8 outline-none focus:border-accent-blue/50 focus:ring-3 focus:ring-accent-blue/10 transition-all"
                  />
                </div>
              </div>

              {/* Step 2: File Upload */}
              <div className="flex flex-col gap-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-satoshi">
                  Step 2 — File Upload
                </span>

                {/* Hidden input trigger */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                  className="hidden"
                />

                {/* Dropzone */}
                <motion.div
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  animate={{
                    scale: isDragOver ? 1.01 : 1,
                    borderColor: isDragOver ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.25)',
                    backgroundColor: isDragOver ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'
                  }}
                  transition={{ duration: 0.2 }}
                  className="border-[1.5px] border-dashed rounded-[14px] py-10 px-6 flex flex-col items-center justify-center text-center cursor-pointer select-none"
                  data-interactive="true"
                >
                  <UploadCloud className="w-9 h-9 text-[#3B82F6] mb-3" />
                  <p className="text-sm font-medium text-slate-300 font-satoshi mb-1">
                    Drop your file here or <span className="text-[#3B82F6]">click to browse</span>
                  </p>
                  <p className="text-xs text-[#475569] font-satoshi">
                    PDF, DOCX — max 20MB
                  </p>
                </motion.div>

                {/* Selected File Preview card */}
                <AnimatePresence>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-[#3B82F6]/5 border border-[#3B82F6]/15 rounded-[10px] p-3 flex items-center justify-between gap-4 font-satoshi"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-accent-blue/15 flex items-center justify-center text-accent-blue flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        data-interactive="true"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Optional Notes Textarea */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[12px] font-medium text-slate-400 tracking-[0.5px] uppercase font-satoshi select-none">
                    Any notes for the faculty? (optional)
                  </label>
                  <textarea
                    rows={3}
                    maxLength={300}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#090B14] border border-white/[0.06] rounded-[10px] p-3.5 text-[14px] text-[#F8FAFC] font-satoshi placeholder-slate-600 focus:border-accent-blue/50 outline-none resize-none transition-colors duration-200"
                    placeholder="Enter any implementation remarks, assumptions, or references here..."
                  />
                  <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-600 font-satoshi select-none">
                    {notes.length} / 300
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col gap-2 mt-2 w-full">
                <div className="flex items-center gap-4 w-full">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    disabled={!file || !title || isSubmitting}
                    className="flex-1 h-11 rounded-[10px] text-xs font-semibold select-none cursor-pointer flex items-center justify-center"
                    data-interactive="true"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Record'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/student/records')}
                    className="h-11 rounded-[10px] text-xs font-semibold select-none cursor-pointer px-5"
                    data-interactive="true"
                  >
                    <span className="flex items-center gap-1.5">
                      <Save className="w-3.5 h-3.5" />
                      Save as draft
                    </span>
                  </Button>
                </div>
                {error && (
                  <p className="text-red-400 text-sm mt-2 font-satoshi text-center md:text-left">{error}</p>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
