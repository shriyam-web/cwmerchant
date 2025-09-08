// import Image from 'next/image';
'use client'; // ⚠️ Add this at the top
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function HeroImage() {
    const dataPoints = [50, 150, 250, 350, 450, 550, 650, 750];
    const yPoints = [330, 290, 260, 200, 150, 120, 80, 60];
    const [emojiBurst, setEmojiBurst] = useState<{ x: number; y: number; symbol: string }[]>([]);

    const floatingEmojis = [
        { symbol: '💰', top: 50, left: 100, delay: 0 },
        { symbol: '📈', top: 120, left: 250, delay: 0.3 },
        { symbol: '🤑', top: 200, left: 400, delay: 0.6 },
        { symbol: '💵', top: 80, left: 550, delay: 0.9 },
        { symbol: '🎉', top: 150, left: 650, delay: 1.2 },
    ];

    const handlePointHover = (x: number, y: number) => {
        const burst = ['💰', '📈', '🤑', '💵', '🎉'].map((symbol) => ({
            x,
            y,
            symbol,
        }));
        setEmojiBurst(burst);
        setTimeout(() => setEmojiBurst([]), 1000);
    };

    return (
        <motion.div
            className="relative flex-1"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
        >
            <div className="rounded-2xl mx-auto p-4 relative">
                {/* SVG Chart */}
                <svg
                    width="100%"
                    height="400"
                    viewBox="0 0 800 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="800" height="400" fill="#f0f4f8" rx="20" />
                    {[350, 300, 250, 200, 150, 100].map((y, i) => (
                        <line
                            key={i}
                            x1={50}
                            y1={y}
                            x2={750}
                            y2={y}
                            stroke="#d1d5db"
                            strokeWidth={i === 0 ? 2 : 1}
                            strokeDasharray={i === 0 ? '0' : '5 5'}
                        />
                    ))}
                    <line x1="50" y1="50" x2="50" y2="350" stroke="#6b7280" strokeWidth="3" />
                    <line x1="50" y1="350" x2="750" y2="350" stroke="#6b7280" strokeWidth="3" />
                    <motion.polyline
                        points="50,330 150,290 250,260 350,200 450,150 550,120 650,80 750,60"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                    />
                    {dataPoints.map((x, idx) => (
                        <motion.circle
                            key={idx}
                            cx={x}
                            cy={yPoints[idx]}
                            r={8}
                            fill="#3b82f6"
                            whileHover={{ scale: 1.5, filter: 'drop-shadow(0 0 10px #3b82f6)' }}
                            onHoverStart={() => handlePointHover(x, yPoints[idx])}
                            transition={{ type: 'spring', stiffness: 300 }}
                            style={{ cursor: 'pointer' }}
                        />
                    ))}
                    <text x="50" y="40" textAnchor="start" fontSize="28" fontWeight="bold" fill="#111827">
                        Business Growth
                    </text>

                </svg>

                {/* Your Uploaded Image on Top of Graph */}
                <div
                    className="absolute left-1/2 bottom-0 transform -translate-x-1/2 z-50"
                >
                    <img src="/happy.png" width={350} height={350} className="object-contain" />
                </div>


                {/* Floating Emojis */}
                {floatingEmojis.map((emoji, idx) => (
                    <motion.div
                        key={idx}
                        className="absolute text-2xl lg:text-3xl select-none pointer-events-none"
                        style={{ top: emoji.top, left: emoji.left }}
                        animate={{ y: [0, -15, 0], rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', delay: emoji.delay }}
                    >
                        {emoji.symbol}
                    </motion.div>
                ))}

                {/* Hover Burst Emojis */}
                {emojiBurst.map((emoji, idx) => (
                    <motion.div
                        key={idx}
                        className="absolute text-2xl lg:text-3xl select-none pointer-events-none"
                        style={{ top: emoji.y, left: emoji.x }}
                        initial={{ y: 0, opacity: 1, scale: 1 }}
                        animate={{ y: -50 - Math.random() * 50, opacity: 0, scale: 1.5 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        {emoji.symbol}
                    </motion.div>
                ))}

                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-yellow-400 text-xl select-none pointer-events-none"
                        style={{ top: Math.random() * 350, left: Math.random() * 750 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    >
                        ✨
                    </motion.div>
                ))}
            </div>
        </motion.div >
    );
}
