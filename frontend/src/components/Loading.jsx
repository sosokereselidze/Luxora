const Loading = ({ fullPage = false, message = 'Loading...' }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] gap-5 ${fullPage ? 'fixed inset-0 bg-[#0a0a0f] z-[2000]' : ''}`}>
      <div className="w-12 h-12 border-[3px] border-[rgba(155,89,182,0.15)] border-t-[#6a0dad] rounded-full animate-spin"></div>
      {message && <p className="text-[#7a6e8a] text-sm animate-pulse tracking-widest uppercase font-bold">{message}</p>}
    </div>
  );
};

export default Loading;
