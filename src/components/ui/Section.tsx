import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  id: string;
  children: ReactNode;
  className?: string;
  /** Remove default vertical padding (e.g. full-height hero / pinned scenes). */
  bare?: boolean;
};

/** Anchor target + consistent rhythm for each chapter of the story. */
export default function Section({ id, children, className, bare }: Props) {
  return (
    <section
      id={id}
      className={clsx(
        "relative w-full",
        !bare && "py-20 md:py-32",
        className
      )}
    >
      {children}
    </section>
  );
}
