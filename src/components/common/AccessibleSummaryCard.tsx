import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export interface AccessibleSummaryCardProps {
  id: string;
  title: string;
  value: string;
  formattedSubtitle?: string;
  badgeLabel?: string;
  statusType?: 'success' | 'warning' | 'info' | 'neutral';
  statusText?: string;
  methodologyNote?: string;
  isHero?: boolean;
  ariaLive?: 'polite' | 'assertive' | 'off';
  children?: React.ReactNode;
}

export const AccessibleSummaryCard: React.FC<AccessibleSummaryCardProps> = ({
  id,
  title,
  value,
  formattedSubtitle,
  badgeLabel,
  statusType = 'neutral',
  statusText,
  methodologyNote,
  isHero = false,
  ariaLive = 'polite',
  children,
}) => {
  const cardTitleId = `${id}-card-title`;
  const cardValueId = `${id}-card-value`;

  // WCAG AA Compliant Hero vs Standard Card Styling
  if (isHero) {
    return (
      <section
        aria-labelledby={cardTitleId}
        className="bg-gradient-to-br from-[#062013] via-[#0b331f] to-[#04170d] rounded-3xl p-6 sm:p-7 text-white border border-emerald-800 shadow-md relative overflow-hidden"
      >
        <div className="relative space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-bold text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span id={cardTitleId}>{title}</span>
            </span>
            {badgeLabel && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-900/90 border border-emerald-400/30 text-emerald-200 font-bold">
                {badgeLabel}
              </span>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-emerald-200 leading-snug">
              Primary Estimated Requirement
            </p>
            <div
              className="flex items-baseline gap-2 mt-1 flex-wrap"
              aria-live={ariaLive}
              aria-atomic="true"
            >
              <output id={cardValueId} className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {value}
              </output>
              {formattedSubtitle && (
                <span className="text-sm sm:text-base font-extrabold text-emerald-400">
                  ({formattedSubtitle})
                </span>
              )}
            </div>
          </div>

          {/* Status Indicator (Text + Icon for color blind support) */}
          {statusText && (
            <div className="flex items-center gap-2 pt-2 border-t border-emerald-800/60 text-xs font-bold text-emerald-200">
              {statusType === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              )}
              <span>{statusText}</span>
            </div>
          )}

          {methodologyNote && (
            <p className="text-[11px] text-emerald-200/90 leading-relaxed border-t border-emerald-800/60 pt-2">
              <strong>Methodology:</strong> {methodologyNote}
            </p>
          )}

          {children}
        </div>
      </section>
    );
  }

  // Standard Accessible Card Styling
  return (
    <article
      aria-labelledby={cardTitleId}
      className="p-4 sm:p-5 bg-white border border-slate-300 rounded-2xl shadow-2xs space-y-2 hover:border-emerald-600 transition-colors"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 id={cardTitleId} className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          {title}
        </h3>
        {badgeLabel && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700">
            {badgeLabel}
          </span>
        )}
      </div>

      <div aria-live={ariaLive} aria-atomic="true">
        <output id={cardValueId} className="text-lg sm:text-xl font-extrabold text-slate-900 block">
          {value}
        </output>
      </div>

      {formattedSubtitle && (
        <p className="text-xs font-semibold text-slate-600">
          {formattedSubtitle}
        </p>
      )}

      {statusText && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 pt-1">
          {statusType === 'warning' ? (
            <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
          )}
          <span>{statusText}</span>
        </div>
      )}

      {methodologyNote && (
        <p className="text-[11px] text-slate-600 leading-normal border-t border-slate-200 pt-2 mt-1">
          {methodologyNote}
        </p>
      )}

      {children}
    </article>
  );
};
