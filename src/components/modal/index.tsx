"use client";

import { Button } from "@/components/button";
import { ModalProps } from "./type";
import ReactModal from "react-modal";
import { useModal } from "@/hooks/useModal";
import { FaX } from "react-icons/fa6";

export const Modal = ({
  className,
  buttonTitle,
  buttonIcon,
  trigerButtonClass,
  triggerButtonVariant,
  trigerButtonJustifyContent,
  modalTitleIcon,
  modalTitle = "",
  modalDescription,
  children,
  show = null,
  contentLabel = "Modal",
  onShowCallbackAction,
  onCloseCallbackAction,
}: ModalProps) => {
  const { showModal, setShowModal, closeModal, customStyles } = useModal({
    show,
  });
  return (
    <>
      {(buttonTitle || buttonIcon) && (
        <Button
          type="button"
          onClick={() => setShowModal(true)}
          variant={triggerButtonVariant ? triggerButtonVariant : "primary"}
          className={`flex items-center h-10 gap-1 ${trigerButtonClass}`}
          justifyContent={trigerButtonJustifyContent}
          aria-haspopup="true"
        >
          {buttonIcon}
          {buttonTitle}
        </Button>
      )}
      <ReactModal
        isOpen={showModal}
        onAfterOpen={() => onShowCallbackAction?.()}
        onAfterClose={() => onCloseCallbackAction?.()}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={contentLabel}
        className="justify-center items-start flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ease-linear transition-all duration-150  modal"
        overlayClassName="fixed inset-0 w-full h-full bg-black/50 z-50 cursor-pointer modal-overlay "
      >
        <div className="relative w-auto mx-auto cursor-default">
          {/*content*/}
          <div
            className={`border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none w-[95vw] md:w-[60vw] lg:w-[30vw]  p-4 md:p-10 ${className} `}
          >
            {/*header*/}
            {(modalTitle || modalDescription) && (
              <div className="flex items-center justify-between pb-3  rounded-t whitespace-normal">
                <div>
                  {modalTitle && (
                    <h3 className="text-xl font-semibold text-[#18181B]/900 flex justify-center items-start flex-col gap-2">
                      {modalTitleIcon && modalTitleIcon}
                      <span>{modalTitle}</span>
                    </h3>
                  )}
                  {modalDescription && (
                    <p className="mt-3 text-xs mr-10 text-gray-500">
                      {modalDescription}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-secondary-100 rounded-full p-2 text-sm focus:outline-secondary-500"
                >
                  <FaX />
                </button>
              </div>
            )}
            {/*body*/}
            <div className="relative pt-2  flex flex-wrap flex-col whitespace-normal overflow-auto max-h-[80vh]">
              {children}
            </div>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

Modal.displayName = "Modal";
