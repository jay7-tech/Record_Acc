"use server";

import { z } from "zod";
import { Resend } from "resend";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormState = {
  success?: boolean;
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
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fill out all fields correctly.",
    };
  }

  const { name, email, message } = validatedFields.data;

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Missing RESEND_API_KEY");
      return {
        success: false,
        message: "Email service is briefly unavailable. Please reach out directly to jayadeepgowda24@gmail.com - I'd love to hear from you!",
        errors: {},
      };
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: ["jayadeepgowda24@gmail.com"],
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend Error:", error);
      return {
        success: false,
        message: "Something went wrong. Please feel free to email me at jayadeepgowda24@gmail.com instead!",
        errors: {},
      };
    }

    return {
      success: true,
      message: "Message sent successfully!",
      errors: {},
    };

  } catch (err) {
    console.error("Form error:", err);
    return {
      success: false,
      message: "Something went wrong. Please feel free to email me at jayadeepgowda24@gmail.com instead!",
      errors: {},
    };
  }
}
