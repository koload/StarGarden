import React, { useRef } from 'react';
import "../styles/ModalStyle.css";

function Modal({ children, onClose }) {
    const modalContentRef = useRef(null);

    const handleOverlayClick = (event) => {
        if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" ref={modalContentRef}>
                <button className="modal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
}

export default React.memo(Modal);