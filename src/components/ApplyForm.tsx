'use client';

import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from 'react';

type ApplyFormProps = {
  roles: string[];
};

type FormValues = {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  roleApplied: string;
  seniority: string;
  linkedin: string;
  github?: string;
  coverLetter?: string;
  workEligibility: string;
  noticePeriod?: string;
  salaryExpectation?: string;
  utmSource?: string;
  consent: boolean;
};

type SubmissionState = 'idle' | 'uploading' | 'submitting' | 'success' | 'error';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['application/pdf'];
const DEFAULT_FORM: FormValues = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  roleApplied: '',
  seniority: 'Mid',
  linkedin: '',
  github: '',
  coverLetter: '',
  workEligibility: '',
  noticePeriod: '',
  salaryExpectation: '',
  utmSource: '',
  consent: false
};

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const uploadHint = process.env.NEXT_PUBLIC_UPLOAD_PUBLIC_HINT ?? '';

const statusLabels: Record<SubmissionState, string> = {
  idle: 'Submit application',
  uploading: 'Uploading resume…',
  submitting: 'Submitting application…',
  success: 'Application received!',
  error: 'Retry submission'
};

const getRecaptchaToken = async (): Promise<string> => {
  if (!recaptchaSiteKey) {
    throw new Error('reCAPTCHA site key missing.');
  }

  if (!window.grecaptcha) {
    throw new Error('reCAPTCHA has not loaded yet.');
  }

  await new Promise<void>((resolve) => {
    window.grecaptcha?.ready(() => resolve());
  });
  return window.grecaptcha.execute(recaptchaSiteKey, { action: 'submit' });
};

export default function ApplyForm({ roles }: ApplyFormProps) {
  const orderedRoles = useMemo(() => [...roles].sort(), [roles]);
  const [formValues, setFormValues] = useState<FormValues>({
    ...DEFAULT_FORM,
    roleApplied: orderedRoles[0] ?? ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [status, setStatus] = useState<SubmissionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = event.target;
    const name = target.name as keyof FormValues;

    if (target instanceof HTMLInputElement && target.type === 'checkbox' && name === 'consent') {
      setFormValues((prev) => ({
        ...prev,
        consent: target.checked
      }));
      return;
    }

    setFormValues((prev) => ({
      ...prev,
      [name]: target.value
    }));
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMessage('Resume must be a PDF file.');
      setResumeFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('Resume must be 5 MB or smaller.');
      setResumeFile(null);
      return;
    }

    setErrorMessage(null);
    setResumeFile(file);
  };

  const uploadResume = useCallback(
    async (file: File) => {
      if (!uploadHint) {
        throw new Error('Upload secret is not configured.');
      }

      // Step 1: Get upload URL and file path
      const urlResponse = await fetch('/api/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-secret': uploadHint
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        })
      });

      if (!urlResponse.ok) {
        const { error } = await urlResponse.json();
        throw new Error(error ?? 'Failed to fetch upload URL.');
      }

      const { uploadUrl, fileUrl, filePath } = (await urlResponse.json()) as { 
        uploadUrl: string; 
        fileUrl: string;
        filePath: string;
      };

      // Step 2: Upload file to server-side endpoint
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filePath', filePath);
      formData.append('fileName', file.name);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'x-api-secret': uploadHint
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        const { error } = await uploadResponse.json().catch(() => ({}));
        throw new Error(error ?? 'Resume upload failed.');
      }

      return fileUrl;
    },
    []
  );

  const resetForm = () => {
    setFormValues({
      ...DEFAULT_FORM,
      roleApplied: orderedRoles[0] ?? ''
    });
    setResumeFile(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!resumeFile) {
      setErrorMessage('Please upload your resume as a PDF.');
      return;
    }

    if (!formValues.consent) {
      setErrorMessage('You must consent to the storage of your data.');
      return;
    }

    try {
      setStatus('uploading');
      const resumeUrl = await uploadResume(resumeFile);

      setStatus('submitting');
      const recaptchaToken = await getRecaptchaToken();

      const response = await fetch('/api/applicants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formValues,
          resumeUrl,
          consent: true,
          recaptchaToken
        })
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error ?? 'Failed to submit application.');
      }

      setStatus('success');
      resetForm();
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message);
      setStatus('error');
    } finally {
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-white/10 bg-panel/50 p-8 shadow-2xl glass relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5 pointer-events-none" />

      <div className="grid gap-6 md:grid-cols-2 relative z-10">
        <label className="flex flex-col text-sm font-medium text-text/80 group">
          Full name *
          <input
            required
            name="fullName"
            value={formValues.fullName}
            onChange={onInputChange}
            className="mt-2 rounded-lg border border-white/10 bg-bg/50 px-4 py-3 text-text transition-all focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 group-hover:border-white/20"
            placeholder="Jane Doe"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-text/80 group">
          Email *
          <input
            required
            type="email"
            name="email"
            value={formValues.email}
            onChange={onInputChange}
            className="mt-2 rounded-lg border border-white/10 bg-bg/50 px-4 py-3 text-text transition-all focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 group-hover:border-white/20"
            placeholder="jane@example.com"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-text/80 group">
          Phone
          <input
            name="phone"
            value={formValues.phone}
            onChange={onInputChange}
            className="mt-2 rounded-lg border border-white/10 bg-bg/50 px-4 py-3 text-text transition-all focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 group-hover:border-white/20"
            placeholder="+1 (555) 000-0000"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-text/80 group">
          Location (city, country)
          <input
            name="location"
            value={formValues.location}
            onChange={onInputChange}
            className="mt-2 rounded-lg border border-white/10 bg-bg/50 px-4 py-3 text-text transition-all focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 group-hover:border-white/20"
            placeholder="San Francisco, CA"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-text/80 group">
          Role *
          <div className="relative">
            <select
              name="roleApplied"
              value={formValues.roleApplied}
              onChange={onInputChange}
              className="mt-2 w-full appearance-none rounded-lg border border-white/10 bg-bg/50 px-4 py-3 text-text transition-all focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 group-hover:border-white/20"
            >
              {orderedRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-2 text-text/50">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </label>
        <label className="flex flex-col text-sm font-medium text-text/80 group">
          Seniority preference
          <div className="relative">
            <select
              name="seniority"
              value={formValues.seniority}
              onChange={onInputChange}
              className="mt-2 w-full appearance-none rounded-lg border border-white/10 bg-bg/50 px-4 py-3 text-text transition-all focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 group-hover:border-white/20"
            >
              {['Intern', 'Junior', 'Mid', 'Senior', 'Staff'].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-2 text-text/50">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </label>
        <label className="flex flex-col text-sm font-medium text-text/80 group">
          LinkedIn *
          <input
            required
            type="text"
            name="linkedin"
            value={formValues.linkedin}
            onChange={onInputChange}
            placeholder="https://linkedin.com/in/yourprofile"
            pattern="https?://.*linkedin\.com.*"
            className="mt-2 rounded-lg border border-white/10 bg-bg/50 px-4 py-3 text-text transition-all focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 group-hover:border-white/20"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-text/80 group">
          GitHub / Portfolio
          <input
            type="url"
            name="github"
            value={formValues.github}
            onChange={onInputChange}
            className="mt-2 rounded-lg border border-white/10 bg-bg/50 px-4 py-3 text-text transition-all focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 group-hover:border-white/20"
            placeholder="https://github.com/username"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-text/80 group md:col-span-2">
          Work eligibility / Remote or onsite
          <input
            name="workEligibility"
            value={formValues.workEligibility}
            onChange={onInputChange}
            className="mt-2 rounded-lg border border-white/10 bg-bg/50 px-4 py-3 text-text transition-all focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 group-hover:border-white/20"
            placeholder="e.g. Authorized to work in US, Remote preferred"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-text/80 group">
          Notice period
          <input
            name="noticePeriod"
            value={formValues.noticePeriod}
            onChange={onInputChange}
            className="mt-2 rounded-lg border border-white/10 bg-bg/50 px-4 py-3 text-text transition-all focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 group-hover:border-white/20"
            placeholder="e.g. 2 weeks"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-text/80 group">
          Salary expectations
          <input
            name="salaryExpectation"
            value={formValues.salaryExpectation}
            onChange={onInputChange}
            className="mt-2 rounded-lg border border-white/10 bg-bg/50 px-4 py-3 text-text transition-all focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 group-hover:border-white/20"
            placeholder="e.g. $120k - $150k"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-text/80 group md:col-span-2">
          Cover letter / short pitch (300-600 chars recommended)
          <textarea
            name="coverLetter"
            value={formValues.coverLetter}
            onChange={onInputChange}
            rows={4}
            className="mt-2 rounded-lg border border-white/10 bg-bg/50 px-4 py-3 text-text transition-all focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 group-hover:border-white/20"
            placeholder="Tell us why you're a great fit..."
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-text/80 group md:col-span-2">
          UTM / source
          <input
            name="utmSource"
            value={formValues.utmSource}
            onChange={onInputChange}
            className="mt-2 rounded-lg border border-white/10 bg-bg/50 px-4 py-3 text-text transition-all focus:border-accent focus:bg-bg focus:outline-none focus:ring-2 focus:ring-accent/20 group-hover:border-white/20"
            placeholder="How did you hear about us?"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-text/80 group md:col-span-2">
          Resume (PDF, max 5 MB) *
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/20 px-6 py-10 transition-colors hover:border-accent/50 hover:bg-white/5">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-muted" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-4 flex text-sm text-muted justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 hover:text-accent-2"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,application/pdf" onChange={onFileChange} required />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-muted/70">PDF up to 5MB</p>
              {resumeFile && (
                <p className="mt-2 text-sm text-accent font-medium">
                  Selected: {resumeFile.name}
                </p>
              )}
            </div>
          </div>
        </label>
      </div>
      <label className="flex items-center space-x-3 text-sm text-muted cursor-pointer group">
        <input
          type="checkbox"
          name="consent"
          checked={formValues.consent}
          onChange={onInputChange}
          className="h-4 w-4 rounded border-white/10 bg-bg/50 text-accent focus:ring-accent/50 transition-all group-hover:border-accent"
        />
        <span className="group-hover:text-text transition-colors">I consent to my data being stored for recruitment purposes.</span>
      </label>
      <p className="text-xs text-muted/60">Protected by reCAPTCHA. Google Privacy Policy & Terms of Service apply.</p>
      {errorMessage ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 animate-pulse">
          {errorMessage}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={status === 'uploading' || status === 'submitting'}
        className="w-full rounded-lg bg-accent px-6 py-4 text-sm font-bold text-bg shadow-lg transition-all hover:bg-accent-2 hover:shadow-accent/20 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {statusLabels[status]}
      </button>
    </form>
  );
}

