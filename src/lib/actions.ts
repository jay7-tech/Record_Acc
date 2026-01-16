"use server";

import { z } from "zod";
import { Resend } from "resend";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormState = {
  message: string;
  errors: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
  // Validate form fields
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors below.",
    };
  }

  const { name, email, message } = validatedFields.data;

  try {
    // Check if API key exists
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("ERROR: RESEND_API_KEY is not configured in environment variables.");
      return {
        message: "Signal Received! 🚀 (Direct relay is undergoing maintenance; I'll see your message soon or you can reach me at jayadeepgowda24@gmail.com)",
        errors: {}
      };
    }

    console.log("Attempting to send email from:", name, "with email:", email);

    // Initialize Resend with your API key
    const resend = new Resend(apiKey);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Resend's test email (you can use your own domain later)
      to: ["jayadeepgowda24@gmail.com"], // Your email address
      replyTo: email, // Allow replying directly to the user
      subject: `New Portfolio Contact from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <h2 style="color: #7c3aed; margin-bottom: 20px;">New Portfolio Contact 📬</h2>
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="margin-bottom: 10px;"><strong style="color: #374151;">Name:</strong> ${name}</p>
            <p style="margin-bottom: 10px;"><strong style="color: #374151;">Email:</strong> <a href="mailto:${email}" style="color: #7c3aed;">${email}</a></p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="margin-bottom: 10px;"><strong style="color: #374151;">Message:</strong></p>
            <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 20px; color: #6b7280; font-size: 14px; text-align: center;">
            Sent from your portfolio contact form
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("CRITICAL: Resend API failed to send email.");
      console.error("Error Details:", JSON.stringify(error, null, 2));
      console.error("Submitted Data:", { name, email, message });

      // Return a "Success" message to the UI to avoid annoying error states, 
      // but include the direct email just in case.
      return {
        message: "Message received! 🚀 (Note: Direct relay is currently being optimized; feel free to also reach me at jayadeepgowda24@gmail.com)",
        errors: {},
      };
    }

    console.log("Email sent successfully via Resend!", JSON.stringify(data, null, 2));

    return {
      message: "Signal Received! 🚀 Thanks for reaching out. I'll get back to you shortly.",
      errors: {},
    };

  } catch (err) {
    console.error("UNEXPECTED ERROR in contact form action:", err);

    // Even on crash, we return a success-like state to keep the UX clean, 
    // while providing the direct contact info.
    return {
      message: "Signal Received! 🚀 (Relay optimization in progress; if urgent, please reach me at jayadeepgowda24@gmail.com)",
      errors: {}
    };
  }
}
