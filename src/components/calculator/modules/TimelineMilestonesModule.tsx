import React from 'react';
import { Clock, CheckCircle2, Flag, ArrowRight } from 'lucide-react';

interface TimelineMilestonesModuleProps {
  outputs: Array<{
    def: { id: string; label: string };
    formatted: string;
    raw: number | string | boolean;
  }>;
  settings?: {
    title?: string;
  };
}

export const TimelineMilestonesModule: React.FC<TimelineMilestonesModuleProps> = ({
  outputs = [],
  settings = {},
}) => {
  const title = settings.title || 'Key Milestones & Timeline';

  const milestones = [
    {
      period: 'Milestone 1',
      title: 'Initial Phase & Foundation',
      description: 'First 25% of timeline completed. Initial compounding momentum begins.',
      status: 'complete',
    },
    {
      period: 'Milestone 2',
      title: 'Halfway Checkpoint (50%)',
      description: 'Equal distribution between contributions and accrued return/principal balance.',
      status: 'active',
    },
    {
      period: 'Milestone 3',
      title: 'Accelerated Growth (75%)',
      description: 'Exponential compounding outpaces regular baseline installments.',
      status: 'upcoming',
    },
    {
      period: 'Milestone 4',
      title: 'Target Completion (100%)',
      description: 'Full maturity / payoff target achieved.',
      status: 'upcoming',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 sm:p-7 shadow-2xs space-y-6">
      <div className="flex items-center gap-2.5 border-b border-[#f0f0f0] pb-4">
        <div className="w-8 h-8 rounded-lg bg-[#f4fdf8] text-[#1dbf73] flex items-center justify-center border border-[#d8f5e5]">
          <Clock className="w-4 h-4" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-[#222325]">{title}</h2>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e4e5e7]">
        {milestones.map((m, idx) => (
          <div key={idx} className="relative space-y-1">
            <div className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center ${
              m.status === 'complete' ? 'border-[#1dbf73] text-[#1dbf73]' : m.status === 'active' ? 'border-[#1dbf73] bg-[#1dbf73] text-white' : 'border-[#d0d2d6] text-[#95979d]'
            }`}>
              <span className="text-[10px] font-bold">{idx + 1}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#222325]">{m.title}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#fafafa] border border-[#e4e5e7] text-[#74767e]">
                {m.period}
              </span>
            </div>
            <p className="text-xs text-[#62646a] leading-relaxed">{m.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
