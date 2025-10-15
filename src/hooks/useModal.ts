"use client";

import { useMemo, useState } from "react";
import ReactModal from "react-modal";

export const useModal = ({ show }: { show?: boolean | null } = {}) => {
  const [showModal, setShowModal] = useState(false);

  const customStyles = useMemo(() => {
    return {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
      },
    };
  }, []);

  // open or close modal based on show prop
  useMemo(() => {
    if (show) {
      setShowModal(true);
    } else if (show !== null) {
      if (!show) {
        closeModal();
      }
    }
  }, [show]);

  useMemo(() => ReactModal.setAppElement("body"), []);

  function closeModal() {
    setShowModal(false);
  }

  return { showModal, setShowModal, closeModal, customStyles };
};
