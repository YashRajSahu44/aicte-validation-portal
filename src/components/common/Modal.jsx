import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`bg-white rounded border border-line shadow-lg w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-line">
          <h2 className="font-semibold text-navy">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-page"><X size={18} /></button>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
        {footer && <div className="px-4 py-3 border-t border-line flex justify-end gap-2 bg-page">{footer}</div>}
      </div>
    </div>
  );
}

// Used for restricted / consequential actions.
export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel, disabled, children }) {
  return (
    <Modal title={title} onClose={onCancel} footer={<>
      <button className="btn-outline" onClick={onCancel}>Cancel</button>
      <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm} disabled={disabled}>{confirmLabel}</button>
    </>}>
      <p className="mb-3">{message}</p>
      {children}
    </Modal>
  );
}
