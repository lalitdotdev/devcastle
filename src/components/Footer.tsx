import Link from "next/link";
import React from "react";
// import {
//   FiGithub,
//   FiInstagram,
//   FiYoutube,
//   FiLinkedin,
//   FiTwitter,
// } from "react-icons/fi";

// import CuriosityLogo from "./CuriosityLogo";

import {
  Github,
  Instagram,
  Linkedin,
  Slack,
  Twitter,
  Youtube,
} from "lucide-react";
import { categories } from "@/lib/categories";
import H1 from "./h1";

function Footer() {
  const socialLinks = [
    { name: "Github", icon: <Github />, link: "https://www.github.com" },
    {
      name: "Youtube",
      icon: <Youtube />,
      link: "https://www.youtube.com/devcastle/",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin />,
      link: "https://www.linkedin.com/in/devcastle/",
    },
    {
      name: "Instagram",
      icon: <Instagram />,
      link: "https://instagram.com/devcastle",
    },
    {
      name: "Twitter",
      icon: <Twitter />,
      link: "https://twitter.com/devcastle",
    },
    {
      name: "Slack",
      icon: <Slack />,
      link: "https://slack.com/devcastle",
    },
  ];
  const data = [
    {
      headerName: "Categories",
      links: [
        ...categories.map(({ name }) => ({
          name,
          link: `gigs/search?category=${name}`,
        })),
      ],
    },
    {
      headerName: "About",
      links: [
        { name: "Careers", link: "#" },
        { name: "Press & News", link: "#" },
        { name: "Partnership", link: "#" },
        { name: "Privacy Policy", link: "#" },
        { name: "Terms of Service", link: "#" },
        { name: "Intellectual Property Claims", link: "#" },
        { name: "Investor Relations", link: "#" },
      ],
    },
    {
      headerName: "Support",
      links: [
        { name: "Help & Support", link: "#" },
        { name: "Trust & Safety", link: "#" },
        { name: "Selling on Curiosity", link: "#" },
        { name: "Buying on Curiosity", link: "#" },
      ],
    },
    {
      headerName: "Community",
      links: [
        { name: "Community Success Stories", link: "#" },
        { name: "Community Hub", link: "#" },
        { name: "Forum", link: "#" },
        { name: "Events", link: "#" },
        { name: "Blog", link: "#" },
        { name: "Influencers", link: "#" },
        { name: "Affiliates", link: "#" },
        { name: "Podcast", link: "#" },
        { name: "Invite a Friend", link: "#" },
        { name: "Become a Seller", link: "#" },
        { name: "Community Standards", link: "#" },
      ],
    },
    {
      headerName: "Move From Curiosity",
      links: [
        { name: "Curiosity Business", link: "#" },
        { name: "Curiosity Pro", link: "#" },
        { name: "Curiosity Logo Maker", link: "#" },
        { name: "Curiosity Guides", link: "#" },
        { name: "Get Inspired", link: "#" },
        { name: "Curiosity Select", link: "#" },
        { name: "ClearVoice", link: "#" },
        { name: "Curiosity Workspace", link: "#" },
        { name: "Learn", link: "#" },
        { name: "Working Not Working", link: "#" },
      ],
    },
  ];
  return (
    <footer className="max-w-7xl mx-auto px-32 py-16 h-max  text-indigo-400 border-t border-gray-600">
      {/* <ul className="flex justify-between">
        {data.map(({ headerName, links }) => {
          return (
            <li key={headerName} className="flex flex-col gap-2">
              <span className="font-semibold">{headerName}</span>
              <ul className="flex flex-col gap-2">
                {links.map(({ name, link }) => (
                  <li key={name} className="text-gray-400">
                    <Link href={link}>{name}</Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul> */}

      <div className=" flex items-center justify-between">
        <div className="flex-col">
          <H1 className="flex text-indigo-600">
            DevCastle <span className="text-gray-400">.</span>{" "}
          </H1>
          <p className="text-sm text-muted-foreground">
            Connecting talents with opportunities
          </p>
        </div>

        <ul className="flex gap-5">
          {socialLinks.map(({ icon, link, name }) => (
            <li
              key={name}
              className="text-xl text-gray-400 hover:text-[#1DBF73] transition-all"
            >
              <Link href={link} className="hover:text-indigo-600">
                {icon}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className=" text-sm text-muted-foreground">
        © {new Date().getFullYear()} DevCastle , Inc. All rights reserved.
      </div>
      <div className="text-sm flex flex-grow text-muted-foreground gap-4 justify-end">
        <Link href="/about" className="hover:underline">
          About Us
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
        <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
