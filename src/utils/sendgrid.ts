import sgMail, { type MailDataRequired } from '@sendgrid/mail';
import type { Applicant } from '@prisma/client';

const apiKey = process.env.SENDGRID_API_KEY;

if (apiKey) {
  sgMail.setApiKey(apiKey);
}

export async function sendApplicantEmail(applicant: Applicant) {
  if (!apiKey || !process.env.HIRING_INBOX) {
    console.warn('Skipping SendGrid notification (missing API key or inbox).');
    return;
  }

  const message: MailDataRequired = {
    to: process.env.HIRING_INBOX,
    from: process.env.SENDGRID_FROM_EMAIL ?? 'careers@soyl.ai',
    subject: `New applicant: ${applicant.fullName} → ${applicant.roleApplied}`,
    html: `
      <h2>New applicant for ${applicant.roleApplied}</h2>
      <p><strong>Name:</strong> ${applicant.fullName}</p>
      <p><strong>Email:</strong> <a href="mailto:${applicant.email}">${applicant.email}</a></p>
      <p><strong>LinkedIn:</strong> <a href="${applicant.linkedin}">${applicant.linkedin}</a></p>
      <p><strong>Cover letter:</strong> ${applicant.coverLetter ?? 'N/A'}</p>
      <p><strong>Resume:</strong> ${applicant.resumeUrl}</p>
      <p><strong>Source:</strong> ${applicant.source ?? 'Direct'}</p>
    `
  };

  try {
    await sgMail.send(message);
  } catch (error) {
    console.error('Failed to send applicant email', error);
  }
}

