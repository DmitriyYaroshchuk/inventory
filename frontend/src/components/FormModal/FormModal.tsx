import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './FormModal.scss';

type FormModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

const FormModal = ({ title, onClose, children }: FormModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="form-modal" onClick={onClose}>
      <div
        className="form-modal__window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="form-modal-title" className="form-modal__title">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default FormModal;
