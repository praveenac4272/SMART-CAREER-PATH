function ProgressBar({ value, color = '#2563eb' }) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div
      style={{
        width: '100%',
        height: '10px',
        backgroundColor: '#e2e8f0',
        borderRadius: '999px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${safeValue}%`,
          height: '100%',
          borderRadius: '999px',
          background: `linear-gradient(90deg, ${color}, #38bdf8)`,
          transition: 'width 0.2s ease',
        }}
      />
    </div>
  );
}

export default ProgressBar;
