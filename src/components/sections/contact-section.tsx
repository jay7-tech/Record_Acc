"use client";
import { motion } from 'framer-motion';
import { useActionState, useEffect, useRef } from "react";
import { FileDown, Info } from "lucide-react";
import { useFormStatus } from "react-dom";
import { submitContactForm } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AnimatedSection } from "../animated-section";
import { personalInfo } from "@/lib/data";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending..." : "Send Message"}
    </Button>
  );
}

interface ContactFormState {
  message: string;
  errors: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
}

export function ContactSection() {
  const initialState: ContactFormState = { message: "", errors: {} };
  const [state, dispatch] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      const isError = Object.keys(state.errors).length > 0;
      toast({
        variant: isError ? "destructive" : "default",
        title: isError ? "Error" : "Success!",
        description: state.message,
      });

      if (!isError) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <AnimatedSection id="contact" className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full opacity-30 pointer-events-none" />
        <Card className="relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-primary/80">Get In Touch</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Have a question or want to work together? Drop me a line.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold mb-4 text-primary">Contact Information</h3>
                <div className="flex gap-4 mb-8">
                  {personalInfo.socials.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Link
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 hover:scale-110 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 group"
                        aria-label={social.name}
                      >
                        <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    );
                  })}
                </div>

                <p className="text-muted-foreground mb-6 italic">
                  &quot;I am always exploring new frontiers in tech. If you see a synergy or have an opportunity in mind, I invite you to review my detailed professional history.&quot;
                </p>

                <div className="space-y-4">
                  <p className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><strong>Phone:</strong> {personalInfo.phone}</p>
                  <p className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><strong>Email:</strong> {personalInfo.email}</p>
                  <p className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><strong>Location:</strong> {personalInfo.location}</p>
                </div>

                <div className="mt-8">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-primary/20 hover:bg-primary/10 hover:border-primary group relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                    asChild
                  >
                    <Link href="/JayadeepGowda_CV.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <span className="relative z-10">Download CV</span>
                      <FileDown className="w-4 h-4 relative z-10 group-hover:translate-y-1 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true }}
              >
                <form ref={formRef} action={dispatch} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Your Name" required className="bg-white/5 border-white/10 focus:border-primary/50" />
                    {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="your.email@example.com" required className="bg-white/5 border-white/10 focus:border-primary/50" />
                    {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" placeholder="Your message..." required className="bg-white/5 border-white/10 focus:border-primary/50 min-h-[120px]" />
                    {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
                  </div>
                  <SubmitButton />
                </form>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedSection>
  );
}
