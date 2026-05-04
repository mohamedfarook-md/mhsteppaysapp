// controllers/supportController.js
// Simple support ticket logger (extend with email/DB as needed)
const sendResponse = (res, statusCode, success, message, data = {}) => {
  return res.status(statusCode).json({ success, message, data });
};

// ─── POST /api/support/ticket ─────────────────────────────────────────────────
const submitTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const user = req.user;

    if (!subject || !message) {
      return sendResponse(res, 400, false, 'Subject and message are required.');
    }

    // Log ticket (extend this to save to DB or send email)
    console.log(`🎧 Support Ticket from ${user.mobile}:`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Message: ${message}`);

    // TODO: Save to SupportTicket model or send email to support team

    return sendResponse(res, 200, true, 'Support ticket submitted. We will get back to you within 24 hours.', {
      ticketId: `TKT${Date.now()}`,
    });

  } catch (error) {
    console.error('Support ticket error:', error);
    return sendResponse(res, 500, false, 'Failed to submit ticket. Please try again.');
  }
};

module.exports = { submitTicket };