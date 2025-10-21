import React from "react";

export type CardProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  py?: string;
};

export type CardHeaderProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
};
