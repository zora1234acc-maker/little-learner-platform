export function AnimatedBackground() {
  return (
    <div
      className="animated-background pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="animated-gradient absolute -inset-1/4" />
      <div className="animated-blob animated-blob-one absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#514BFF]/[0.2] blur-3xl" />
      <div className="animated-blob animated-blob-two absolute -right-24 top-[32%] h-80 w-80 rounded-full bg-[#FFD75E]/[0.24] blur-3xl" />
      <div className="animated-blob animated-blob-three absolute bottom-24 left-[18%] h-72 w-72 rounded-full bg-[#FF91B1]/[0.18] blur-3xl" />
      <div className="animated-box animated-box-one absolute left-[7%] top-[24%] h-24 w-24 rounded-xl border-2 border-[#514BFF]/20 bg-white/20" />
      <div className="animated-box animated-box-two absolute right-[10%] top-[18%] h-32 w-32 rounded-xl border-2 border-[#D89A21]/25 bg-[#FFD75E]/10" />
      <div className="animated-box animated-box-three absolute bottom-[18%] left-[22%] h-20 w-20 rounded-xl border-2 border-[#1B9A75]/20 bg-[#5CC8AF]/10" />
      <div className="animated-box animated-box-four absolute bottom-[12%] right-[22%] h-28 w-28 rounded-xl border-2 border-[#D24F75]/20 bg-[#FF91B1]/10" />
    </div>
  );
}
