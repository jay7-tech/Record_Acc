"use client";
import { motion } from 'framer-motion';
import { useActionState, useEffect, useRef, useState } from "react";
import { FileDown, Copy, Check } from "lucide-react";
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
import { Spotlight } from "@/components/ui/spotlight";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending..." : "Send Message"}
    </Button>
  );
}

interface ContactFormState {
  success?: boolean;
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
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard API unavailable — the email is still right there to select/copy by hand
    }
  };

  useEffect(() => {
    if (state.message) {
      const isSuccess = state.success;
      toast({
        variant: isSuccess ? "default" : "destructive",
        title: isSuccess ? "Success!" : "Error",
        description: state.message,
      });

      if (isSuccess) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <AnimatedSection id="contact" className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full opacity-30 pointer-events-none" />

        {/* Slow-spinning conic gradient ring — a bit of visual signature so this
            card doesn't read as "just another form at the bottom of the page". */}
        <div className="absolute -inset-[2px] rounded-[26px] opacity-60 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-[-50%] animate-[spin_8s_linear_infinite]"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(124,58,237,0.5) 10%, transparent 22%, transparent 70%, rgba(56,189,248,0.5) 82%, transparent 94%)',
            }}
          />
        </div>

        <Spotlight className="group">
        <Card className="relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl group-hover:border-sky-400/30 transition-colors duration-500">
          <CardHeader className="text-center">
            <p className="mono-label text-xs text-muted-foreground mb-1">/ 06 Contact</p>
            <CardTitle className="font-headline text-3xl md:text-4xl text-gradient-signal">Get In Touch</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Got an idea or a role in mind? I read every message myself.
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
                <div className="flex flex-wrap gap-2.5 mb-6">
                  {personalInfo.socials.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Link
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/social flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-primary/15 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.4)] transition-all duration-300"
                      >
                        <Icon className="w-4 h-4 text-muted-foreground group-hover/social:text-primary transition-colors" />
                        <span className="text-sm text-muted-foreground group-hover/social:text-foreground transition-colors">{social.name}</span>
                      </Link>
                    );
                  })}
                </div>

                <p className="text-muted-foreground mb-6 italic">
                  &quot;I am always exploring new frontiers in tech. If you see a synergy or have an opportunity in mind, I invite you to review my detailed professional history.&quot;
                </p>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="group/email flex w-full items-center justify-between gap-2 p-3 rounded-lg bg-white/5 hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-colors text-left"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <strong className="shrink-0">Email:</strong>
                      <span className="truncate">{personalInfo.email}</span>
                    </span>
                    <span className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground group-hover/email:text-primary transition-colors">
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </span>
                  </button>
                  <p className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><strong>Phone:</strong> {personalInfo.phone}</p>
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
                    <Input id="name" name="name" placeholder="Your Name" required className="bg-white/[0.07] border-2 border-white/25 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors" />
                    {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="your.email@example.com" required className="bg-white/[0.07] border-2 border-white/25 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors" />
                    {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" placeholder="Your message..." required className="bg-white/[0.07] border-2 border-white/25 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors min-h-[120px]" />
                    {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
                  </div>
                  <SubmitButton />
                </form>
              </motion.div>
            </div>
          </CardContent>
        </Card>
        </Spotlight>
      </div>
    </AnimatedSection>
  );
}
