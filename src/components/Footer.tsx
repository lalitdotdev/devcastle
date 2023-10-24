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

import { Github, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { categories } from "@/lib/categories";

function Footer() {
  const socialLinks = [
    { name: "Github", icon: <Github />, link: "https://www.github.com" },
    {
      name: "Youtube",
      icon: <Youtube />,
      link: "https://www.youtube.com/KishanSheth21/",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin />,
      link: "https://www.linkedin.com/in/koolkishan/",
    },
    {
      name: "Instagram",
      icon: <Instagram />,
      link: "https://instagram.com/koolkishansheth",
    },
    {
      name: "Twitter",
      icon: <Twitter />,
      link: "https://twitter.com/koolkishansheth",
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
    <footer className="max-w-7xl mx-auto px-32 py-16 h-max  text-indigo-400 border-t border-gray-600 bottom-0 sticky">
      <ul className="flex justify-between">
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
      </ul>
      <div className="mt-12 flex items-center justify-between">
        <p className="font-bold text-3xl text-indigo-600">
          Curiosity <span className="text-gray-400">.</span>
        </p>
        <ul className="flex gap-5">
          {socialLinks.map(({ icon, link, name }) => (
            <li
              key={name}
              className="text-xl text-gray-400 hover:text-[#1DBF73] transition-all"
            >
              <Link href={link}>{icon}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
