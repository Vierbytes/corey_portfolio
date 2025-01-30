/*
  Contact Window Content

  Styled like a simple email client window. Has a "To" field (pre-filled
  with my email), subject line, message body, and a send button.

  Using EmailJS to send emails directly from the browser. No backend
  needed - EmailJS handles the email delivery through their API.

  To set this up:
  1. Create an account at emailjs.com
  2. Add an email service (Gmail, Outlook, etc.)
  3. Create an email template with variables: {{subject}} and {{message}}
  4. Replace the three placeholder values below with your real IDs
*/

import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

// EmailJS credentials from my dashboard
const EMAILJS_SERVICE_ID = 'service_047t4k8';
const EMAILJS_TEMPLATE_ID = 'template_4j9n42k';
const EMAILJS_PUBLIC_KEY = 'KIuYYyYvKUiQBzXWl';

function Contact() {
  // Ref for the form element - EmailJS needs this to read the form fields
  const formRef = useRef(null);

  // Form state - keeping track of what the user types
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  // Track form status for UI feedback
  // 'idle' = ready to send, 'sending' = in progress, 'sent' = success, 'error' = failed
  const [status, setStatus] = useState('idle');

  // Update form fields as the user types
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission - sends via EmailJS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );

      setStatus('sent');
      // Clear the form after successful send
      setFormData({ subject: '', message: '' });
      // Reset status after a few seconds so they can send another message
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      // Something went wrong with EmailJS
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="contact">
      {/* Email client style header */}
      <div className="contact__bar">
        <span className="contact__bar-label">New Message</span>
      </div>

      <form ref={formRef} className="contact__form" onSubmit={handleSubmit}>
        {/* To field - shows my email, not editable */}
        <div className="contact__field">
          <label className="contact__label">To:</label>
          <span className="contact__static-value">corey@vierbytes.com</span>
        </div>

        {/* Subject line */}
        <div className="contact__field">
          <label className="contact__label" htmlFor="contact-subject">
            Subject:
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            className="contact__input"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What's this about?"
            required
          />
        </div>

        {/* Message body */}
        <div className="contact__field contact__field--body">
          <textarea
            name="message"
            className="contact__textarea"
            value={formData.message}
            onChange={handleChange}
            placeholder="Type your message here..."
            rows={8}
            required
          />
        </div>

        {/* Send button and status */}
        <div className="contact__actions">
          <button
            type="submit"
            className="contact__send-btn"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {/* Status messages */}
          {status === 'sent' && (
            <span className="contact__sent-message">
              Message sent successfully!
            </span>
          )}
          {status === 'error' && (
            <span className="contact__error-message">
              Failed to send. Please try again.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

export default Contact;
