"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

interface HeroProps {
    onGuestExplore?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGuestExplore }) => {
    return (
        <section aria-labelledby="hero-heading" className="relative overflow-hidden rounded-3xl bg-brand-hero-diag p-8 md:p-16 text-white shadow-glow-indigo">
            <div className="pointer-events-none absolute inset-0 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative max-w-3xl">
                <h1 id="hero-heading" className="text-3xl md:text-5xl font-bold tracking-tight drop-shadow-sm">
                    AltruiShare — Connect surplus to need, measure impact
                </h1>
                <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl">
                    A unified platform for needs, donations, logistics, volunteering and transparent impact analytics.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-white text-brand-indigo font-semibold px-6 py-3 shadow-soft hover:shadow-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/80 transition">
                        Get Started
                    </Link>
                    <button onClick={onGuestExplore} className="inline-flex items-center justify-center rounded-full bg-brand-indigo/20 backdrop-blur px-6 py-3 font-medium text-white border border-white/30 hover:bg-brand-indigo/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70 transition">
                        Explore as Guest
                    </button>
                </div>
            </motion.div>
            <motion.div aria-hidden className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-gradient-to-tr from-white/20 to-white/5 blur-3xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} />
        </section>
    );
};

export default Hero;
