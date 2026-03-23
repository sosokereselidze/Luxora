const Loading = ({ fullPage = false, message = 'Loading...' }) => {
  return (
    <div className={`loading-container ${fullPage ? 'full-page' : ''}`}>
      <div className="loading-spinner"></div>
      {message && <p className="loading-text">{message}</p>}
      
      <style>{`
        .full-page {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--bg-dark);
          z-index: 2000;
        }
      `}</style>
    </div>
  );
};

export default Loading;
