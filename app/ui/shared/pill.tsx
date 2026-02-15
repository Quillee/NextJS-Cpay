import { ReactNode } from "react"

export type PillProps = {
  children: ReactNode;
  className: string;
}

const Pill = ({ children, className, }: PillProps) => (
  <div className={`rounded p-2 ${className}`}>children</div>
)
