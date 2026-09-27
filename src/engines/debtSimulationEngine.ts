/**
 * Multi-Debt Payoff & Arbitrage Simulation Engine
 * Supports Debt Avalanche (Highest APR), Debt Snowball (Lowest Balance),
 * Automatic Payment Rollover Cascades, and 0% Balance Transfer Arbitrage.
 */

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
  customOrder?: number;
}

export interface MonthDebtScheduleEntry {
  month: number;
  dateStr: string;
  debts: Array<{
    id: string;
    name: string;
    startingBalance: number;
    interestAccrued: number;
    paymentApplied: number;
    endingBalance: number;
    isPaidOffThisMonth: boolean;
  }>;
  totalStartingBalance: number;
  totalInterestAccrued: number;
  totalPaymentApplied: number;
  totalEndingBalance: number;
  activeDebtsCount: number;
}

export interface DebtSimulationResult {
  strategy: 'avalanche' | 'snowball' | 'custom';
  name: string;
  totalMonths: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  totalAmountPaid: number;
  isFeasible: boolean;
  schedule: MonthDebtScheduleEntry[];
  debtPayoffDates: Record<string, { month: number; dateStr: string }>;
  history: Array<{ month: number; balance: number }>;
}

export function simulateDebtPayoff(
  debts: DebtItem[],
  extraPayment: number = 0,
  strategy: 'avalanche' | 'snowball' | 'custom' = 'avalanche'
): DebtSimulationResult {
  const totalPrincipal = debts.reduce((sum, d) => sum + (Number(d.balance) || 0), 0);
  if (debts.length === 0 || totalPrincipal <= 0) {
    return {
      strategy,
      name: strategy === 'avalanche' ? 'Debt Avalanche' : 'Debt Snowball',
      totalMonths: 0,
      totalInterestPaid: 0,
      totalPrincipalPaid: 0,
      totalAmountPaid: 0,
      isFeasible: true,
      schedule: [],
      debtPayoffDates: {},
      history: [],
    };
  }

  let workingDebts = debts.map((d) => ({
    id: d.id,
    name: d.name,
    balance: Math.max(0, Number(d.balance) || 0),
    apr: Math.max(0, Number(d.apr) || 0),
    minPayment: Math.max(0, Number(d.minPayment) || 0),
    customOrder: d.customOrder || 0,
  }));

  const schedule: MonthDebtScheduleEntry[] = [];
  const debtPayoffDates: Record<string, { month: number; dateStr: string }> = {};
  const history: Array<{ month: number; balance: number }> = [];
  let cumInterest = 0;
  let cumPaid = 0;
  let month = 0;
  const maxMonths = 600;

  const getTargetDebt = (currentDebts: typeof workingDebts) => {
    const active = currentDebts.filter((d) => d.balance > 0.001);
    if (active.length === 0) return null;
    if (strategy === 'avalanche') {
      return [...active].sort((a, b) => b.apr - a.apr || a.balance - b.balance)[0];
    } else if (strategy === 'snowball') {
      return [...active].sort((a, b) => a.balance - b.balance || b.apr - a.apr)[0];
    } else {
      return [...active].sort((a, b) => (a.customOrder || 0) - (b.customOrder || 0))[0];
    }
  };

  const getMonthDateStr = (mOffset: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + mOffset);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  history.push({ month: 0, balance: totalPrincipal });

  while (workingDebts.some((d) => d.balance > 0.001) && month < maxMonths) {
    month++;
    const dateStr = getMonthDateStr(month);

    let monthTotalInterest = 0;
    let monthTotalPayment = 0;
    let monthStartTotalBal = 0;
    let monthEndTotalBal = 0;

    // 1. Accrue monthly interest
    const debtRecords = workingDebts.map((d) => {
      const startBal = d.balance;
      monthStartTotalBal += startBal;

      if (startBal <= 0.001) {
        return {
          id: d.id,
          name: d.name,
          startingBalance: 0,
          interestAccrued: 0,
          paymentApplied: 0,
          endingBalance: 0,
          isPaidOffThisMonth: false,
        };
      }

      const dpr = d.apr / 100 / 365;
      const interest = startBal * dpr * 30.4375;
      d.balance += interest;
      cumInterest += interest;
      monthTotalInterest += interest;

      return {
        id: d.id,
        name: d.name,
        startingBalance: startBal,
        interestAccrued: interest,
        paymentApplied: 0,
        endingBalance: d.balance,
        isPaidOffThisMonth: false,
      };
    });

    // 2. Pay minimums
    let availableExtraPool = extraPayment;
    workingDebts.forEach((d) => {
      if (d.balance <= 0.001) return;
      const record = debtRecords.find((r) => r.id === d.id)!;
      const payAmount = Math.min(d.minPayment, d.balance);
      d.balance -= payAmount;
      record.paymentApplied += payAmount;
      cumPaid += payAmount;
      monthTotalPayment += payAmount;

      if (d.minPayment > payAmount) {
        availableExtraPool += (d.minPayment - payAmount);
      }

      if (d.balance <= 0.001) {
        d.balance = 0;
        record.isPaidOffThisMonth = true;
        if (!debtPayoffDates[d.id]) {
          debtPayoffDates[d.id] = { month, dateStr };
        }
      }
    });

    // 3. Apply rollover extra payment to target debt
    while (availableExtraPool > 0.01 && workingDebts.some((d) => d.balance > 0.001)) {
      const target = getTargetDebt(workingDebts);
      if (!target) break;

      const record = debtRecords.find((r) => r.id === target.id)!;
      const toApply = Math.min(availableExtraPool, target.balance);

      target.balance -= toApply;
      record.paymentApplied += toApply;
      availableExtraPool -= toApply;
      cumPaid += toApply;
      monthTotalPayment += toApply;

      if (target.balance <= 0.001) {
        target.balance = 0;
        record.isPaidOffThisMonth = true;
        if (!debtPayoffDates[target.id]) {
          debtPayoffDates[target.id] = { month, dateStr };
        }
      }
    }

    workingDebts.forEach((d) => {
      const record = debtRecords.find((r) => r.id === d.id)!;
      record.endingBalance = d.balance;
      monthEndTotalBal += d.balance;
    });

    const activeCount = workingDebts.filter((d) => d.balance > 0.001).length;

    schedule.push({
      month,
      dateStr,
      debts: debtRecords,
      totalStartingBalance: monthStartTotalBal,
      totalInterestAccrued: monthTotalInterest,
      totalPaymentApplied: monthTotalPayment,
      totalEndingBalance: monthEndTotalBal,
      activeDebtsCount: activeCount,
    });

    history.push({ month, balance: Math.max(0, monthEndTotalBal) });
  }

  return {
    strategy,
    name: strategy === 'avalanche' ? 'Debt Avalanche' : 'Debt Snowball',
    totalMonths: month,
    totalInterestPaid: cumInterest,
    totalPrincipalPaid: totalPrincipal,
    totalAmountPaid: cumPaid,
    isFeasible: month < maxMonths,
    schedule,
    debtPayoffDates,
    history,
  };
}

export function evaluateBalanceTransfer(
  debts: Array<{ balance: number; interestRate?: number }>,
  options: {
    transferFeePercent: number;
    promoApr: number;
    promoMonths: number;
    postPromoApr: number;
    monthlyPayment: number;
  }
) {
  const totalBalance = debts.reduce((sum, d) => sum + (Number(d.balance) || 0), 0);
  const fee = (totalBalance * (options.transferFeePercent || 0)) / 100;
  let currentBalance = totalBalance + fee;
  let totalInterest = 0;
  let month = 0;
  const history: Array<{ month: number; balance: number }> = [{ month: 0, balance: currentBalance }];

  const monthlyPay = Math.max(1, options.monthlyPayment || totalBalance / 18);

  while (currentBalance > 0.01 && month < 360) {
    month++;
    const isPromo = month <= options.promoMonths;
    const activeRate = isPromo ? (options.promoApr || 0) / 100 / 12 : (options.postPromoApr || 21.99) / 100 / 12;

    const interest = currentBalance * activeRate;
    totalInterest += interest;
    currentBalance += interest;

    const payment = Math.min(monthlyPay, currentBalance);
    currentBalance -= payment;

    history.push({ month, balance: Math.max(0, currentBalance) });
  }

  return {
    initialPrincipal: totalBalance,
    feeAmount: fee,
    totalInterest,
    totalCost: totalBalance + fee + totalInterest,
    payoffMonths: month,
    history,
  };
}
