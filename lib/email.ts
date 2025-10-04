import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "PlayInDirtJobs <noreply@playindirtjobs.com>";

export async function sendJobConfirmationEmail(
  email: string,
  jobData: {
    id: string;
    title: string;
    company: string;
    slug: string;
    editToken: string;
  }
) {
  const editUrl = `${process.env.NEXT_PUBLIC_APP_URL}/manage/${jobData.editToken}`;
  const jobUrl = `${process.env.NEXT_PUBLIC_APP_URL}/jobs/${jobData.slug}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your job posting "${jobData.title}" is now live! 🌱`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #22c55e 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🌱 PlayInDirtJobs</h1>
          </div>

          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #14532d; margin-top: 0;">Your job is now live!</h2>

            <p style="color: #166534; line-height: 1.6;">
              Great news! Your job posting for <strong>${jobData.title}</strong> at
              <strong>${jobData.company}</strong> is now live on PlayInDirtJobs.
            </p>

            <div style="background: #fef3c7; border-left: 4px solid #fbbf24; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #78716c;">
                <strong>📧 Important:</strong> Save this email! The link below is your only way to manage your job posting.
              </p>
            </div>

            <div style="margin: 30px 0;">
              <a href="${editUrl}"
                 style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Manage Your Job Posting
              </a>
            </div>

            <div style="margin: 30px 0;">
              <a href="${jobUrl}"
                 style="display: inline-block; background: #ffffff; color: #10b981; padding: 14px 28px; text-decoration: none; border-radius: 6px; border: 2px solid #10b981; font-weight: bold;">
                View Your Live Job Posting
              </a>
            </div>

            <h3 style="color: #14532d; margin-top: 40px;">What you can do:</h3>
            <ul style="color: #166534; line-height: 1.8;">
              <li>Edit your job details anytime</li>
              <li>Deactivate your listing when filled</li>
              <li>Track views and engagement</li>
              <li>Extend or renew your posting</li>
            </ul>

            <p style="color: #78716c; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Your job will be live for 60 days. If you have any questions, just reply to this email.
            </p>

            <p style="color: #78716c; font-size: 14px; margin-top: 20px;">
              💚 Thank you for supporting sustainable agriculture jobs!
            </p>
          </div>

          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #78716c; font-size: 12px; margin: 0;">
              PlayInDirtJobs - Growing Opportunities Together 🌾
            </p>
          </div>
        </div>
      `,
    });

    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
}

export async function sendJobAlertEmail(
  subscriberEmail: string,
  jobs: Array<{
    title: string;
    company: string;
    location: string;
    slug: string;
  }>
) {
  const jobsHtml = jobs
    .map(
      (job) => `
      <div style="background: #ffffff; padding: 20px; margin: 15px 0; border-radius: 6px; border: 1px solid #e5e7eb;">
        <h3 style="color: #14532d; margin: 0 0 10px 0;">${job.title}</h3>
        <p style="color: #166534; margin: 5px 0;">${job.company}</p>
        <p style="color: #78716c; margin: 5px 0;">📍 ${job.location}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${job.slug}"
           style="display: inline-block; margin-top: 10px; color: #10b981; text-decoration: none; font-weight: bold;">
          View Job →
        </a>
      </div>
    `
    )
    .join("");

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: subscriberEmail,
      subject: `${jobs.length} new farming job${jobs.length > 1 ? "s" : ""} matching your interests 🌱`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #22c55e 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🌱 PlayInDirtJobs</h1>
          </div>

          <div style="background: #fef3c7; padding: 30px;">
            <h2 style="color: #14532d; margin-top: 0;">New Jobs for You!</h2>
            <p style="color: #166534;">
              We found ${jobs.length} new job${jobs.length > 1 ? "s" : ""} that match your interests:
            </p>

            ${jobsHtml}

            <div style="margin-top: 30px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}"
                 style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Browse All Jobs
              </a>
            </div>
          </div>

          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #78716c; font-size: 12px; margin: 0;">
              PlayInDirtJobs - Growing Opportunities Together 🌾
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending job alert email:", error);
  }
}
