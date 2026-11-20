export const portfolio = {
  name: "Sakshi Shevkari",
  title: "AI & Software Engineer",
  email: "sakshishevkari32@gmail.com",
  portrait: "/images/sakshi-portfolio-portrait.jpg",
  location: "Pune, India",
  about: "I’m Sakshi, an AI & Software Engineer exploring the intersection of software engineering and machine learning. My work spans AI/ML research, full-stack development, and the deployment workflows that bring software into use. I enjoy turning complex problems into thoughtful, practical systems.",
  education: { degree: "Bachelor in Computer Applications (Science)", college: "Pratibha College of Commerce and Computer Studies", period: "2023–2026", cgpa: "7.91" },
  skills: [
    ["PYTHON", "PYTORCH", "OPENCV", "MACHINE LEARNING", "AI"],
    ["REACT", "NODE.JS", "EXPRESS", "MONGODB", "REST APIs"],
    ["GITHUB", "HOSTINGER", "PHP", "MYSQL", "CI/CD"],
    ["AWS", "DEVOPS", "JAVA", "DSA", "GENERATIVE AI"],
  ],
  experience: [
    { company: "EvoTech IT Services", role: "Intern", period: "March 2026 – October 2026", description: "Supported ERP projects through staging configuration, version control, deployment verification, database connectivity checks, backups and restoration testing. Analyzed application logs, troubleshot configuration and API issues, and maintained deployment checklists and technical handover documentation." },
    { company: "Morya Pharmacy", role: "Supply Chain Assistant / Intern", period: "June 2022 – May 2023", description: "Supported medicine and medical-supply inventory, stock and expiry-date monitoring, supplier coordination, stock records, documentation, and billing." },
  ],
  services: ["AI & MACHINE LEARNING", "FULL-STACK DEVELOPMENT", "DEVOPS & DEPLOYMENT", "DATABASE & API INTEGRATION", "SOFTWARE RESEARCH & PROBLEM SOLVING"],
  projects: [
    { id: "iris", title: "IRIS LIVENESS", subtitle: "Spatio-Temporal Deep Learning", type: "AI / COMPUTER VISION", mediaLabel: "IRIS LIVENESS", mediaPath: "/images/iris-liveness.jpg", mediaAlt: "Digital iris visualization representing iris liveness detection research", description: "A lightweight spatio-temporal framework for iris liveness detection against video replay attacks. MobileNetV3-Small extracts spatial features; an LSTM analyzes temporal sequences from preprocessed video.", tags: ["Python", "PyTorch", "OpenCV", "MobileNetV3-Small + LSTM"], results: "97.06% validation accuracy · reported 100% test accuracy · 7.26 MB optimized model", href: "https://github.com/escapist0411/iris-spatiotemporal-liveness-detection", status: "RESEARCH PROJECT" },
    { id: "bugs", title: "BUG LIFESPAN", subtitle: "Machine Learning for Software Maintenance", type: "ML / SOFTWARE RESEARCH", mediaLabel: "BUG LIFESPAN", mediaPath: "/images/projects/bug-lifespan.webp", description: "Current research into predicting expected bug-resolution time at the initial reporting stage. Dataset structuring and feature engineering use priority, severity, components, reporter reliability, and developer workload to explore short-, medium-, and long-lived bug classification for triaging and maintenance planning.", tags: ["Machine Learning", "Repository Metadata", "Feature Engineering"], status: "ONGOING RESEARCH" },
    { id: "reservation", title: "RESTAURANT RESERVATION", subtitle: "Multi-Restaurant Booking System", type: "WEB / APPLICATION DEVELOPMENT", mediaLabel: "TABLE RESERVATION", mediaPath: "/images/projects/restaurant-reservation.webp", description: "A web-based reservation system for multiple restaurants, with user authentication, table booking, reservation confirmation, and database-driven availability. Built with a focus on reservation efficiency and user experience.", tags: ["Authentication", "Table Booking", "Database Design"], status: "DECEMBER 2025 – APRIL 2026" },
    { id: "erp", title: "ERP DEPLOYMENT", subtitle: "Engineering Experience at EvoTech", type: "PROFESSIONAL EXPERIENCE", mediaLabel: "ERP DEPLOYMENT", mediaPath: "/images/erp-deployment.png", mediaAlt: "ERP workflow diagram connecting GitHub, Hostinger, and PHP/MySQL to staging, verification, and deployment", description: "As an intern at EvoTech IT Services, supported ERP staging and deployment verification, database connectivity, backups and restoration testing, log analysis, and configuration/API troubleshooting. Contributed deployment checklists and maintenance documentation.", tags: ["Hostinger", "GitHub", "PHP", "MySQL", "REST APIs"], status: "MARCH 2026 – OCTOBER 2026" },
  ],
  research: { ongoing: "Early-Stage Prediction of Software Bug Lifespan Using Repository Metadata and Machine Learning", iris: "Lightweight Spatio-Temporal Deep Learning Framework for Iris Liveness Detection Against Video Replay Attacks" },
  learning: ["DevOps and AI on AWS", "CI/CD for Generative AI Applications", "MERN Full Stack Web Development", "Data Structures and Algorithms using Java", "IBM AI Foundations", "AWS Generative AI / application modernization", "IBM Introduction to DevOps"],
  contact: { availability: "AVAILABLE FOR AI, SOFTWARE & DEVELOPMENT OPPORTUNITIES", description: "Have a software problem to solve or an idea to explore? I’m looking for opportunities to contribute, learn, and grow through hands-on work in AI, software development, and machine learning.", focus: "AI / SOFTWARE / ML", socials: [{ name: "GitHub", url: null }, { name: "LinkedIn", url: null }] },
};
export const navigation = ["Home", "About", "Services", "Projects", "Contact"];
