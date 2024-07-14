import nodemailer from "nodemailer";

export const sendEmail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Define sender email
    const senderEmail = process.env.MAIL_ID;

    // Send email with the defined transport object
    const info = await transporter.sendMail({
      from: `"No Reply" <${senderEmail}>`,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
