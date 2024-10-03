// app/about/AboutContent.tsx
'use client'

import { GithubIcon, Linkedin, Mail } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

const TypingEffect: React.FC<{ text: string }> = ({ text }) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                setDisplayText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);

        return () => clearInterval(typingInterval);
    }, [text]);

    return <span>{displayText}</span>;
};

interface FadeInSectionProps {
    children: React.ReactNode;
    delay?: number;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, delay = 0 }) => {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => setVisible(entry.isIntersecting));
        });

        if (domRef.current) {
            observer.observe(domRef.current);
        }

        return () => {
            if (domRef.current) {
                observer.unobserve(domRef.current);
            }
        };
    }, []);

    return (
        <div
            className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: `${delay}ms` }}
            ref={domRef}
        >
            {children}
        </div>
    );
};

export function AboutContent() {
    return (
        <div className="max-w-6xl mx-auto">
            <FadeInSection>
                <h1 className="text-5xl md:text-7xl font-bold mb-12 text-center">
                    About <span className="text-blue-400">Devcastle</span>
                </h1>
            </FadeInSection>

            <div className=" gap-12 items-center">

                <FadeInSection delay={400}>
                    <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-xl">
                        <h2 className="text-3xl font-semibold mb-6">Our Vision</h2>
                        <ul className="list-disc list-inside space-y-2 text-lg">
                            <li>Offer resources and opportunities for growth and learning.</li>
                            <li>Connect like-minded individuals to collaborate and innovate.</li>
                            <li>Foster a culture of continuous learning and improvement.</li>
                            <li>Encourage diversity and inclusivity in the tech industry.</li>
                            <li>Support and nurture the next generation of developers, designers, and creators.</li>

                        </ul>
                    </div>
                </FadeInSection>
            </div>

            <FadeInSection delay={600}>
                <div className="mt-16 text-center">
                    <h2 className="text-3xl font-semibold mb-6">Meet the Founder</h2>
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                            <Image
                                src="https://avatars.githubusercontent.com/u/90063350?v=4"
                                alt="Lalit Sharma"
                                width={128}
                                height={128}
                                className="rounded-full"
                            />
                        </div>
                        <h3 className="text-2xl font-semibold">Lalit Sharma</h3>
                        <p className="text-blue-300 mb-4">Lead Developer</p>
                        <p className="text-lg font-light leading-relaxed text-zinc-400">
                            Hi! I&apos;m Lalit, a full-stack developer and creator of DevCastle. I&apos;m passionate about building communities and creating opportunities for developers to learn, grow, and connect with one another.
                        </p>


                        <div className="flex space-x-4">
                            <a href="https://github.com/lalitdotdev" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition-colors">
                                <GithubIcon size={24} />
                            </a>
                            <a href="https://linkedin.com/in/pinglalit" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition-colors">
                                <Linkedin size={24} />
                            </a>
                            <a href="mailto:mailfor.lalitsharma@gmail.com" className="text-white hover:text-blue-400 transition-colors">
                                <Mail size={24} />
                            </a>
                        </div>
                    </div>
                </div>
            </FadeInSection>

            <FadeInSection delay={800}>
                <div className="mt-16 text-center">
                    <h2 className="text-3xl font-semibold mb-6">Ready to Join the Castle?</h2>

                    <Link href="/join" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors">
                        Join Our Community
                    </Link>
                </div>
            </FadeInSection>

            <FadeInSection delay={1000}>
                <footer className="mt-24 text-center text-sm opacity-70">
                    <p>
                        Have a project in mind? Reach out to me 📞 from{' '}
                        <Link href="https://litsharmadev.tech/" rel="noopener noreferrer" target="_blank" className="underline underline-offset-2 hover:text-blue-400 transition-colors">
                            here
                        </Link>{' '}
                        and let&apos;s make it happen.
                    </p>
                </footer>
            </FadeInSection>
        </div>
    );
}
