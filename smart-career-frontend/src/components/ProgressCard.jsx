import ProgressBar from './ProgressBar';

function ProgressCard({ career, progress, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        width: '100%',
        backgroundColor: isActive ? '#f5f3ff' : 'white',
        border: isActive ? '1px solid #8b5cf6' : '1px solid #e2e8f0',
        borderRadius: '18px',
        padding: '16px',
        textAlign: 'left',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1f2937' }}>{career.title}</h3>
          <p style={{ margin: '0', fontSize: '13px', color: '#64748b' }}>{career.domain}</p>
        </div>
        <span style={{ fontSize: '20px', color: '#8b5cf6' }}>✓</span>
      </div>

      <p style={{ margin: '10px 0 12px', fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>{career.summary}</p>

      <ProgressBar value={progress} color={isActive ? '#8b5cf6' : '#2563eb'} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '13px', color: '#475569' }}>
        <span>{progress}% complete</span>
        <span>{career.tasks.length} milestones</span>
      </div>
    </button>
  );
}

export default ProgressCard;
