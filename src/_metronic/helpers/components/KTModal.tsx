import React, { ReactNode } from 'react';
import { KTSVG } from "./KTSVG.tsx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
}

export const KTModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <div
                                className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <KTSVG path="media/icons/duotune/arrows/arr061.svg" className="svg-icon svg-icon-2x" />
                            </div>
                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                        {footer && (
                            <div className="modal-footer">
                                {footer}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default KTModal;