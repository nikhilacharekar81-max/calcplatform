import React, { useState, useEffect, useRef } from 'react';
import {
  Code,
  Eye,
  Copy,
  Check,
  Download,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  Quote,
  FileCode,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Calculator } from '../../types/schema.ts';

const ENTERPRISE_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50 text-slate-900">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise Indian Income Tax Calculator & White-Label Studio</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Alpine.js for reactive UI state -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <!-- FontAwesome icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        [x-cloak] { display: none !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    </style>
</head>
<body class="h-full font-sans antialiased selection:bg-indigo-600 selection:text-white" x-data="taxCalculatorApp()">

    <header class="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-3 flex items-center justify-between shadow-sm">
        <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md transition-all duration-300" :style="'background-color: ' + branding.primaryColor">
                <i class="fa-solid fa-calculator"></i>
            </div>
            <div>
                <h1 class="font-bold text-sm text-slate-900 tracking-tight" x-text="branding.brandName"></h1>
                <p class="text-[11px] text-slate-500" x-text="branding.footerText"></p>
            </div>
        </div>

        <div class="flex items-center space-x-3">
            <!-- Navigation Tab Switcher -->
            <div class="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center space-x-1">
                <button @click="currentTab = 'calculator'" :class="currentTab === 'calculator' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900 font-medium'" class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center">
                    <i class="fa-solid fa-sliders mr-1.5"></i>Calculator
                </button>
                <button @click="currentTab = 'whitelabel'" :class="currentTab === 'whitelabel' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900 font-medium'" class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center">
                    <i class="fa-solid fa-palette mr-1.5"></i>White-Label Studio
                </button>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 lg:px-8 py-6">

        <!-- ================= CALCULATOR TAB ================= -->
        <div x-show="currentTab === 'calculator'" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- LEFT INPUT FORMS -->
            <div class="lg:col-span-7 space-y-6">
                
                <!-- MODULE 1: PROFILE & FINANCIAL YEAR -->
                <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h2 class="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center">
                        <span class="w-5 h-5 rounded-full text-white flex items-center justify-center mr-2 text-[10px]" :style="'background-color: ' + branding.primaryColor">1</span>
                        Taxpayer Profile & Fiscal Rules
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Financial Year</label>
                            <select x-model="profile.fy" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500">
                                <option value="2026-27">FY 2026-27 (AY 2027-28)</option>
                                <option value="2025-26">FY 2025-26 (AY 2026-27)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Age Group (Old Regime)</label>
                            <select x-model.number="profile.age" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500">
                                <option value="45">Below 60 Years</option>
                                <option value="65">60 - 80 Years (Senior)</option>
                                <option value="85">Above 80 Years (Super Senior)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Employment Type</label>
                            <select x-model="profile.employment" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500">
                                <option value="salaried">Salaried (Eligible for Std Ded)</option>
                                <option value="self">Self-Employed / Business</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- MODULE 2: SALARY & INCOME -->
                <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h2 class="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center">
                        <span class="w-5 h-5 rounded-full text-white flex items-center justify-center mr-2 text-[10px]" :style="'background-color: ' + branding.primaryColor">2</span>
                        Salary & Allowances
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Gross Salary (Basic + DA + HRA)</label>
                            <div class="relative">
                                <span class="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                                <input type="number" x-model.number="salary.gross" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500" placeholder="1800000">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Professional Tax Paid</label>
                            <div class="relative">
                                <span class="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                                <input type="number" x-model.number="salary.profTax" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500" placeholder="2500">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MODULE 3: HOUSE PROPERTY -->
                <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h2 class="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center">
                        <span class="w-5 h-5 rounded-full text-white flex items-center justify-center mr-2 text-[10px]" :style="'background-color: ' + branding.primaryColor">3</span>
                        House Property & Home Loan Interest (Sec 24b)
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Property Type</label>
                            <select x-model="houseProperty.type" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500">
                                <option value="self">Self-Occupied (Max 2L deduction in Old)</option>
                                <option value="letout">Let-Out Property</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Home Loan Interest Paid</label>
                            <div class="relative">
                                <span class="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                                <input type="number" x-model.number="houseProperty.interest" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500" placeholder="200000">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MODULE 4 & 5: CAPITAL GAINS & OTHER SOURCES -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <h2 class="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100 flex items-center">
                            <span class="w-4 h-4 rounded-full text-white flex items-center justify-center mr-2 text-[9px]" :style="'background-color: ' + branding.primaryColor">4</span>
                            Capital Gains
                        </h2>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-[11px] font-semibold text-slate-700 mb-1">STCG (Equity Sec 111A)</label>
                                <input type="number" x-model.number="capitalGains.stcg" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" placeholder="0">
                            </div>
                            <div>
                                <label class="block text-[11px] font-semibold text-slate-700 mb-1">LTCG (Equity Sec 112A)</label>
                                <input type="number" x-model.number="capitalGains.ltcg" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" placeholder="0">
                            </div>
                        </div>
                    </div>
                    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <h2 class="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b border-slate-100 flex items-center">
                            <span class="w-4 h-4 rounded-full text-white flex items-center justify-center mr-2 text-[9px]" :style="'background-color: ' + branding.primaryColor">5</span>
                            Other Sources
                        </h2>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-[11px] font-semibold text-slate-700 mb-1">Savings & FD Interest</label>
                                <input type="number" x-model.number="otherSources.interest" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" placeholder="30000">
                            </div>
                            <div>
                                <label class="block text-[11px] font-semibold text-slate-700 mb-1">Other Income (Freelance/Rent)</label>
                                <input type="number" x-model.number="otherSources.other" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500" placeholder="0">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MODULE 6: DEDUCTIONS (OLD REGIME ONLY) -->
                <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h2 class="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center">
                        <span class="w-5 h-5 rounded-full text-white flex items-center justify-center mr-2 text-[10px]" :style="'background-color: ' + branding.primaryColor">6</span>
                        Chapter VI-A Deductions <span class="text-amber-600 font-bold ml-1.5 text-[10px]">(Old Regime Only)</span>
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Sec 80C (PPF/ELSS/EPF)</label>
                            <input type="number" x-model.number="deductions.sec80C" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" placeholder="150000">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Sec 80D (Health Insurance)</label>
                            <input type="number" x-model.number="deductions.sec80D" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" placeholder="25000">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Sec 80CCD(1B) (NPS Tier 1)</label>
                            <input type="number" x-model.number="deductions.sec80CCD" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" placeholder="50000">
                        </div>
                    </div>
                </div>

            </div>

            <!-- RIGHT OUTPUT COLUMN: SIDE-BY-SIDE MATRIX & SUMMARY -->
            <div class="lg:col-span-5 space-y-6">
                
                <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl sticky top-20">
                    <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                        <div>
                            <span class="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider text-white" :style="'background-color: ' + branding.primaryColor">Regime Comparison</span>
                            <h3 class="text-base font-bold text-slate-900 mt-1">Tax Audit Summary</h3>
                        </div>
                        <div class="text-right">
                            <span class="text-[11px] text-slate-400 block font-medium">Recommended</span>
                            <span class="text-xs font-black px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mt-0.5" x-text="comparison.recommended"></span>
                        </div>
                    </div>

                    <!-- COMPARISON TABLE -->
                    <div class="space-y-3 mb-6">
                        <div class="grid grid-cols-3 text-xs font-bold text-slate-400 pb-2 border-b border-slate-100">
                            <span>Metric</span>
                            <span class="text-right text-slate-700">Old Regime</span>
                            <span class="text-right text-indigo-600">New Regime</span>
                        </div>
                        <div class="grid grid-cols-3 text-xs items-center py-1.5 border-b border-slate-100">
                            <span class="text-slate-500 font-medium">Gross Income</span>
                            <span class="text-right font-semibold text-slate-800" x-text="'₹' + results.old.gross.toLocaleString()"></span>
                            <span class="text-right font-semibold text-slate-800" x-text="'₹' + results.new.gross.toLocaleString()"></span>
                        </div>
                        <div class="grid grid-cols-3 text-xs items-center py-1.5 border-b border-slate-100">
                            <span class="text-slate-500 font-medium">Standard Ded.</span>
                            <span class="text-right font-semibold text-emerald-600" x-text="'-₹' + results.old.stdDed.toLocaleString()"></span>
                            <span class="text-right font-semibold text-emerald-600" x-text="'-₹' + results.new.stdDed.toLocaleString()"></span>
                        </div>
                        <div class="grid grid-cols-3 text-xs items-center py-1.5 border-b border-slate-100">
                            <span class="text-slate-500 font-medium">Total Deductions</span>
                            <span class="text-right font-semibold text-emerald-600" x-text="'-₹' + results.old.deductions.toLocaleString()"></span>
                            <span class="text-right font-semibold text-emerald-600" x-text="'-₹' + results.new.deductions.toLocaleString()"></span>
                        </div>
                        <div class="grid grid-cols-3 text-xs items-center py-1.5 border-b border-slate-100">
                            <span class="text-slate-500 font-medium">Taxable Income</span>
                            <span class="text-right font-bold text-slate-900" x-text="'₹' + results.old.taxable.toLocaleString()"></span>
                            <span class="text-right font-bold text-slate-900" x-text="'₹' + results.new.taxable.toLocaleString()"></span>
                        </div>
                        <div class="grid grid-cols-3 text-xs items-center py-2 bg-slate-50 px-2.5 rounded-xl border border-slate-200">
                            <span class="font-bold text-slate-800">Net Tax Payable</span>
                            <span class="text-right font-black text-amber-600 text-sm" x-text="'₹' + results.old.netTax.toLocaleString()"></span>
                            <span class="text-right font-black text-indigo-600 text-sm" x-text="'₹' + results.new.netTax.toLocaleString()"></span>
                        </div>
                    </div>

                    <!-- SAVINGS CARD -->
                    <div class="border rounded-2xl p-4 mb-6 flex items-center justify-between" :style="'background-color: ' + branding.primaryColor + '10; border-color: ' + branding.primaryColor + '30'">
                        <div>
                            <span class="text-xs font-semibold block" :style="'color: ' + branding.primaryColor">Maximum Savings</span>
                            <span class="text-2xl font-black text-slate-900" x-text="'₹' + comparison.savings.toLocaleString()"></span>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] text-slate-400 block font-mono">4% Cess Included</span>
                            <span class="text-xs font-bold text-emerald-600">Active Audit</span>
                        </div>
                    </div>

                    <!-- ACTION BUTTONS -->
                    <div class="space-y-2.5">
                        <button @click="printSummary()" class="w-full text-white text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center" :style="'background-color: ' + branding.primaryColor">
                            <i class="fa-solid fa-print mr-2"></i>Print / Export Tax Summary
                        </button>
                        <button @click="exportJSON()" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 px-4 rounded-xl transition-all border border-slate-200 flex items-center justify-center">
                            <i class="fa-solid fa-file-arrow-down mr-2"></i>Download Audit JSON
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <!-- ================= WHITE-LABEL STUDIO TAB ================= -->
        <div x-show="currentTab === 'whitelabel'" x-cloak class="space-y-6 max-w-2xl mx-auto">
            <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h2 class="text-base font-bold text-slate-900 mb-1 flex items-center">
                    <i class="fa-solid fa-palette text-indigo-600 mr-2.5"></i>White-Label Brand Studio
                </h2>
                <p class="text-xs text-slate-500 mb-6">Customize the brand name, footer text, and primary accent color instantly to match your advisory firm.</p>

                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1.5">Firm / Brand Name</label>
                        <input type="text" x-model="branding.brandName" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1.5">Subtitle / Footer Attribution</label>
                        <input type="text" x-model="branding.footerText" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1.5">Primary Brand Accent Color</label>
                        <div class="flex items-center space-x-3">
                            <input type="color" x-model="branding.primaryColor" class="w-12 h-10 rounded-lg cursor-pointer border border-slate-200 bg-transparent">
                            <input type="text" x-model="branding.primaryColor" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none">
                        </div>
                    </div>
                    <div class="pt-4">
                        <button @click="currentTab = 'calculator'; alert('White-label theme applied successfully!')" class="w-full text-white text-xs font-bold py-3 rounded-xl shadow-md transition-all" :style="'background-color: ' + branding.primaryColor">
                            Save & Preview Theme
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <script>
        function taxCalculatorApp() {
            return {
                currentTab: 'calculator',
                branding: {
                    brandName: 'TaxOS™ Enterprise Advisory',
                    footerText: 'Direct Tax Calculation & Comparison Engine',
                    primaryColor: '#4f46e5'
                },
                profile: { fy: '2026-27', age: 45, employment: 'salaried' },
                salary: { gross: 1800000, profTax: 2500 },
                houseProperty: { type: 'self', interest: 200000 },
                capitalGains: { stcg: 0, ltcg: 0 },
                otherSources: { interest: 30000, other: 0 },
                deductions: { sec80C: 150000, sec80D: 25000, sec80CCD: 50000 },

                get results() {
                    return {
                        old: this.computeTax('old'),
                        new: this.computeTax('new')
                    };
                },

                computeTax(regime) {
                    let stdDed = regime === 'new' ? 75000 : (this.profile.employment === 'salaried' ? 50000 : 0);
                    let grossSalary = Math.max(0, this.salary.gross - stdDed - this.salary.profTax);
                    
                    let hpInterest = 0;
                    if (this.houseProperty.type === 'self') {
                        hpInterest = regime === 'old' ? -Math.min(200000, this.houseProperty.interest) : 0;
                    } else {
                        hpInterest = -this.houseProperty.interest;
                    }

                    let gross = grossSalary + hpInterest + this.capitalGains.stcg + this.capitalGains.ltcg + this.otherSources.interest + this.otherSources.other;

                    let deductions = 0;
                    if (regime === 'old') {
                        deductions = Math.min(150000, this.deductions.sec80C) 
                                   + Math.min(50000, this.deductions.sec80D) 
                                   + Math.min(50000, this.deductions.sec80CCD);
                    }

                    let taxable = Math.max(0, gross - deductions);
                    let tax = 0;

                    if (regime === 'new') {
                        if (taxable > 400000) tax += (Math.min(taxable, 800000) - 400000) * 0.05;
                        if (taxable > 800000) tax += (Math.min(taxable, 1200000) - 800000) * 0.10;
                        if (taxable > 1200000) tax += (Math.min(taxable, 1600000) - 1200000) * 0.15;
                        if (taxable > 1600000) tax += (Math.min(taxable, 2000000) - 1600000) * 0.20;
                        if (taxable > 2000000) tax += (Math.min(taxable, 2400000) - 2000000) * 0.25;
                        if (taxable > 2400000) tax += (taxable - 2400000) * 0.30;

                        if (taxable <= 1200000) {
                            tax = 0;
                        }
                    } else {
                        let basicLimit = this.profile.age >= 80 ? 500000 : (this.profile.age >= 60 ? 300000 : 250000);
                        if (taxable > basicLimit) tax += (Math.min(taxable, 500000) - basicLimit) * 0.05;
                        if (taxable > 500000) tax += (Math.min(taxable, 1000000) - 500000) * 0.20;
                        if (taxable > 1000000) tax += (taxable - 1000000) * 0.30;

                        if (taxable <= 500000) {
                            tax = Math.max(0, tax - 12500);
                        }
                    }

                    let cess = tax * 0.04;
                    let netTax = Math.round(tax + cess);

                    return { gross, stdDed, deductions, taxable, netTax };
                },

                get comparison() {
                    let oldTax = this.results.old.netTax;
                    let newTax = this.results.new.netTax;
                    let diff = Math.abs(oldTax - newTax);
                    if (oldTax < newTax) return { recommended: 'Old Regime', savings: diff };
                    if (newTax < oldTax) return { recommended: 'New Regime', savings: diff };
                    return { recommended: 'Both Equal', savings: 0 };
                },

                printSummary() {
                    window.print();
                },

                exportJSON() {
                    let payload = { brand: this.branding.brandName, timestamp: new Date().toISOString(), results: this.results };
                    let blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                    let a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = \`tax_audit_report_\${this.profile.fy}.json\`;
                    a.click();
                }
            }
        }
    </script>
</body>
</html>`;

export const AdminEmbedStudio: React.FC = () => {
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [selectedCalcId, setSelectedCalcId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Editor Mode: 'visual' or 'html'
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('html');

  // Embed Customizer Settings
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('750');
  const [theme, setTheme] = useState<'light' | 'dark' | 'minimal'>('light');
  const [showBorder, setShowBorder] = useState(true);
  const [showShadow, setShowShadow] = useState(true);
  const [borderRadius, setBorderRadius] = useState('12');

  // Copy Feedback
  const [codeCopied, setCopied] = useState(false);
  const [iframeCopied, setIframeCopied] = useState(false);

  // Editor HTML Content
  const [htmlContent, setHtmlContent] = useState<string>(ENTERPRISE_HTML_TEMPLATE);
  const visualEditorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCalculators();
  }, []);

  const loadCalculators = async () => {
    setIsLoading(true);
    try {
      const data = await api.adminGetCalculators();
      setCalculators(data);
      if (data.length > 0) {
        setSelectedCalcId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load calculators:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCalc = calculators.find((c) => c.id === selectedCalcId) || calculators[0];

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://calcplatform.org';
  };

  const embedUrl = selectedCalc
    ? `${getBaseUrl()}/income-tax-tax/income-tax/${selectedCalc.slug}?embed=true&theme=${theme}`
    : `${getBaseUrl()}?embed=true`;

  const borderCss = showBorder ? '1px solid #e4e5e7' : 'none';
  const shadowCss = showShadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.08)' : 'none';

  const iframeSnippet = `<iframe src="${embedUrl}" width="${width}" height="${height}px" style="border: ${borderCss}; border-radius: ${borderRadius}px; box-shadow: ${shadowCss}; overflow: hidden;" frameborder="0" scrolling="no" title="${selectedCalc?.name || 'Calculator'}"></iframe>`;

  // Sync content between Visual Editor and State
  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      setHtmlContent(visualEditorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    handleVisualInput();
  };

  const handleInsertIframe = () => {
    if (editorMode === 'visual' && visualEditorRef.current) {
      document.execCommand('insertHTML', false, iframeSnippet);
      handleVisualInput();
    } else {
      setHtmlContent((prev) => `${prev}\n\n${iframeSnippet}`);
    }
  };

  const handleLoadEnterpriseTemplate = () => {
    setHtmlContent(ENTERPRISE_HTML_TEMPLATE);
    if (visualEditorRef.current) {
      visualEditorRef.current.innerText = ENTERPRISE_HTML_TEMPLATE;
    }
  };

  const handleCopyIframe = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setIframeCopied(true);
    setTimeout(() => setIframeCopied(false), 2500);
  };

  const handleCopyFullCode = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPage = () => {
    const fullDocument = htmlContent.trim().startsWith('<!DOCTYPE') || htmlContent.trim().startsWith('<html')
      ? htmlContent
      : `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${selectedCalc?.name || 'Calculator'} - Embedded Page</title>
    <style>
        body { margin: 0; padding: 40px 20px; background-color: #fafafa; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

    const blob = new Blob([fullDocument], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCalc?.slug || 'calculator'}-embed-page.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#e4e5e7] p-8 text-center text-xs text-[#74767e]">
        Loading embed studio...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e4e5e7]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#222325] tracking-tight">
            Embed & Rich-Text HTML Studio
          </h1>
          <p className="text-xs text-[#74767e] mt-1">
            Generate iframe widgets, edit full HTML applications, and export standalone web apps
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLoadEnterpriseTemplate}
            className="px-3.5 py-2 bg-white hover:bg-[#f5f5f5] text-[#404145] border border-[#dadbdd] text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Reset or load the full Enterprise Tax Calculator Web App HTML template"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#1dbf73]" />
            <span>Load Enterprise App Template</span>
          </button>

          <button
            type="button"
            onClick={handleCopyFullCode}
            className="px-4 py-2 bg-white hover:bg-[#f5f5f5] text-[#222325] border border-[#dadbdd] text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {codeCopied ? <Check className="w-3.5 h-3.5 text-[#1dbf73]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{codeCopied ? 'Page HTML Copied!' : 'Copy Full HTML'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPage}
            className="px-4 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-lg transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .HTML File</span>
          </button>
        </div>
      </div>

      {/* Top Configuration Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-[#e4e5e7] space-y-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Target Calculator Selector */}
          <div>
            <label className="block text-xs font-bold text-[#222325] mb-1">Select Calculator</label>
            <select
              value={selectedCalcId}
              onChange={(e) => setSelectedCalcId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold text-[#222325] bg-[#fafafa] border border-[#dadbdd] rounded-lg focus:border-[#1dbf73] outline-hidden cursor-pointer"
            >
              {calculators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Width */}
          <div>
            <label className="block text-xs font-bold text-[#222325] mb-1">Iframe Width</label>
            <input
              type="text"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-[#fafafa] border border-[#dadbdd] rounded-lg focus:border-[#1dbf73] outline-hidden"
              placeholder="100% or 800px"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-xs font-bold text-[#222325] mb-1">Height (px)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-[#fafafa] border border-[#dadbdd] rounded-lg focus:border-[#1dbf73] outline-hidden"
              placeholder="750"
            />
          </div>

          {/* Theme */}
          <div>
            <label className="block text-xs font-bold text-[#222325] mb-1">Theme Style</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-bold text-[#222325] bg-[#fafafa] border border-[#dadbdd] rounded-lg focus:border-[#1dbf73] outline-hidden cursor-pointer"
            >
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
              <option value="minimal">Minimal / Clean</option>
            </select>
          </div>
        </div>

        {/* Iframe Code Box */}
        <div className="pt-2 border-t border-[#f0f0f0] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#222325] uppercase tracking-wider">Generated Iframe Snippet</span>
            <button
              type="button"
              onClick={handleCopyIframe}
              className="text-xs font-bold text-[#1dbf73] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {iframeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{iframeCopied ? 'Iframe Code Copied!' : 'Copy Iframe Code Only'}</span>
            </button>
          </div>

          <pre className="p-3 bg-[#1e1e1e] text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto border border-[#333]">
            <code>{iframeSnippet}</code>
          </pre>
        </div>
      </div>

      {/* Main Studio Grid: Rich Text / HTML Source Editor vs Isolated Live Sandbox Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Editor */}
        <div className="bg-white rounded-xl border border-[#e4e5e7] overflow-hidden flex flex-col shadow-2xs">
          {/* Editor Header Toolbar */}
          <div className="p-3 bg-[#fafafa] border-b border-[#e4e5e7] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#e4e5e7]">
              <button
                type="button"
                onClick={() => setEditorMode('html')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  editorMode === 'html' ? 'bg-[#1dbf73] text-white shadow-2xs' : 'text-[#74767e] hover:text-[#222325]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Show HTML (&lt;&gt;)</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorMode('visual')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  editorMode === 'visual' ? 'bg-[#1dbf73] text-white shadow-2xs' : 'text-[#74767e] hover:text-[#222325]'
                }`}
              >
                Visual Article Mode
              </button>
            </div>

            <button
              type="button"
              onClick={handleInsertIframe}
              className="px-3 py-1.5 bg-[#f4fdf8] hover:bg-[#e8faef] text-[#1dbf73] border border-[#d8f5e5] rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Insert current calculator iframe snippet"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Insert Iframe Snippet</span>
            </button>
          </div>

          {/* Rich Text Toolbar Buttons (Only in Visual Mode) */}
          {editorMode === 'visual' && (
            <div className="px-3 py-2 bg-white border-b border-[#f0f0f0] flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => executeCommand('bold')}
                className="p-1.5 text-[#404145] hover:bg-[#f5f5f5] rounded cursor-pointer"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('italic')}
                className="p-1.5 text-[#404145] hover:bg-[#f5f5f5] rounded cursor-pointer"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-[#e4e5e7] mx-1" />
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<h1>')}
                className="p-1.5 text-[#404145] hover:bg-[#f5f5f5] rounded cursor-pointer"
                title="Heading 1"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<h2>')}
                className="p-1.5 text-[#404145] hover:bg-[#f5f5f5] rounded cursor-pointer"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-[#e4e5e7] mx-1" />
              <button
                type="button"
                onClick={() => executeCommand('insertUnorderedList')}
                className="p-1.5 text-[#404145] hover:bg-[#f5f5f5] rounded cursor-pointer"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('formatBlock', '<blockquote>')}
                className="p-1.5 text-[#404145] hover:bg-[#f5f5f5] rounded cursor-pointer"
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Editor Workspace Area */}
          <div className="p-4 flex-1 min-h-[550px]">
            {editorMode === 'visual' ? (
              <div
                ref={visualEditorRef}
                contentEditable
                onInput={handleVisualInput}
                className="w-full h-full min-h-[520px] p-4 bg-white border border-[#dadbdd] rounded-lg outline-hidden focus:border-[#1dbf73] prose max-w-none text-xs sm:text-sm font-sans"
              />
            ) : (
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="w-full h-full min-h-[520px] p-4 bg-[#1e1e1e] text-emerald-400 font-mono text-xs rounded-lg outline-hidden focus:border-[#1dbf73] leading-relaxed border border-[#333]"
                placeholder="Paste your complete <!DOCTYPE html> or HTML snippet here..."
              />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Isolated Sandbox Preview Engine (Using srcDoc for Alpine & Tailwind CDN support) */}
        <div className="bg-white rounded-xl border border-[#e4e5e7] overflow-hidden flex flex-col shadow-2xs">
          <div className="p-3 bg-[#fafafa] border-b border-[#e4e5e7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#1dbf73]" />
              <h3 className="text-xs font-bold text-[#222325] uppercase tracking-wider">Live Sandbox Preview Engine</h3>
            </div>
            <span className="text-[10px] font-mono text-[#1dbf73] font-bold bg-[#f4fdf8] px-2 py-0.5 rounded border border-[#d8f5e5]">
              Isolated Iframe Active
            </span>
          </div>

          <div className="p-4 bg-[#f8fafc] flex-1 min-h-[550px] flex flex-col">
            <iframe
              title="Live Sandbox Preview"
              srcDoc={
                htmlContent.trim().startsWith('<!DOCTYPE') || htmlContent.trim().startsWith('<html')
                  ? htmlContent
                  : `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; margin: 0; background-color: #ffffff; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`
              }
              className="w-full h-full min-h-[530px] rounded-xl border border-[#e2e8f0] bg-white shadow-xs"
              sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
