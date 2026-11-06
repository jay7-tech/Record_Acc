import React, { type JSX } from 'react';
import { Linkedin, HardDrive, Waves, Bot, Share2, ScanLine, Brain, Network, Cpu, Workflow } from "lucide-react";
import { SiMongodb, SiExpress, SiReact, SiNodedotjs, SiPython, SiTypescript, SiJavascript, SiDocker, SiGit, SiFlask, SiWebrtc, SiGithub, SiTailwindcss, SiFirebase, SiAutodesk, SiOpencv, SiCplusplus, SiInstagram, SiGoogle, SiNextdotjs, SiFastapi, SiOllama, SiPostgresql, SiPytorch, SiLangchain } from "react-icons/si";
import type { IconType } from "react-icons";

export const personalInfo = {
    name: "Jayadeep Gowda KB",
    title: "AI/ML Engineer · Robotics · Software Engineer",
    location: "Bangalore, India",
    phone: "+91 8310491224",
    email: "jayadeepgowda24@gmail.com",
    socials: [
        { name: "LinkedIn", url: "https://linkedin.com/in/jay7788", icon: Linkedin },
        { name: "GitHub", url: "https://github.com/jay7-tech", icon: SiGithub },
        { name: "Instagram", url: "https://www.instagram.com/jayadeep_gowda_?igsh=MWZsMGNud25qcjFyaw==", icon: SiInstagram },
    ],
    summary: "I build intelligent systems that bridge machine learning and the physical world. From computer vision pipelines to local LLM integration, I architect scalable solutions with robotic precision and full stack engineering.",
};

export const skills = [
    { name: "Python", description: "Primary Language", icon: "SiPython" },
    { name: "JavaScript", description: "Frontend & Backend", icon: "SiJavascript" },
    { name: "TypeScript", description: "Typed Logic", icon: "SiTypescript" },
    { name: "C++", description: "Systems & Robotics", icon: "SiCplusplus" },
    { name: "SQL", description: "Relational Databases", icon: "SiPostgresql" },
    { name: "MongoDB", description: "Document Database", icon: "SiMongodb" },
    { name: "FastAPI", description: "High Performance API", icon: "SiFastapi" },
    { name: "Node.js", description: "Runtime Environment", icon: "SiNodedotjs" },
    { name: "React", description: "Frontend Library", icon: "SiReact" },
    { name: "Next.js", description: "Full Stack Framework", icon: "SiNextdotjs" },
    { name: "Tailwind CSS", description: "Styling", icon: "SiTailwindcss" },
    { name: "Docker", description: "Containerization", icon: "SiDocker" },
    { name: "Git", description: "Version Control", icon: "SiGit" },
    { name: "Machine Learning", description: "Applied ML", icon: "SiPytorch" },
    { name: "Computer Vision", description: "Real Time Inference", icon: "ScanLine" },
    { name: "Large Language Models", description: "Generative AI", icon: "Bot" },
    { name: "LangChain", description: "AI Orchestration", icon: "SiLangchain" },
    { name: "Ollama", description: "Local LLM Serving", icon: "SiOllama" },
    { name: "Embedded Systems", description: "Hardware Integration", icon: "Cpu" },
    { name: "WebRTC", description: "Real Time Communication", icon: "SiWebrtc" },
    { name: "OpenCV", description: "Computer Vision", icon: "SiOpencv" },
    { name: "Antigravity", description: "Agentic AI", icon: "AntigravityIcon" },
    { name: "TensorFlow", description: "Deep Learning", icon: "SiTensorflow" },
    { name: "ONNX", description: "Model Optimization", icon: "SiOnnx" },
    { name: "PyTorch", description: "Deep Learning Framework", icon: "SiPytorch" },
    { name: "ROS2", description: "Robotics Middleware", icon: "SiRos" },
    { name: "YOLO", description: "Real Time Object Detection", icon: "Target" },
    { name: "Hugging Face", description: "Transformer Models", icon: "SiHuggingface" },
    { name: "Linux", description: "Systems & ARM Dev", icon: "SiLinux" },
    { name: "OpenVINO", description: "Edge Inference Toolkit", icon: "SiIntel" },
];

export type Project = {
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
        title: "MEMO — Embodied Edge AI Companion",
        recognition: "Built a novel embodied intelligence architecture, optimizing LLM inference on edge hardware.",
        images: ["memo-hero", "memo-details"],
        color: "bg-[#2c3e50]/10", // Dark technical blue/grey
        animationType: "perspective-push",
        description: {
            paragraph: "A production grade embodied AI product, built from bare metal firmware up to a full cognitive stack. MEMO runs six or more AI models at once — vision, voice, touch, language, navigation — on a single Raspberry Pi 5, with a custom event driven nervous system linking reasoning to millisecond level reflexes.",
            features: [
                "Production Grade Architecture: A fault tolerant, thread safe EventBus handles rapid async input with zero race conditions.",
                "AI Orchestration: Hybrid voice stack (Vosk plus Gemini 1.5 Flash) and parallel vision pipelines run under 200ms end to end.",
                "Hardware Optimization: Kernel level tuning, adaptive frame skipping, and thermal management keep uptime at 99.9%.",
                "Full Stack Ownership: Custom PCB, 3D printed chassis, firmware, and a React emotion engine, built end to end."
            ]
        },
        githubUrl: "https://github.com/jay7-tech/MEMO", // Validated URL
        tags: [
            { name: "Python", icon: SiPython },
            { name: "OpenCV", icon: SiOpencv },
            { name: "TensorFlow", icon: SiPytorch },
            { name: "Raspberry Pi", icon: Cpu },
        ],
        isFeatured: true,
    },
    {
        title: "Cognis — Cognitive Pattern Engine",
        recognition: "Cognis solves the core flaw of conversational AI: LLMs answer, but they don’t remember when answering didn’t work.",
        images: ["cognis-hero", "cognis-2"],
        color: "bg-[#7c3aed]/10", // Violet/Purple
        animationType: "perspective-push",
        description: {
            paragraph: "Cognis turns past reasoning into a signal the system can act on. It stores reflections as structured vector memory, spots repeating failure patterns in linear time, and steps in before mistakes repeat — shifting AI from answering questions to preventing failure.",
            features: [
                "Memory Augmented Architecture: Detects and stores recurring reasoning failures across sessions.",
                "Temporal Pattern Scoring: A custom algorithm cuts unproductive AI queries by 40 to 60 percent.",
                "Local First Performance: A local inference service retrieves results in under 200ms using Ollama."
            ]
        },
        githubUrl: "https://github.com/jay7-tech/Cognis",
        tags: [
            { name: "FastAPI", icon: SiFastapi },
            { name: "VectorDB & FAISS", icon: HardDrive },
            { name: "Ollama (Local LLMs)", icon: SiOllama },
            { name: "Memory Augmentation", icon: Brain },
        ],
        isFeatured: true,
    },
    {
        title: "YoloMart | Smart Retail Ecosystem",
        recognition: "YoloMart connects physical retail and online shopping, so picking up an item in store is as trackable as a click online.",
        images: ["yolomart-1", "yolomart-2"],
        color: "bg-[#FF3366]/10", // Pinkish
        animationType: "perspective-push",
        description: {
            paragraph: "YoloMart unifies retail into one seamless phygital ecosystem. Every physical action — pickup, scan, cart add — becomes a digital event, removing checkout lines and powering decisions with real data.",
            features: [
                "In Store Digitization: RFID and WebSocket sync update the digital cart the instant an item is handled.",
                "Frictionless Checkout: Scan and Go removes queues with on device comparison and instant payment.",
                "Context Aware Assistant: AI reads cart contents live to suggest dietary insights and recipe pairings."
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
        title: "High Five | Real Time Social Platform",
        recognition: "High Five reimagines social discovery: connection is instant, privacy is absolute.",
        images: ["high-five-1", "high-five-2"],
        color: "bg-[#8e44ad]/10", // Purple
        animationType: "perspective-push",
        description: {
            paragraph: "High Five brings spontaneity back to digital interaction without touching privacy. It runs on a consent first, ephemeral model, using WebRTC for encrypted peer to peer voice that leaves no trace.",
            features: [
                "Zero Trace Connectivity: Voice flows peer to peer over WebRTC and is never stored.",
                "Audio Reactive Interface: Live frequency visuals turn voice into a dynamic, living interface.",
                "Consent First Design: A clean UI with no dark patterns, built on mutual, active engagement."
            ]
        },
        githubUrl: "https://github.com/jay7-tech/High_five.git",
        tags: [
            { name: "FastAPI", icon: SiFastapi },
            { name: "WebSockets", icon: Waves },
            { name: "WebRTC", icon: SiWebrtc },
            { name: "JavaScript", icon: SiJavascript },
        ],
        isFeatured: false,
    },
    {
        title: "Neuro AI | Cognitive Care Ecosystem",
        recognition: "A Holistic Digital Ecosystem for Alzheimer's & Dementia Care.",
        images: ["neuro-ai-hero", "neuro-ai-2"],
        color: "bg-[#00BCD4]/10", // Cyan/Teal
        animationType: "quad-gallery",
        description: {
            paragraph: "A digital ecosystem connecting patients, caregivers, and clinicians. Generative AI helps preserve identity, reduce burnout, and track long term progress.",
            features: [
                "AI Companion: Gemini powered, available 24/7, with empathetic chat and adaptive cognitive games.",
                "Care Loop: Three role sync monitoring with live mood analytics for caregivers.",
                "Tech Stack: Scalable ecosystem on Next.js 15, TypeScript, and Google Genkit."
            ]
        },
        githubUrl: "https://github.com/jay7-tech/Neuro.ai.git",
        tags: [
            { name: "Next.js 15", icon: SiNextdotjs },
            { name: "Google Genkit", icon: SiGoogle },
            { name: "Gemini AI", icon: Bot },
            { name: "Ollama", icon: SiOllama },
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
            paragraph: "A modern show booking site built with TypeScript, focused on a clean interface and reliable booking.",
            features: [
                "Implemented a type safe backend with Express.js and MongoDB.",
                "Designed a responsive and intuitive front end with React.",
                "Ensured secure and efficient booking and payment processing."
            ]
        },
        githubUrl: "https://github.com/jay7-tech/movifi-repo.git",
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
        role: "Machine Learning Research Intern",
        organization: "IISc Bangalore",
        category: "INTERNSHIP",
        details: [
            "Turned noisy sensor data from next generation MXene piezoresistive wristbands into clean, ready to analyze physiological signals, building the full pipeline from ingestion to feature extraction.",
            "Built a modeling framework comparing classical machine learning and deep learning architectures, validated with stratified cross validation across a 21 dimensional feature space, now the lab's benchmark method.",
            "Worked with postdoctoral researchers, PhD candidates, and collaborators in Poland to turn raw sensor data into research grade assets, bridging materials science and applied ML."
        ],
        image: "/image.png",
        images: [
            "/image.png"
        ]
    },
    {
        role: "RnD Intern",
        organization: "Sirena Technologies",
        category: "INTERNSHIP",
        details: [
            "Nino Humanoid: Built the kinematic control layer for Nino, with custom IK solvers and optimized joint trajectories for stable bipedal walking.",
            "Twist Quadruped: Built the locomotion stack for Twist, using Zero Moment Point stability and torque control for uneven terrain.",
            "Product Ownership: Led the full R&D lifecycle of MEMO, from embedded design to cognitive architecture, to a production ready embodied AI companion."
        ],
        image: "/images/sirena certificate.png",
        images: [
            "/images/sirena certificate.png"
        ]
    },
    {
        role: "Intern",
        organization: "Frillory Design House",
        category: "INTERNSHIP",
        details: [
            "Optimized technical workflows, improving content publishing consistency by 30%.",
            "Reduced manual content handling by 25% using generative AI tools and layout optimization.",
            "Collaborated with designers to deliver production ready assets under tight deadlines."
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
            "Jointly led the full orchestration of a national level ideathon, scaling it to 200+ teams from 50+ colleges.",
            "Drove large scale logistics and planning for a seamless experience across 600+ participants and stakeholders.",
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
            "Arbitrated technical events, coordinating communication between participants, judges, and organizers.",
            "Managed event timelines and presenter introductions with precise time management.",
        ],
        image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=600&auto=format&fit=crop", // Conference/Presentation
        images: [
            "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1475721027767-pns-placeholder?q=80&w=600&auto=format&fit=crop"
        ]
    },
];

export const certifications = [
    {
        title: "Machine Learning & AI Bootcamp",
        issuer: "Udemy",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
        description: "Comprehensive validation of neural networks, deep learning models, and predictive analytics pipelines.",
        category: "Machine Learning",
        color: "from-blue-600/20 to-indigo-600/20",
        link: "/Ml udemy certificate.pdf"
    },
    {
        title: "Infosys Springboard: Emerging Tech",
        issuer: "Infosys",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
        description: "Certified expertise in modern tech stacks and corporate software development lifecycles.",
        category: "Full Stack",
        color: "from-cyan-500/20 to-blue-500/20",
        link: "/Infosys.pdf"
    },
    {
        title: "PLC & Industrial Automation",
        issuer: "Siemens (Forage)",
        image: "https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?q=80&w=800&auto=format&fit=crop",
        description: "Technical certification in industrial control systems and automated manufacturing workflows.",
        category: "Automation",
        color: "from-amber-500/20 to-orange-500/20",
        link: "/simens.pdf"
    },
    {
        title: "Version Control: Git & GitHub",
        issuer: "Professional Certification",
        image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=800&auto=format&fit=crop",
        description: "Certified proficiency in distributed version control, collaborative branching strategies, and repository management.",
        category: "DevOps",
        color: "from-orange-600/20 to-red-600/20",
        link: "/LUEGGMAR1251657.pdf"
    }
];

export const impactMetrics = [
    { label: "Event Reach", value: "200+ Teams", description: "Coordinated national level participants at Ideathon 2025" },
    { label: "Projects Built", value: "15+", description: "From AI Agents to Embedded Systems" },
    { label: "Tech Communities", value: "3+", description: "Active contribution to institutional tech hubs" },
];

export const marqueeSkills = [
    "NEURAL ARCHITECT",
    "COSMIC CODE",
    "SYNAPTIC SYNERGY",
    "SILICON SOUL",
    "BEYOND BINARY",
    "ALGORITHMIC ARTISTRY",
    "ROBOTIC PRECISION",
    "QUANTUM LEAP",
    "DIGITAL FRONTIER",
    "EMERGENT DESIGN",
];

export const skills_old = {
    "Full Stack Development": ["MERN Stack", "JavaScript", "Python", "TypeScript", "React", "Node.js", "MongoDB", "Express.js", "Flask"],
    "Autonomous Systems & AI": ["Computer Vision", "YOLO", "Autonomous Systems", "Robotics Simulation", "ABB Arm Robot"],
    "Tools & Platforms": ["WebSockets", "WebRTC", "Git", "GitHub", "Docker"],
};
