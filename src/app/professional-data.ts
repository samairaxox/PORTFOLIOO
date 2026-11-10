export type SemesterResult = { label: string; score: number };

export const semesters: SemesterResult[] = [
  { label: "01", score: 9.54 },
  { label: "02", score: 9.64 },
  { label: "03", score: 9.72 },
  { label: "04", score: 10 },
];

export const unweightedSemesterAverage = (
  Math.round((semesters.reduce((total, semester) => total + semester.score, 0) / semesters.length + Number.EPSILON) * 100) / 100
).toFixed(2);

export const education = {
  degree: "B.Tech in Information Technology",
  institution: "K. J. Somaiya College of Engineering",
  location: "Mumbai, India",
  period: "2024–2028",
  graduation: "2028",
};

export type ExperienceRecord = {
  date: string;
  kind: string;
  name: string;
  role: string;
  detail: string;
  contributions: string[];
  tags?: string[];
  incoming?: boolean;
};

export const experience: ExperienceRecord[] = [
  {
    date: "SUMMER 2027",
    kind: "INCOMING",
    name: "JPMorgan Chase",
    role: "Software Engineering Intern",
    detail: "Incoming internship; no completed-role accomplishments are listed.",
    contributions: [],
    incoming: true,
  },
  {
    date: "MAY — JULY 2026",
    kind: "INTERNSHIP",
    name: "Investigen",
    role: "AI Intern",
    detail: "AI internship work in financial data automation and regulatory-document workflows.",
    contributions: [
      "Developed an AMFI mutual-fund data pipeline with Python and Pandas for data cleaning and PostgreSQL ingestion.",
      "Built a SID/KIM compliance checker that extracts 170+ fields from regulatory PDFs and validates rules.",
      "Automated Scheme Information Document generation using structured Python templates.",
    ],
    tags: ["Python", "Pandas", "PostgreSQL", "PDF processing"],
  },
  {
    date: "MAY — AUGUST 2025",
    kind: "INTERNSHIP",
    name: "Orcawise",
    role: "Software Engineer Intern",
    detail: "Contributed to AI chatbot architecture and application development with an international engineering team.",
    contributions: [
      "Contributed to AI chatbot architecture and workflow design using LangChain and FAISS.",
      "Collaborated on feature development and application integration.",
    ],
    tags: ["LangChain", "FAISS"],
  },
  {
    date: "AUGUST 2025 — PRESENT",
    kind: "COMMUNITY / LEADERSHIP",
    name: "CodeCell KJSCE",
    role: "Marketing Team Member",
    detail: "Supporting technical community onboarding and industry outreach.",
    contributions: ["Co-hosted technical onboarding sessions for 500+ students.", "Supported industry outreach."],
  },
  {
    date: "2025 — 2026",
    kind: "COMMUNITY / LEADERSHIP",
    name: "Google Developer Groups (GDG)",
    role: "Core Team Member",
    detail: "Helping bring developers together through technical sessions and workshops.",
    contributions: ["Co-hosted a Golang technical session.", "Supported developer workshops."],
  },
];

export type ProjectRecord = {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  category: string;
  year: string;
  summary: string;
  problem: string;
  contribution: string[];
  features: string[];
  technologies: string[];
  technologyNote?: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  links: { label: string; href: string }[];
  tone: "oxblood" | "sage" | "plum" | "ink" | "rose";
};

export const projects: ProjectRecord[] = [
  {
    id: "signalforge",
    number: "01",
    name: "SignalForge",
    subtitle: "AI-Powered Financial Research",
    category: "FINANCIAL RESEARCH / AI",
    year: "2026",
    summary: "An AI-powered investment research workflow for analysing annual reports, quarterly results, and exchange filings.",
    problem: "Investment research draws on disclosures spread across long, varied documents. The workflow is designed to make evidence and contradictions easier to examine.",
    contribution: [
      "Built an AI-powered research workflow for annual reports, quarterly results, and exchange filings.",
      "Integrated claim verification, evidence triangulation, and contradiction detection to produce source-backed insights.",
    ],
    features: ["Financial disclosure analysis", "Claim verification", "Evidence triangulation", "Contradiction detection"],
    technologies: [],
    technologyNote: "The résumé does not specify a project-specific stack.",
    links: [],
    tone: "oxblood",
  },
  {
    id: "eureka",
    number: "02",
    name: "Eureka!",
    subtitle: "Multi-Agent AI Study Platform",
    category: "AI / EDUCATION",
    year: "2026",
    summary: "A study platform using four LangGraph agents to support quizzes, flashcards, summarisation, and study planning.",
    problem: "Study material often needs to be reshaped into different learning modes. Eureka! brings those modes together with PDF-grounded content generation.",
    contribution: [
      "Developed a React, FastAPI, and PostgreSQL platform with four LangGraph agents for quizzes, flashcards, summarisation, and study planning.",
      "Implemented retrieval-augmented generation with FAISS and Hugging Face embeddings for PDF-grounded content generation.",
    ],
    features: ["Four learning agents", "Quizzes and flashcards", "Study planning", "PDF-grounded RAG"],
    technologies: ["React", "FastAPI", "PostgreSQL", "LangGraph", "FAISS", "Hugging Face embeddings"],
    links: [],
    tone: "sage",
  },
  {
    id: "feetcode",
    number: "03",
    name: "FeetCode",
    subtitle: "Competitive Programming Accountability Platform",
    category: "FULL-STACK / DEVELOPER TOOLS",
    year: "2026",
    summary: "A platform for building consistent coding habits through weekly goals, challenge participation, stake-based motivation, and progress tracking.",
    problem: "Consistency can be difficult to maintain alone. FeetCode makes coding goals visible and adds structured challenges and accountability.",
    contribution: [
      "Built a competitive-programming accountability platform with weekly coding goals, challenges, and progress tracking.",
      "Developed a restricted-session Safe Browser with domain whitelisting and password-protected exits using Electron.",
    ],
    features: ["Weekly coding challenges", "Token-based stakes and automated penalties", "Progress tracking", "Restricted-session Safe Browser"],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Express.js", "MongoDB", "Firebase Authentication", "Electron"],
    links: [
      { label: "Live demo", href: "https://feetcode-portfolio-demo.vercel.app/demo" },
      { label: "Original website", href: "https://feetcode.vercel.app/home" },
    ],
    tone: "plum",
  },
  {
    id: "isra-beneficiary",
    number: "04",
    name: "Beneficiary Operations",
    subtitle: "ISRA · JPMorgan Chase Code for Good",
    category: "TEAM PROJECT / SOCIAL IMPACT",
    year: "2026",
    summary: "A team-built platform for ISRA to support beneficiary onboarding and scheme application workflows.",
    problem: "Accessing support schemes can involve several steps and documents. The platform brings onboarding, eligibility checks, document handling, and approvals into a guided flow.",
    contribution: [
      "Worked with a team at JPMorgan Chase Code for Good to build a beneficiary operations platform for ISRA.",
      "Contributed to guided onboarding, OTP authentication, eligibility checks, OCR-assisted document validation, and approval workflows.",
    ],
    features: ["Guided onboarding", "OTP authentication", "Eligibility checks", "OCR-assisted document validation", "Approval workflows"],
    technologies: ["React", "TypeScript"],
    technologyNote: "Only the technologies explicitly listed in the résumé are shown.",
    image: "/assets/achievements/jpmorgan-code-for-good.png",
    imageAlt: "JPMorgan Chase Code for Good event materials and certificate",
    imageCaption: "Team participation at Code for Good · Mumbai · 2026",
    links: [],
    tone: "ink",
  },
  {
    id: "distributed-query-research",
    number: "05",
    name: "Distributed Query Processing",
    subtitle: "Optimization in Cloud Databases · Literature Survey",
    category: "RESEARCH / DATABASE SYSTEMS",
    year: "2026",
    summary: "A 12-page co-authored review of 26+ research papers on distributed query optimization and cloud database architectures.",
    problem: "The review compares approaches across distributed query optimization, cloud architectures, scalability, and cost efficiency.",
    contribution: ["Co-authored a 12-page literature review comparing more than 26 research papers."],
    features: ["Distributed query optimization", "Cloud database architectures", "Scalability", "Cost efficiency"],
    technologies: [],
    technologyNote: "No software stack is specified for this literature survey.",
    links: [],
    tone: "rose",
  },
];

export type AchievementRecord = {
  id: string;
  number: string;
  title: string;
  result: string;
  organization: string;
  period: string;
  description: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
};

export const achievements: AchievementRecord[] = [
  {
    id: "code-for-good",
    number: "01",
    title: "Code for Good",
    result: "Runner-Up",
    organization: "JPMorgan Chase · Mumbai",
    period: "2026",
    description: "Worked with a team on an ISRA beneficiary operations platform during JPMorgan Chase Code for Good. The team finished as Runner-Up.",
    image: "/assets/achievements/jpmorgan-code-for-good.png",
    imageAlt: "JPMorgan Chase Code for Good event materials and participation certificate",
    imageCaption: "Event keepsakes and certificate from Code for Good.",
  },
  {
    id: "next-signal",
    number: "02",
    title: "Finding the Next Signal",
    result: "Top 20 shortlisted",
    organization: "Investment Research Competition · BITS Pilani Hyderabad",
    period: "2026",
    description: "A quantitative finance and investment research competition. The supplied poster records the shortlist milestone; a finalist award is not claimed.",
    image: "/assets/achievements/finding-the-next-signal.png",
    imageAlt: "Finding the Next Signal competition poster with registration, selection, and shortlist figures",
    imageCaption: "Competition poster supplied in the portfolio assets.",
  },
  {
    id: "datazen",
    number: "03",
    title: "DataZen Case Study",
    result: "Finalist",
    organization: "Case Study Competition",
    period: "2026",
    description: "Recognized as a finalist in the DataZen case study competition. A certificate of appreciation for participation is available in the supplied assets.",
    image: "/assets/achievements/datazen-certificate.png",
    imageAlt: "DataZen Certificate of Appreciation for participation in the 2026 case study competition",
    imageCaption: "Certificate of appreciation for participation, shown as supplied.",
  },
  {
    id: "nism",
    number: "04",
    title: "NISM Series V-A",
    result: "Certified",
    organization: "Mutual Fund Distributors Certification",
    period: "",
    description: "Completed the NISM Series V-A Mutual Fund Distributors Certification. No certificate image is present in the repository.",
  },
];

export type SkillGroup = { label: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { label: "AI / MACHINE LEARNING", items: ["LangChain", "LangGraph", "FAISS", "Hugging Face"] },
  { label: "SOFTWARE ENGINEERING", items: ["React", "Next.js", "TypeScript", "JavaScript", "C++", "Electron"] },
  { label: "BACKEND / DATA", items: ["Python", "Pandas", "SQL", "PostgreSQL", "MongoDB", "FastAPI", "Flask", "Express.js", "REST APIs"] },
  { label: "FINANCIAL DOMAIN", items: ["Mutual funds", "AMFI data", "SID/KIM", "SEBI compliance", "Investment research"] },
  { label: "TOOLS / PLATFORMS", items: ["Firebase Authentication", "Tailwind CSS", "Git", "GitHub", "Excel"] },
];

export const photoDiary = [
  { src: "/assets/about/personal-portrait.png", alt: "Samaira in front of a colorful light installation", caption: "A room full of colour" },
  { src: "/assets/about/speaking-to-audience.png", alt: "Samaira speaking to a full lecture hall", caption: "A room full of people" },
  { src: "/assets/about/waterfront-evening.png", alt: "Samaira looking over the waterfront at dusk", caption: "An evening by the water" },
  { src: "/assets/about/somaiya-campus-friends.png", alt: "Samaira with friends at Somaiya campus", caption: "Campus, together" },
];

export const professionalLinks = {
  github: "https://github.com/samairaxox",
  linkedin: "https://www.linkedin.com/in/samaira-sharma-4b9664264",
  email: "samairasharma152@gmail.com",
  resume: "/resume.pdf",
};
