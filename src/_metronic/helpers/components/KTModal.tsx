import React, { ReactNode } from 'react';
import { KTSVG } from "./KTSVG.tsx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    centered?: boolean;
    scrollable?: boolean;
    closeButton?: boolean;
    animation?: boolean;
    customClass?: string;
}

export const KTModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    centered = false,
    scrollable = false,
    closeButton = true,
    animation = true,
    customClass = ''
}) => {
    if (!isOpen) return null;

    const modalClasses = [
        'modal',
        animation ? 'fade' : '',
        isOpen ? 'show' : '',
        customClass
    ].filter(Boolean).join(' ');

    const dialogClasses = [
        'modal-dialog',
        `modal-${size}`,
        centered ? 'modal-dialog-centered' : '',
        scrollable ? 'modal-dialog-scrollable' : ''
    ].filter(Boolean).join(' ');

    return (
        <>
            <div className={modalClasses} style={{ display: 'block' }} tabIndex={-1} role="dialog">
                <div className={dialogClasses}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            {closeButton && (
                                <div
                                    className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                                    onClick={onClose}
                                    aria-label="Close"
                                >
                                    <KTSVG path="media/icons/duotune/arrows/arr061.svg" className="svg-icon svg-icon-2x" />
                                </div>
                            )}
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