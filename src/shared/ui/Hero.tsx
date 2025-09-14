"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

interface HeroProps {
    onGuestExplore?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGuestExplore }) => {
    return (
        <section aria-labelledby="hero-heading" className="relative overflow-hidden rounded-3xl p-8 md:p-16 text-white shadow-elevated bg-brand-hero-gradient">
            <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.25),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.18),transparent_65%)]" />
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative max-w-3xl">
                <h1 id="hero-heading" className="text-3xl md:text-5xl font-bold leading-tight drop-shadow-sm">
                    AltruiShare — Connect surplus to need, measure impact
                </h1>
                <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl">
                    Surface verified needs, mobilize donations & volunteers, coordinate logistics and quantify real-world outcomes — transparently.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-white text-brand-navy font-semibold px-7 py-3 shadow-soft hover:shadow-glow-emerald focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80 transition">
                        Get Started Free
                    </Link>
                    <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur px-7 py-3 font-medium text-white border border-white/30 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70 transition">
                        Login
                    </Link>
                    <button onClick={onGuestExplore} className="inline-flex items-center justify-center rounded-full bg-brand-emerald/25 px-7 py-3 font-medium text-white border border-white/20 hover:bg-brand-emerald/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70 transition">
                        Explore as Guest
                    </button>
                </div>
            </motion.div>
            <motion.div aria-hidden className="absolute -right-24 -bottom-24 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-white/25 to-transparent blur-3xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} />
        </section>
    );
};

export default Hero;
