import React from 'react';
import { Linkedin, HardDrive, Waves, Bot, Share2, ScanLine, Brain, Network, Cpu, Workflow } from "lucide-react";
import { SiMongodb, SiExpress, SiReact, SiNodedotjs, SiPython, SiTypescript, SiJavascript, SiDocker, SiGit, SiFlask, SiWebrtc, SiGithub, SiTailwindcss, SiFirebase, SiAutodesk, SiOpencv, SiCplusplus, SiInstagram, SiGoogle, SiNextdotjs } from "react-icons/si";
import type { IconType } from "react-icons";

export const personalInfo = {
    name: "Jayadeep Gowda KB",
    title: "Robotics & AI Engineer and Full-Stack Development Architect",
    location: "Bangalore, India",
    phone: "+91 8310491224",
    email: "jayadeepgowda24@gmail.com",
    socials: [
        { name: "LinkedIn", url: "https://linkedin.com/in/jay7788", icon: Linkedin },
        { name: "GitHub", url: "https://github.com/jay7-tech", icon: SiGithub },
        { name: "Instagram", url: "https://www.instagram.com/jayadeep_gowda_?igsh=MWZsMGNud25qcjFyaw==", icon: SiInstagram },
    ],
    summary: "An impact-focused Engineering undergraduate specializing in Robotics and Artificial Intelligence. I drive innovation by fusing cutting-edge technology with an entrepreneurial mindset to architect sustainable solutions with tangible real-world impact. Proficient across the MERN stack, advanced machine learning, and autonomous hardware, I am a strategic communicator who excels at mastering complex technical challenges through excellence and strategic communication.",
};

export const skills = [
    { name: "MongoDB", description: "Database", icon: "SiMongodb" },
    { name: "Express.js", description: "Backend framework", icon: "SiExpress" },
    { name: "React", description: "Frontend library", icon: "SiReact" },
    { name: "Node.js", description: "Runtime environment", icon: "SiNodedotjs" },
    { name: "JavaScript", description: "", icon: "SiJavascript" },
    { name: "TypeScript", description: "", icon: "SiTypescript" },
    { name: "Tailwind CSS", description: "Styling", icon: "SiTailwindcss" },
    { name: "Python", description: "", icon: "SiPython" },
    { name: "Machine Learning", description: "", icon: "Share2" },
    { name: "Computer Vision", description: "", icon: "ScanLine" },
    { name: "YOLO", description: "Object detection", icon: "YoloIcon" },
    { name: "ABB Robot Simulation", description: "Industrial arm operation and simulation", icon: "Bot" },
    { name: "Autodesk", description: "Engineering and design", icon: "SiAutodesk" },
    { name: "Firebase", description: "Cloud services and deployment", icon: "SiFirebase" },
    { name: "Docker", description: "Containerization", icon: "SiDocker" },
    { name: "Git", description: "Version control", icon: "SiGit" },
    { name: "GitHub", description: "Repository hosting", icon: "SiGithub" },
    { name: "WebRTC", description: "Real-time communication", icon: "SiWebrtc" },
    { name: "Flask", description: "Python web framework", icon: "SiFlask" },
    { name: "OpenCV", icon: "SiOpencv" },
    { name: "C++", icon: "SiCplusplus" },
];

type Project = {
    title: string;
    recognition: string | null;
    images: string[];
    color: string;
    animationType: 'deck-shuffle' | 'perspective-push' | 'vertical-shuffle' | 'parallax-fan' | 'quad-gallery' | '3d-flip-reveal' | 'cinematic-hover';
    description: {
        paragraph: string;
        features: string[];
    };
    githubUrl: string;
    tags: { name: string; icon: IconType | ((props: any) => JSX.Element) }[];
    isFeatured: boolean;
}

export const projects: Project[] = [
    {
        title: "Cognis — Cognitive Pattern Engine",
        recognition: "Cognis solves the core flaw of conversational AI: LLMs answer, but they don’t remember when answering didn’t work.",
        images: ["cognis-hero", "cognis-2"],
        color: "bg-[#7c3aed]/10", // Violet/Purple
        animationType: "perspective-push",
        description: {
            paragraph: "Cognis turns past reasoning into a first-class signal. Unlike stateless LLMs that allow repetitive cognitive loops, Cognis stores reflections as structured vector memory, detects recurring failure patterns in O(n) time, and intervenes to prevent repeated mistakes—shifting AI from just answering questions to actively preventing failure.",
            features: [
                "Memory-Augmented Reasoning: Persists reflections in vector memory instead of treating history as disposable logs.",
                "Temporal Pattern Scoring: Analyzes reflections over time to detect recurring themes and failure loops.",
                "Intervention Pipeline: Conditions responses on prior failures ('You've been here before') to reduce unproductive queries by 40–60%."
            ]
        },
        githubUrl: "https://github.com/jay7-tech/Cognis",
        tags: [
            { name: "Memory-Augmentation", icon: Brain },
            { name: "VectorDB & FAISS", icon: HardDrive },
            { name: "Local LLMs (Ollama)", icon: Cpu },
            { name: "Temporal Analytics", icon: Network },
        ],
        isFeatured: true,
    },
    {
        title: "YoloMart | Smart Retail Ecosystem",
        recognition: "YoloMart bridges the gap between brick-and-mortar and e-commerce: picking up an item in-store is as analyzable as a click online.",
        images: ["yolomart-1", "yolomart-2"],
        color: "bg-[#FF3366]/10", // Pinkish
        animationType: "perspective-push",
        description: {
            paragraph: "YoloMart unifies the fractured retail experience into a seamless 'Phygital' ecosystem. Unlike traditional stores with blind spots or disconnected apps, YoloMart treats every physical interaction—pickup, scan, cart add—as a digital event, eliminating checkout lines and empowering data-driven decisions.",
            features: [
                "In-Store Digitization: RFID & WebSocket sync updates the digital cart instantly when physical items are handled.",
                "Frictionless Checkout: Scan & Go architecture eliminates queues with client-side comparison and instant payment.",
                "Context-Aware Assistant: AI analyzes cart contents in real-time to offer dietary insights and recipe synergy."
            ]
        },
        githubUrl: "https://github.com/jay7-tech/Yolo_mart-main.git",
        tags: [
            { name: "React + Vite", icon: SiReact },
            { name: "Node.js & WS", icon: SiNodedotjs },
            { name: "RFID Tech", icon: Share2 },
            { name: "WebSockets", icon: Waves },
        ],
        isFeatured: true,
    },
    {
        title: "High Five | Real-Time Social Platform",
        recognition: "High Five reimagine social discovery: connection is instantaneous, but privacy is absolute.",
        images: ["high-five-1", "high-five-2"],
        color: "bg-[#8e44ad]/10", // Purple
        animationType: "perspective-push",
        description: {
            paragraph: "High Five restores spontaneity to digital interaction without compromising privacy. Unlike algorithm-heavy platforms that mine user data, High Five operates on a 'consent-first' ephemeral model, using WebRTC for encrypted, peer-to-peer voice connections that leave no digital footprint.",
            features: [
                "Zero-Trace Connectivity: Ephemeral WebRTC architecture ensures voice data flows peer-to-peer and is never stored.",
                "Audio-Reactive Interface: Real-time frequency visualization transforms voice data into a dynamic, living interface.",
                "Consent-First Design: Dark-pattern-free UI where mutual active engagement is required for every interaction."
            ]
        },
        githubUrl: "https://github.com/jay7-tech/High_five.git",
        tags: [
            { name: "Flask", icon: SiFlask },
            { name: "WebSockets", icon: Waves },
            { name: "WebRTC", icon: SiWebrtc },
            { name: "JavaScript", icon: SiJavascript },
        ],
        isFeatured: true,
    },
    {
        title: "Neuro-AI | Cognitive Care Ecosystem",
        recognition: "A Holistic Digital Ecosystem for Alzheimer's & Dementia Care.",
        images: ["neuro-ai-hero", "neuro-ai-2"],
        color: "bg-[#00BCD4]/10", // Cyan/Teal
        animationType: "quad-gallery",
        description: {
            paragraph: "A holistic digital ecosystem bridging patients, caregivers, and clinicians. Uses Generative AI to preserve identity, reduce burnout, and provide actionable longitudinal data.",
            features: [
                "AI Companion: Gemini-powered 24/7 empathetic interaction and adaptive cognitive games.",
                "Care Loop: 3-role sync monitoring with real-time mood analytics for caregivers.",
                "Tech Stack: Scalable ecosystem on Next.js 15, TypeScript, and Google Genkit."
            ]
        },
        githubUrl: "https://github.com/jay7-tech/Neuro.ai.git",
        tags: [
            { name: "Next.js 15", icon: SiNextdotjs },
            { name: "Google Genkit", icon: SiGoogle },
            { name: "Gemini AI", icon: Bot },
            { name: "TypeScript", icon: SiTypescript },
        ],
        isFeatured: false,
    },
    {
        title: "Movifi | Online Show Booking Website",
        recognition: null,
        images: ["movifi", "yolomart"],
        color: "bg-[#3366FF]/10", // Blue
        animationType: "vertical-shuffle",
        description: {
            paragraph: "Developed a modern, online show booking website using TypeScript, focusing on a clean user interface and robust booking functionality.",
            features: [
                "Implemented a type-safe backend with Express.js and MongoDB.",
                "Designed a responsive and intuitive front-end with React.",
                "Ensured secure and efficient booking and payment processing."
            ]
        },
        githubUrl: "https://github.com/jay7-tech/movifi",
        tags: [
            { name: "TypeScript", icon: SiTypescript },
            { name: "React", icon: SiReact },
            { name: "Express.js", icon: SiExpress },
            { name: "MongoDB", icon: SiMongodb },
        ],
        isFeatured: false,
    }
];

export const experiences = [
    {
        role: "Intern",
        organization: "Frillory Design House",
        category: "INTERNSHIP",
        details: [
            "Collaborated with the Co-Founder on strategic design outreach and digital content narratives.",
            "Catalyzed firm presence by curating high-impact social media creatives and marketing materials.",
        ],
        image: "/images/project-assets/frillory certificate.jpg", // Frillory certificate
        images: [
            "/images/project-assets/frillory certificate.jpg",
        ]
    },

    {
        role: "Core Organizer",
        organization: "IDEATHON 2025",
        category: "INSTITUTIONAL",
        details: [
            "Spearheaded the orchestration of a national-level ideathon, hosting over 200+ teams and engaging 50+ colleges.",
            "Directed large-scale operational logistics, crisis resolution, in coordination with a dynamic core team.",
        ],
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop", // Hackathon/Event
            "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=600&auto=format&fit=crop", // Design/Workshop
            "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop", // Meeting
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop"  // Team
        ],
    },
    {
        role: "Technical Event Moderator",
        organization: "Poster Presentation",
        category: "INSTITUTIONAL",
        details: [
            "Arbitrated technical events, expertly coordinating communication between participants, esteemed judges, and organizing teams.",
            "Managed critical event timelines and presenter introductions, demonstrating impeccable time management skills.",
        ],
        image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=600&auto=format&fit=crop", // Conference/Presentation
        images: [
            "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1475721027767-pns-placeholder?q=80&w=600&auto=format&fit=crop"
        ]
    },

];

export const marqueeSkills = [
    "HEY THERE",
    "CIAO",
    "INTERACTIVE",
    "LOADING...",
    "RELIABLE",
    "PERFECTION",
    "SCALABLE",
    "PRESS START ▶",
];

export const skills_old = {
    "Full-Stack Development": ["MERN Stack", "JavaScript", "Python", "TypeScript", "React", "Node.js", "MongoDB", "Express.js", "Flask"],
    "Autonomous Systems & AI": ["Computer Vision", "YOLO", "Autonomous Systems", "Robotics Simulation", "ABB Arm Robot"],
    "Tools & Platforms": ["WebSockets", "WebRTC", "Git", "GitHub", "Docker"],
};
