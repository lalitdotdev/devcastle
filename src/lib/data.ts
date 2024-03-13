import { ChefHat, GraduationCap, Workflow } from "lucide-react";

import React from "react";

export const experiencesData = [
  {
    title: "Freelancer",
    location: "New Market, Auckland",
    description: `Moving on from the course from Dev Academy, I immersed myself into learning and exploring new technologies, building and deploying quite a few full-stack projects. Also currently contributing to a YouTube channel with 11k+ subscribers, 50-100k+ views videos and an active discord community.`,
    icon: React.createElement(Workflow),
    date: "09/2023 - Present",
  },
  {
    title: "Student - Fullstack Developer",
    location: "New Market, Auckland",
    description:
      "I graduated from Level 6 in Applied Software Development course from Dev Academy Aotearoa. I gained practical experience through pair programming and weekly group projects. Also developed strong collaboration, communication, and problem solving skills. I have been equipped with technical skills and a commitment to lifelong learning for a successful apps&sites development career.",
    icon: React.createElement(GraduationCap),
    date: "06-09/2023",
  },
  {
    title: "Sous Chef",
    location: "Mission Bay, Auckland",
    description: `Exceptional leadership skills honed through orchestrating kitchen operations and managing teams. Strong ability to delegate tasks efficiently while maintaining a clear vision of culinary goals. Profound teamwork experience in high-pressure kitchen environments, fostering cooperation, communication, and problem-solving. Adaptability, meticulous attention to detail, and a commitment to delivering exceptional results.`,
    icon: React.createElement(ChefHat),
    date: "2014-2023",
  },
] as const;
export type ExperienceData = (typeof experiencesData)[number];

export const StepsData = [
  {
    title: "ACHIEVEMENTS ROADMAP",
    description:
      "First off, thank you for being a part of the community. We are excited to se how much organic growth and engagement the community here is experiencing. Here are some community stats and updates:",
    content: [
      {
        title: "COMMUNITY GOALS:",
        subtitles: [
          "Discord Members: 20,000+",
          "Twitter Followers: 20,000+",
          "10 new Moderators Hired Full Time",
          "3,000 WL Raffle Signups",
        ],
      },
      {
        title: "PROJECTED GROWTH:",
        subtitles: [
          "2,519.8% Q3 of 2022",
          "2,000 Weekly Communicators",
          "17.10% new weekly member retention",
          "10,500+ Twitter followers (zero ads)",
        ],
      },
    ],
  },
  {
    title: "CURRENT EVENTS",
    description:
      "We're excited announce successful strategic partnerships and influencers we've onboarded:",
    content: [
      {
        title: "INFLUENCER NEWS & PARTNERS:",
        subtitles: [
          "FLWR Partnership Launchpad",
          "HolyVerse advisory",
          "Skullbots advisory",
          "Sol Flowers advisory",
          "Cyber Pharmacy advisory",
          "Shadowy Super Coder advisory",
        ],
      },
    ],
  },
  {
    title: "FUTURE UPDATES",
    description:
      "As we continue to grow, our goal is to keep you guys updated with all relevant details and up coming roadmap achievements:",
    content: [
      {
        title: "MINT UPDATES:",
        subtitles: [
          "Whitelist Raffles begin early June",
          "Founder speaks at major AMA and Twitter spaces with partners",
          "Mint date is TBD. All the technology is ready.",
          "New strategic promotion announcement",
          "A tier influencer partnership campaigns deployed",
          "Game theory rules & deflationary mechanics revealed to the public",
        ],
      },
    ],
  },
] as const;

export type StepsData = (typeof StepsData)[number];
