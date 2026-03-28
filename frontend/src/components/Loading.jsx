const Loading = ({ fullPage = false, message = 'Loading...' }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] gap-6 ${fullPage ? 'fixed inset-0 bg-bg-dark z-[2000]' : ''}`}>
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 border-[2px] border-white/5 border-t-accent-gold rounded-full animate-spin"></div>
        <div className="absolute w-8 h-8 border-[2px] border-white/5 border-b-white rounded-full animate-[spin_3s_linear_infinite]"></div>
      </div>
      {message && <p className="text-text-secondary text-[0.6rem] animate-pulse tracking-[0.3em] uppercase font-bold">{message}</p>}
    </div>
  );
};

export default Loading;
