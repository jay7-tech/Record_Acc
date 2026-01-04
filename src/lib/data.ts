import React from 'react';
import { Linkedin, HardDrive, Waves, Bot, Share2, ScanLine } from "lucide-react";
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
    animationType: 'deck-shuffle' | 'perspective-push' | 'vertical-shuffle' | 'parallax-fan' | 'quad-gallery';
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
        title: "YoloMart | Smart Retail Ecosystem",
        recognition: "Secured 2nd Place at GlitchVerse 2k25 Project Expo at BIT.",
        images: ["yolomart-1", "yolomart-2"],
        color: "bg-[#FF3366]/10", // Pinkish
        animationType: "perspective-push",
        description: {
            paragraph: "A seamless 'Phygital' retail ecosystem merging in-store RFID interactions with a smart digital storefront. Connects physical product interactions to a real-time digital cart, featuring an AI-powered nutrition assistant and smart comparison engine.",
            features: [
                "Scan & Go: Advanced client-side barcode/QR scanning with @zxing for instant product details and comparative nutrition analysis.",
                "RFID 'Magic' Cart: Real-time WebSocket synchronization that instantly updates the digital cart when physical items are picked up (RFID-tagged).",
                "AI Shopping Assistant: Integrated ChatWidget providing personalized dietary recommendations and recipe suggestions based on user preferences."
            ]
        },
        githubUrl: "https://github.com/jay7-tech/yolomart",
        tags: [
            { name: "React + Vite", icon: SiReact },
            { name: "Node.js & WS", icon: SiNodedotjs },
            { name: "RFID Tech", icon: Share2 }, // Using Share2 as a proxy for connection/radio if Radio isn't available, or I'll add imports
            { name: "WebSockets", icon: Waves },
        ],
        isFeatured: true,
    },
    {
        title: "Neuro-AI | Cognitive Care Ecosystem",
        recognition: "A Holistic Digital Ecosystem for Alzheimer's & Dementia Care.",
        images: ["neuro-ai-hero", "neuro-ai-2"],
        color: "bg-[#00BCD4]/10", // Cyan/Teal for Compassion/Medical
        animationType: "parallax-fan",
        description: {
            paragraph: "Confronting the silent epidemic of Alzheimer's, Neuro-AI is a holistic digital ecosystem designed to bridge the gap between patients, caregivers, and clinicians. It leverages advanced Generative AI to preserve patient identity, reduce caregiver burnout, and provide doctors with actionable, longitudinal data.",
            features: [
                "Patient Empowerment: Revolutionizes dementia care with a Gemini-powered AI Companion that offers 24/7 empathetic interaction and adaptive cognitive games to preserve identity.",
                "Compassionate Care Loop: Unifies the care continuum via a 3-role sync monitoring system, providing real-time mood analytics to prevent caregiver burnout.",
                "High-Value Tech Stack: Architected a scalable ecosystem using Next.js 15, TypeScript, and Google Genkit for enterprise-grade security and AI performance."
            ]
        },
        githubUrl: "https://github.com/jay7-tech/Neuro.ai.git",
        tags: [
            { name: "Next.js 15", icon: SiNextdotjs },
            { name: "Google Genkit", icon: SiGoogle },
            { name: "Gemini AI", icon: Bot },
            { name: "TypeScript", icon: SiTypescript },
        ],
        isFeatured: true,
    },
    {
        title: "High Five | Real-Time Social Platform",
        recognition: null,
        images: ["high-five-1", "high-five-2"],
        color: "bg-[#8e44ad]/10", // Purple
        animationType: "vertical-shuffle",
        description: {
            paragraph: "Conceptualized and deployed a high-energy platform for anonymous voice connections using Flask and WebSockets, fostering spontaneous social interactions.",
            features: [
                "Deployed a robust WebRTC engine with STUN/TURN servers for reliable connections.",
                "Revolutionized UX with an audio-reactive interface that pulses with voice frequency.",
                "Championed a 'Consent-First' architecture for revealing social handles."
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
        role: "Core Organizer",
        organization: "IDEATHON 2025",
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
    {
        role: "Intern",
        organization: "Frillory Design House",
        details: [
            "Collaborated with the Co-Founder on strategic design outreach and digital content narratives.",
            "Catalyzed firm presence by curating high-impact social media creatives and marketing materials.",
        ],
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop", // Modern Office/Design
        images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1497215842964-222b4bef9728?q=80&w=600&auto=format&fit=crop"
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
