"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as RK,
} from "react";
import { FRAMES, pathLabel } from "./frames";
import { profile, projects } from "@/data/content";

export type NavStyle = "cd" | "vim" | "cat" | "open";

type Line = { kind: "in" | "out" | "ok" | "err" | "sys"; text: string };

type Props = {
  focus: number; // current section index, -1 = home
  open: boolean; // scrollback visible
  onOpenChange: (open: boolean) => void;
  onActiveChange: (active: boolean) => void; // input focus → parent key guard
  onNavigate: (target: number, style: NavStyle) => void;
  onTour?: () => void;
  onStopTour?: () => void;
};

const HOME_WORDS = new Set(["~", "/", "..", "home", "cd", ""]);
const ALIASES: Record<string, string> = {
  work: "projects",
  stack: "skills",
  life: "hobbies",
  writing: "blog",
  welcome: "hero",
  me: "hero",
  bio: "hero",
};

const COMMANDS = [
  "help",
  "ls",
  "cd",
  "open",
  "vim",
  "cat",
  "pwd",
  "tree",
  "tour",
  "stop",
  "whoami",
  "history",
  "clear",
  "echo",
  "date",
  "exit",
  "sudo",
  "coffee",
  "cricket",
];

/** Resolve a token to a section index, "home", or null (not found). */
function resolve(token: string): number | "home" | null {
  const t = token.trim().toLowerCase().replace(/\/+$/, "");
  if (HOME_WORDS.has(t)) return "home";
  const want = ALIASES[t] ?? t;
  const idx = FRAMES.findIndex(
    (f) =>
      f.id === want ||
      f.label.toLowerCase() === want ||
      f.file.toLowerCase().replace(/[/.].*$/, "") === want
  );
  return idx >= 0 ? idx : null;
}

const CAT: Record<string, string[]> = {
  hero: [`${profile.name} — ${profile.tagline}`, profile.status],
  about: ["origin: cricket-obsessed kid who redirected the competitive streak into code.", "now: shipping thoughtful, AI-driven products."],
  projects: projects.map((p) => `${p.title} — ${p.tagline ?? p.blurb.slice(0, 60)}`),
  skills: ["build: Kotlin · Java · Python · JS", "scale: FastAPI · AWS · Docker · Redis", "explore: PyTorch · HF · LangGraph"],
  hobbies: ["cricket (above all else) · music · family · breaking new tech"],
  sidequests: ["running · questionable experiments · learning rabbit holes · coffee research"],
  blog: ["build logs and half-formed ideas, written down. run `open blog`."],
  contact: ["the inbox is always open. run `cat contact.sh` then `open contact`."],
};

export default function Terminal({
  focus,
  open,
  onOpenChange,
  onActiveChange,
  onNavigate,
  onTour,
  onStopTour,
}: Props) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "sys", text: "mohak.sh — type `help`, or try `ls`, `cd projects`, `vim about.md`" },
  ]);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const history = useRef<string[]>([]);
  const hist = useRef<number>(-1);

  const prompt = useMemo(() => pathLabel(focus), [focus]);

  // keep scrollback pinned to the latest line
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines, open]);

  // focus the input whenever the scrollback opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const push = (...l: Line[]) => setLines((prev) => [...prev, ...l]);

  const navTo = (target: number, style: NavStyle, label: string) => {
    push({ kind: "ok", text: label });
    onNavigate(target, style);
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    push({ kind: "in", text: `${prompt} % ${cmd}` });
    if (!cmd) return;
    history.current.push(cmd);
    hist.current = history.current.length;

    const [name, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");
    const c = name.toLowerCase();

    const goByArg = (style: NavStyle) => {
      const r = resolve(arg || "");
      if (r === "home") return navTo(-1, style, "→ ~ (home)");
      if (r === null)
        return push({ kind: "err", text: `${c}: no such section: ${arg || "?"}` });
      const f = FRAMES[r];
      const verb = style === "vim" ? "opening" : style === "cat" ? "reading" : "cd";
      if (style === "cat") {
        (CAT[f.id] ?? ["(empty)"]).forEach((t) => push({ kind: "out", text: t }));
      }
      navTo(r, style, `${verb} ${f.file} →`);
    };

    switch (c) {
      case "help":
        push(
          { kind: "out", text: "navigation" },
          { kind: "out", text: "  ls · cd <s> · open <s> · vim <s> · cat <s> · cd ~  (home)" },
          { kind: "out", text: "sections" },
          { kind: "out", text: "  " + FRAMES.map((f) => f.label.toLowerCase()).join(" · ") },
          { kind: "out", text: "misc" },
          { kind: "out", text: "  tour (auto-play) · stop · tree · whoami · pwd · history · clear" },
          { kind: "out", text: "tip: Tab completes · ↑/↓ history · ` toggles this panel" }
        );
        break;
      case "ls":
        FRAMES.forEach((f) =>
          push({ kind: "out", text: `${f.icon}  ${f.file.padEnd(16)} ${f.label}` })
        );
        break;
      case "tour":
      case "demo":
        push({ kind: "ok", text: "▶ auto-tour engaged — sit back. (run `stop` or hit Esc)" });
        onTour?.();
        break;
      case "stop":
        push({ kind: "out", text: "⏹ tour stopped." });
        onStopTour?.();
        break;
      case "tree":
        push({ kind: "out", text: "portfolio/" });
        FRAMES.forEach((f, i) =>
          push({
            kind: "out",
            text: `${i === FRAMES.length - 1 ? "└──" : "├──"} ${f.file}`,
          })
        );
        break;
      case "cd":
        goByArg("cd");
        break;
      case "open":
        goByArg("open");
        break;
      case "vim":
      case "nvim":
      case "nano":
        goByArg("vim");
        break;
      case "cat":
      case "less":
      case "more":
        goByArg("cat");
        break;
      case "pwd":
        push({ kind: "out", text: `/users/mohak/portfolio/${prompt.replace("~", "").replace("/", "") || ""}`.replace(/\/$/, "") });
        break;
      case "whoami":
        push(
          { kind: "out", text: profile.name },
          { kind: "out", text: profile.tagline },
          { kind: "out", text: `📍 ${profile.location}` }
        );
        break;
      case "date":
        push({ kind: "out", text: new Date().toString() });
        break;
      case "history":
        history.current.forEach((h, i) =>
          push({ kind: "out", text: `${String(i + 1).padStart(3, " ")}  ${h}` })
        );
        break;
      case "echo":
        push({ kind: "out", text: arg });
        break;
      case "clear":
        setLines([]);
        break;
      case "coffee":
        push({ kind: "out", text: "☕ brewing... productivity +5%, confidence +40%." });
        break;
      case "cricket":
        push({ kind: "out", text: "🏏 cover drive. straight back down the ground. SIX." });
        break;
      case "sudo":
        push({ kind: "err", text: "nice try. you already have root here." });
        break;
      case "rm":
        push({ kind: "err", text: rest.includes("-rf") ? "absolutely not. 🙅" : "rm: nothing worth deleting here." });
        break;
      case "exit":
      case "logout":
        push({ kind: "out", text: "you can check out any time you like, but you can never leave 🎸 → home" });
        navTo(-1, "cd", "→ ~");
        break;
      default:
        push({ kind: "err", text: `command not found: ${c} — try \`help\`` });
    }
  };

  const complete = () => {
    const parts = value.split(/\s+/);
    const editing = parts[parts.length - 1] ?? "";
    const pool =
      parts.length <= 1
        ? COMMANDS
        : FRAMES.map((f) => f.label.toLowerCase()).concat(
            FRAMES.map((f) => f.file)
          );
    const hits = pool.filter((p) => p.startsWith(editing.toLowerCase()));
    if (hits.length === 1) {
      parts[parts.length - 1] = hits[0];
      setValue(parts.join(" "));
    } else if (hits.length > 1) {
      push({ kind: "out", text: hits.join("   ") });
      onOpenChange(true);
    }
  };

  const onKeyDown = (e: RK<HTMLInputElement>) => {
    if (e.key === "`") {
      e.preventDefault();
      onOpenChange(!open);
      return;
    }
    if (e.key === "Enter") {
      onOpenChange(true);
      run(value);
      setValue("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.current.length) {
        hist.current = Math.max(0, hist.current - 1);
        setValue(history.current[hist.current] ?? "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hist.current < history.current.length - 1) {
        hist.current += 1;
        setValue(history.current[hist.current] ?? "");
      } else {
        hist.current = history.current.length;
        setValue("");
      }
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
      onOpenChange(false);
    }
  };

  return (
    <div
      data-terminal
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-5 sm:pb-4"
    >
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-emerald-300/20 bg-[#0B1320]/92 font-mono text-[13px] text-[#cfe9df] shadow-[0_-10px_60px_-15px_rgba(15,27,45,0.6)] backdrop-blur-xl">
        {/* title bar */}
        <button
          onClick={() => onOpenChange(!open)}
          className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-2 text-left"
        >
          <span className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
          </span>
          <span className="text-[#7c97a7]">mohak@portfolio — zsh</span>
          <span className="ml-auto text-[#5b6b82]">{open ? "▾ hide" : "▴ console"}</span>
        </button>

        {/* scrollback */}
        {open && (
          <div ref={scrollRef} className="max-h-[34vh] overflow-y-auto px-4 py-3 leading-relaxed">
            {lines.map((l, i) => (
              <div
                key={i}
                className={
                  l.kind === "in"
                    ? "text-[#9fb4c4]"
                    : l.kind === "ok"
                    ? "text-emerald-300"
                    : l.kind === "err"
                    ? "text-rose-300"
                    : l.kind === "sys"
                    ? "text-emerald-400/70"
                    : "text-[#cfe9df]"
                }
              >
                <span className="whitespace-pre-wrap">{l.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* input line — always present */}
        <div className="flex items-center gap-2 px-4 py-2.5">
          <span className="shrink-0 text-emerald-400">
            mohak@portfolio <span className="text-[#7c97a7]">{prompt}</span> %
          </span>
          <input
            ref={inputRef}
            value={value}
            spellCheck={false}
            autoComplete="off"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => onActiveChange(true)}
            onBlur={() => onActiveChange(false)}
            placeholder="type a command…  (`ls`, `cd projects`, `vim about.md`)"
            className="flex-1 bg-transparent text-[#eafff7] caret-emerald-400 outline-none placeholder:text-[#46586b]"
          />
        </div>
      </div>
    </div>
  );
}
