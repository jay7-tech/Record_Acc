"use server";

import { z } from "zod";
import nodemailer from "nodemailer";

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
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors below.",
    };
  }

  const { name, email, message } = validatedFields.data;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER, // Sender address (must be the authenticated user)
      to: "jayadeepgowda24@gmail.com", // Receiver address
      replyTo: email, // Allow replying directly to the user
      subject: `New Portfolio Contact from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
    });

    transporter.close(); // Close the connection to prevent hanging
    console.log("Email sent successfully!");

    return {
      message: "Signal Received! 🚀 Thanks for reaching out. I'll get back to you shortly.",
      errors: {},
    };

  } catch (error) {
    console.error("Error sending email:", error);
    // Even if email fails, we might want to tell the user it "worked" or "failed".
    // For now, let's return a failure message so they know.
    return {
      message: "Something went wrong sending the email. Please contact me directly at jayadeepgowda24@gmail.com",
      errors: {}
    };
  }
}
