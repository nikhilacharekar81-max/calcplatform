import React, { useState, useEffect } from 'react';
import {
  Save,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Key,
  Globe,
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { SiteSettings } from '../../types/schema.ts';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    siteTitle: '',
    siteDescription: '',
    siteKeywords: '',
    brandName: '',
    adminUsername: 'admin',
    footerNotice: '',
    canonicalBaseUrl: '',
    contactEmail: '',
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await api.adminGetSettings();
      setSettings(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    setIsSaving(true);
    try {
      await api.adminUpdateSettings({
        ...settings,
        newPassword: newPassword ? newPassword.trim() : undefined,
      });
      setSuccessMessage('Settings updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadBackup = () => {
    window.open('/api/admin/backup', '_blank');
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (confirm('Are you sure you want to restore this backup? This will replace database records.')) {
          setIsRestoring(true);
          await api.adminRestoreDatabase(parsed);
          alert('Database restored successfully!');
          window.location.reload();
        }
      } catch (err: any) {
        alert('Invalid backup JSON file: ' + err.message);
      } finally {
        setIsRestoring(false);
      }
    };
    reader.readAsText(file);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs text-[#74767e]">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#e4e5e7]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#222325] tracking-tight">
            Settings & Global SEO
          </h1>
          <p className="text-xs sm:text-sm text-[#74767e] mt-1">
            Configure platform branding, metadata defaults, credentials, and backups
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-[#e8faf1] border border-[#1dbf73]/30 rounded-lg text-xs text-[#013a12] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#1dbf73] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Brand & SEO Defaults */}
        <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#f5f5f5]">
            <Globe className="w-4 h-4 text-[#1dbf73]" />
            <h3 className="text-sm font-bold text-[#222325]">Branding & SEO Defaults</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={settings.brandName || ''}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden font-bold text-[#222325]"
                placeholder="calcplatform"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1">
                Canonical Base URL
              </label>
              <input
                type="text"
                value={settings.canonicalBaseUrl || ''}
                onChange={(e) => setSettings({ ...settings, canonicalBaseUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden font-mono"
                placeholder="https://calcplatform.org"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#222325] mb-1">
                Default Site Title
              </label>
              <input
                type="text"
                value={settings.siteTitle || ''}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden font-semibold text-[#222325]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#222325] mb-1">
                Global Meta Description
              </label>
              <textarea
                rows={2}
                value={settings.siteDescription || ''}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden resize-none text-[#404145]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#222325] mb-1">
                Global Keywords (comma separated)
              </label>
              <input
                type="text"
                value={settings.siteKeywords || ''}
                onChange={(e) => setSettings({ ...settings, siteKeywords: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#222325] mb-1">
                Footer Notice & Legal Disclaimer
              </label>
              <input
                type="text"
                value={settings.footerNotice || ''}
                onChange={(e) => setSettings({ ...settings, footerNotice: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden text-[#404145]"
              />
            </div>
          </div>
        </div>

        {/* Admin Account Security */}
        <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#f5f5f5]">
            <Key className="w-4 h-4 text-[#1dbf73]" />
            <h3 className="text-sm font-bold text-[#222325]">Admin Account Security</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1">
                Admin Username
              </label>
              <input
                type="text"
                value={settings.adminUsername || ''}
                onChange={(e) => setSettings({ ...settings, adminUsername: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden font-bold text-[#222325]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1">
                New Password (Optional)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep unchanged"
                className="w-full px-3 py-2 text-xs border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-3 py-2 text-xs border border-[#dadbdd] rounded-md focus:border-[#1dbf73] outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Database Backup & Restore */}
      <div className="bg-white rounded-xl border border-[#e4e5e7] p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#f5f5f5]">
          <FileCode className="w-4 h-4 text-[#1dbf73]" />
          <h3 className="text-sm font-bold text-[#222325]">Database Backup & Portability</h3>
        </div>

        <p className="text-xs text-[#74767e] leading-relaxed">
          Export a complete JSON snapshot of all categories, subcategories, calculators, and system configurations.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#222325] bg-[#f5f5f5] hover:bg-[#e4e5e7] rounded-md transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Database Backup</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#404145] bg-white hover:bg-[#fafafa] border border-[#dadbdd] rounded-md transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-[#1dbf73]" />
            <span>{isRestoring ? 'Restoring...' : 'Restore from JSON File'}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreFile}
              className="hidden"
              disabled={isRestoring}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
