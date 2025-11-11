import type { Applicant } from '@prisma/client';

export async function postSlackNotification(applicant: Applicant) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('Skipping Slack notification (missing webhook URL).');
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🧑‍💻 New applicant for *${applicant.roleApplied}*`,
        attachments: [
          {
            color: '#38bdf8',
            fields: [
              { title: 'Name', value: applicant.fullName, short: true },
              { title: 'Email', value: applicant.email, short: true },
              { title: 'LinkedIn', value: applicant.linkedin, short: false },
              { title: 'Resume', value: applicant.resumeUrl, short: false },
              { title: 'Source', value: applicant.source ?? 'Direct', short: true }
            ]
          }
        ]
      })
    });
  } catch (error) {
    console.error('Failed to post Slack notification', error);
  }
}

