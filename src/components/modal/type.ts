"use client";

import React from "react";
import { ButtonVariant } from "@/components/button/type";

export type ModalProps = {
  className?: string;
  buttonTitle?: string;
  buttonIcon?: React.ReactNode;
  trigerButtonClass?: string;
  triggerButtonVariant?: ButtonVariant;
  trigerButtonJustifyContent?: string;
  modalTitle?: string;
  modalDescription?: string;
  modalTitleIcon?: React.ReactNode;
  children: React.ReactNode;
  show?: boolean | null;
  contentLabel?: string;
  onShowCallbackAction?: () => void;
  onCloseCallbackAction?: () => void;
};
