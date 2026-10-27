/**
 * Non-secret details of the MailerLite embedded form that receives enquiries.
 *
 * Both values appear in the public embed code MailerLite gives you for the form
 * (Forms > Embedded forms > your form > Get the HTML code), so they are safe to
 * commit. They are NOT API tokens. Never put a MailerLite API token in this
 * project.
 *
 * While either value is empty the enquiry page shows a notice with the
 * published email address instead of the form.
 */
export const enquiryForm = {
  /** MailerLite account ID, for example "1234567". */
  accountId: '2721543',
  /** MailerLite form ID, for example "123456789012345678". */
  formId: '202441603455911730',
}
