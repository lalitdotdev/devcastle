import { Check, Copy, ExternalLink, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ShareProductModalContentProps {
  currentProduct: any;
}

const URL_PREFIX = "https://devcastle.vercel.app/launchpad/product/";

const ShareProductModalContent: React.FC<ShareProductModalContentProps> = ({
  currentProduct,
}) => {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentProduct?.slug) {
      setShareUrl(URL_PREFIX + currentProduct.slug);
    }
  }, [currentProduct]);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const socialLinks = [
    {
      label: "Discord",
      href: currentProduct?.discord,
      logo: "/logo/discord-logo.png",
      color:
        "border-[#5865F2]/30 bg-[#5865F2]/10 hover:border-[#5865F2]/60 hover:bg-[#5865F2]/20",
      disabled: !currentProduct?.discord,
    },
    {
      label: "Twitter / X",
      href: currentProduct?.twitter,
      logo: "/logo/twitter-logo.png",
      color:
        "border-[#1d9bf0]/30 bg-[#1d9bf0]/10 hover:border-[#1d9bf0]/60 hover:bg-[#1d9bf0]/20",
      disabled: !currentProduct?.twitter,
    },
  ];

  return (
    <div className="px-6 pt-6 pb-7 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        {/* Product logo */}
        <div className="shrink-0 h-12 w-12 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-lg">
          <Image
            src={currentProduct.logo}
            alt={currentProduct.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="flex items-center justify-center h-5 w-5 rounded-md bg-gradient-to-br from-violet-600 to-fuchsia-600">
              <Share2 className="h-3 w-3 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-zinc-100">
              Share this product
            </h2>
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed truncate">
            Help others discover{" "}
            <span className="text-zinc-400">{currentProduct.name}</span>
          </p>
        </div>
      </div>

      {/* ── Social buttons ── */}
      <div>
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">
          Share on socials
        </p>
        <div className="grid grid-cols-2 gap-3">
          {socialLinks.map(({ label, href, logo, color, disabled }) => (
            <button
              key={label}
              onClick={() => !disabled && window.open(href, "_blank")}
              disabled={disabled}
              className={`group relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 ${
                disabled
                  ? "border-zinc-800 bg-zinc-900/40 opacity-40 cursor-not-allowed"
                  : color
              }`}
            >
              <div className="h-10 w-10 relative">
                <Image src={logo} fill alt={label} className="object-contain" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-zinc-300">
                  {label}
                </span>
                {!disabled && (
                  <ExternalLink className="h-2.5 w-2.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              {disabled && (
                <span className="absolute top-2 right-2 text-[9px] text-zinc-700 font-medium">
                  N/A
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">
          or copy link
        </span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      {/* ── Copy link ── */}
      <div>
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2">
          Direct link
        </p>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <span className="text-[11px] text-zinc-500 truncate flex-1 select-all">
              {shareUrl}
            </span>
          </div>

          <CopyToClipboard text={shareUrl} onCopy={handleCopy}>
            <button
              className={`shrink-0 flex items-center justify-center h-10 w-10 rounded-xl border transition-all duration-200 ${
                copied
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                  : "border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
              }`}
              aria-label="Copy link"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Copy className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </CopyToClipboard>
        </div>

        {/* Copied confirmation */}
        <AnimatePresence>
          {copied && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1"
            >
              <Check className="h-3 w-3" />
              Link copied to clipboard
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ShareProductModalContent;
