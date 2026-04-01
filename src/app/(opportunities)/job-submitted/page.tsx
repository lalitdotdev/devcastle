"use client"
import { CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/Button";

export default function JobSubmittedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center shadow-2xl"
      >
        {/* Icon Section */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <CheckCircle className="text-emerald-400 w-16 h-16" />
            <motion.div
              className="absolute inset-0 rounded-full border border-emerald-400/30"
              animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <H1 className="text-white text-3xl font-bold tracking-tight">
            Job submitted successfully
          </H1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-zinc-400 text-lg leading-relaxed"
        >
          Your job posting is now <span className="text-white font-medium">under review</span>.
          Once approved, it will be visible to thousands of developers.
        </motion.p>

        {/* Divider Glow */}
        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Highlight Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-sm text-zinc-400"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Helping developers discover great opportunities
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105">
            View Dashboard
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6 py-2 rounded-xl">
            Post Another Job
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
