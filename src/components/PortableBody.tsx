import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/sanity/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 leading-relaxed text-slate-200">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 font-display text-3xl text-moon">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 font-display text-2xl text-moon">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-accent pl-6 font-display text-xl italic text-moon">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-disc space-y-2 pl-6 text-slate-200">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-decimal space-y-2 pl-6 text-slate-200">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-moon">{children}</strong>
    ),
    code: ({ children }) => (
      <code className="rounded bg-ink-700 px-1.5 py-0.5 font-mono text-sm text-accent">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="text-accent underline underline-offset-4"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const url = urlForImage(value);
      if (!url) return null;
      return (
        <span className="my-8 block overflow-hidden rounded-2xl">
          <Image
            src={url}
            alt={value?.alt || ""}
            width={1200}
            height={700}
            className="h-auto w-full object-cover"
          />
        </span>
      );
    },
  },
};

export default function PortableBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
