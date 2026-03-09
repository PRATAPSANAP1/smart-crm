import React, { useEffect } from 'react';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
    error: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
    info: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' }
  };

  const color = colors[type] || colors.success;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: color.bg,
      color: color.text,
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      minWidth: '300px',
      maxWidth: '400px',
      border: `2px solid ${color.border}`,
      animation: 'slideIn 0.3s ease-out',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{fontWeight: '500'}}>{message}</span>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: color.text,
          marginLeft: '1rem',
          padding: '0'
        }}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
