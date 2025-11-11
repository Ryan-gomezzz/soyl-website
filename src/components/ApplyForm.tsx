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

      const response = await fetch('/api/upload-url', {
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

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error ?? 'Failed to fetch upload URL.');
      }

      const { uploadUrl, fileUrl } = (await response.json()) as { uploadUrl: string; fileUrl: string };

      const upload = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      });

      if (!upload.ok) {
        throw new Error('Resume upload failed.');
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
      className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl backdrop-blur"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm">
          Full name *
          <input
            required
            name="fullName"
            value={formValues.fullName}
            onChange={onInputChange}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-sm">
          Email *
          <input
            required
            type="email"
            name="email"
            value={formValues.email}
            onChange={onInputChange}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-sm">
          Phone
          <input
            name="phone"
            value={formValues.phone}
            onChange={onInputChange}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-sm">
          Location (city, country)
          <input
            name="location"
            value={formValues.location}
            onChange={onInputChange}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-sm">
          Role *
          <select
            name="roleApplied"
            value={formValues.roleApplied}
            onChange={onInputChange}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
          >
            {orderedRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm">
          Seniority preference
          <select
            name="seniority"
            value={formValues.seniority}
            onChange={onInputChange}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
          >
            {['Intern', 'Junior', 'Mid', 'Senior', 'Staff'].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm">
          LinkedIn *
          <input
            required
            type="url"
            name="linkedin"
            value={formValues.linkedin}
            onChange={onInputChange}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-sm">
          GitHub / Portfolio
          <input
            type="url"
            name="github"
            value={formValues.github}
            onChange={onInputChange}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-sm md:col-span-2">
          Work eligibility / Remote or onsite
          <input
            name="workEligibility"
            value={formValues.workEligibility}
            onChange={onInputChange}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-sm">
          Notice period
          <input
            name="noticePeriod"
            value={formValues.noticePeriod}
            onChange={onInputChange}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-sm">
          Salary expectations
          <input
            name="salaryExpectation"
            value={formValues.salaryExpectation}
            onChange={onInputChange}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-sm md:col-span-2">
          Cover letter / short pitch (300-600 chars recommended)
          <textarea
            name="coverLetter"
            value={formValues.coverLetter}
            onChange={onInputChange}
            rows={4}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-sm md:col-span-2">
          UTM / source
          <input
            name="utmSource"
            value={formValues.utmSource}
            onChange={onInputChange}
            className="mt-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-sky-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-sm md:col-span-2">
          Resume (PDF, max 5 MB) *
          <input
            required
            type="file"
            accept=".pdf,application/pdf"
            onChange={onFileChange}
            className="mt-1 text-white"
          />
        </label>
      </div>
      <label className="inline-flex items-center space-x-2 text-sm text-slate-300">
        <input type="checkbox" name="consent" checked={formValues.consent} onChange={onInputChange} />
        <span>I consent to my data being stored for recruitment purposes.</span>
      </label>
      <p className="text-xs text-slate-500">Protected by reCAPTCHA. Google Privacy Policy & Terms of Service apply.</p>
      {errorMessage ? (
        <p className="rounded-md border border-rose-400/40 bg-rose-900/40 px-4 py-3 text-sm text-rose-100">{errorMessage}</p>
      ) : null}
      <button
        type="submit"
        disabled={status === 'uploading' || status === 'submitting'}
        className="w-full rounded-md bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        {statusLabels[status]}
      </button>
    </form>
  );
}

