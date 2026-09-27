import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
  onSecondary?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sparkles,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryLabel,
  secondaryHref,
  onSecondary,
  className = '',
}) => {
  return (
    <div className={`text-center py-16 px-6 border border-dashed border-[#dadbdd] rounded-xl bg-[#fafafa] max-w-2xl mx-auto my-8 ${className}`}>
      <div className="w-14 h-14 rounded-full bg-white border border-[#e4e5e7] flex items-center justify-center mx-auto mb-4 text-[#1dbf73] shadow-xs">
        <Icon className="w-7 h-7 stroke-[1.75]" />
      </div>
      <h3 className="text-lg font-bold text-[#222325] tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#74767e] max-w-md mx-auto leading-relaxed mb-6 font-normal">
        {description}
      </p>

      {(actionLabel || secondaryLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionLabel && (
            actionHref ? (
              <a
                href={actionHref}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-md transition-colors shadow-xs"
              >
                {actionLabel}
              </a>
            ) : (
              <button
                type="button"
                onClick={onAction}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#1dbf73] hover:bg-[#19a463] rounded-md transition-colors shadow-xs cursor-pointer"
              >
                {actionLabel}
              </button>
            )
          )}

          {secondaryLabel && (
            secondaryHref ? (
              <a
                href={secondaryHref}
                className="px-5 py-2.5 text-xs font-semibold text-[#404145] bg-white hover:bg-[#f5f5f5] border border-[#dadbdd] rounded-md transition-colors"
              >
                {secondaryLabel}
              </a>
            ) : (
              <button
                type="button"
                onClick={onSecondary}
                className="px-5 py-2.5 text-xs font-semibold text-[#404145] bg-white hover:bg-[#f5f5f5] border border-[#dadbdd] rounded-md transition-colors cursor-pointer"
              >
                {secondaryLabel}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};
