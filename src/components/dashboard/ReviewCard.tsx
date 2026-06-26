import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Pencil, Loader2, ArrowRight } from 'lucide-react';
import { PendingSubmission } from '../../data/mockData';
import GradeInput from './GradeInput';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';

interface ReviewCardProps {
  submission: PendingSubmission;
  onGradeSubmit: (id: string, grade: number, remarks: string) => void;
}

const ReviewCardComponent = ({ submission, onGradeSubmit }: ReviewCardProps) => {
  const [grade, setGrade] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isValidGrade, setIsValidGrade] = useState(false);
  const [isRemarkExpanded, setIsRemarkExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleViewSubmission = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('records')
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (err: any) {
      console.error('Error generating signed URL:', err);
      alert(`Could not open file: ${err.message || err}`);
    }
  };

  const handleValidationChange = (isValid: boolean) => {
    setIsValidGrade(isValid);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidGrade || isSubmitting) return;

    setIsSubmitting(true);
    // Spinner 1s then call parent grade submission
    setTimeout(() => {
      onGradeSubmit(submission.id, parseFloat(grade), remarks);
    }, 1000);
  };

  // Get initials for profile avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const isWebTech = submission.subjectId === 'web';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, height: 0, transition: { duration: 0.3 } }}
      className="bg-[#090B14] border border-white/[0.06] rounded-[14px] p-5 flex flex-col gap-4 shadow-lg overflow-hidden"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent-blue/15 text-accent-blue text-xs font-bold font-satoshi flex items-center justify-center">
            {getInitials(submission.studentName)}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold text-white font-satoshi">
              {submission.studentName}
            </span>
            <span className="text-[11px] text-[#475569] font-satoshi">
              {submission.rollNo}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Subject Badge */}
          <span className={`text-[10px] font-bold font-satoshi uppercase px-2.5 py-0.5 rounded-full border ${
            isWebTech 
              ? 'bg-[#3B82F6]/10 border-[#3B82F6]/20 text-[#3B82F6]' 
              : 'bg-[#06B6D4]/10 border-[#06B6D4]/20 text-[#06B6D4]'
          }`}>
            {isWebTech ? 'Web Tech' : 'DBMS'}
          </span>

          {/* Days Ago Text */}
          <span className={`text-[12px] font-satoshi ${submission.daysAgo >= 5 ? 'text-[#F59E0B] font-medium' : 'text-[#475569]'}`}>
            {submission.daysAgo} days ago
          </span>
        </div>
      </div>

      {/* Experiment Details */}
      <div className="flex flex-col gap-1 select-none">
        <span className="text-[10px] font-bold text-[#334155] uppercase tracking-wider font-satoshi">
          Exp 0{submission.expNo}
        </span>
        <h4 className="text-sm font-medium text-[#94A3B8] font-satoshi">
          {submission.title}
        </h4>
      </div>

      {/* Student Note (if exists) */}
      {submission.notes && (
        <div className="bg-white/[0.01] border-l-2 border-accent-blue/30 rounded-r-[8px] p-3 text-[13px] text-[#64748B] font-satoshi italic leading-relaxed">
          "{submission.notes}"
        </div>
      )}

      {/* File row */}
      <div className="flex items-center gap-3 select-none">
        <button
          type="button"
          onClick={() => handleViewSubmission(submission.fileName)}
          className="h-8 border border-white/10 hover:border-accent-blue/30 hover:bg-[#3B82F6]/[0.08] px-3 rounded-[6px] text-xs font-semibold font-satoshi text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          data-interactive="true"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View file</span>
        </button>
        <span className="text-[12px] text-[#475569] font-satoshi truncate max-w-[200px]">
          {submission.fileName}
        </span>
        <span className="text-[12px] text-[#334155] font-satoshi font-semibold">
          {submission.fileSize}
        </span>
      </div>

      {/* Bottom Evaluation Row */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="h-px bg-white/[0.05]" />
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-end justify-between gap-4">
            
            {/* Grade input */}
            <GradeInput
              value={grade}
              onChange={setGrade}
              onValidationChange={handleValidationChange}
            />

            {/* Collapsible Remarks Toggle / Textarea inline */}
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-satoshi select-none">
                  Remarks
                </span>
                {!isRemarkExpanded && (
                  <button
                    type="button"
                    onClick={() => setIsRemarkExpanded(true)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#3B82F6] hover:text-[#60A5FA] font-satoshi cursor-pointer"
                    data-interactive="true"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Add remark</span>
                  </button>
                )}
              </div>

              {/* Collapsible content */}
              <motion.div
                initial={false}
                animate={{ height: isRemarkExpanded ? 'auto' : 38 }}
                className="overflow-hidden"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                {isRemarkExpanded ? (
                  <textarea
                    rows={1}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Leave a remark for the student... (optional)"
                    className="w-full bg-[#0B1120] border border-white/[0.06] rounded-[8px] px-3 py-2 text-xs text-[#F8FAFC] font-satoshi placeholder-slate-600 focus:border-accent-blue/50 outline-none resize-none transition-colors"
                  />
                ) : (
                  <div className="w-full bg-white/[0.01] border border-dashed border-white/[0.04] rounded-[8px] px-3 py-2 text-[11px] text-slate-600 font-satoshi select-none">
                    No remarks added. Click "Add remark" to write.
                  </div>
                )}
              </motion.div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={!isValidGrade || isSubmitting}
              className="h-10.5 rounded-[8px] text-xs font-semibold px-4 cursor-pointer select-none flex items-center justify-center flex-shrink-0"
              data-interactive="true"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span className="flex items-center gap-1">
                  Grade <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default React.memo(ReviewCardComponent);
