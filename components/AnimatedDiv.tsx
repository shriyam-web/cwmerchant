// components/AnimatedDiv.tsx
'use client';
import { motion } from 'framer-motion';

export default function AnimatedDiv({ children }: { children: React.ReactNode }) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{children}</motion.div>;
}
