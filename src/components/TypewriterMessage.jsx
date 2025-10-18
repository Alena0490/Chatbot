// TypewriterMessage.jsx
import { useEffect, useRef, useState } from "react";
import './TypewriterMessage.css';

const TypewriterMessage = ({
  text,
  cps = 18,
  startDelay = 250,
  showCaret = true,
  enableSkip = true,
  className = "",
   as: Tag = "div", 
   onProgress, 

  onDone,
}) => {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  const iRef = useRef(0);
  const rafRef = useRef(0);
  const startRef = useRef(0);

  const extraDelayFor = (ch) => (/[.,?!]/.test(ch) ? 80 : 0);

 useEffect(() => {
    setOut(""); setDone(false); iRef.current = 0; startRef.current = 0;

    const step = (t) => {
      if (!startRef.current) startRef.current = t + startDelay;
      const elapsed = Math.max(0, t - startRef.current);
      let budget = Math.min(1, (elapsed / 1000) * cps); // max 1 znak / frame
      let idx = iRef.current;

      while (idx < text.length && budget >= 1) {
        budget -= 1 + extraDelayFor(text[idx]) / (1000 / cps);
        idx++;
      }

      const next = Math.min(text.length, idx);
      if (next !== iRef.current) {
        iRef.current = next;
        setOut(text.slice(0, next));
        onProgress?.(next);      // 👈 pípni parentu na každý krok
      }

      if (next >= text.length) { setDone(true); onDone?.(); return; }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, cps, startDelay, onDone, onProgress]);

  const skip = () => {
    if (enableSkip && !done) {
      cancelAnimationFrame(rafRef.current);
      setOut(text);
      setDone(true);
      onDone?.();
    }
  };

  return (
    <Tag
        className={className}
        role="status"
        aria-live={done ? "polite" : "off"} 
        aria-atomic="true"
        onClick={skip}
        style={{ whiteSpace: "pre-wrap" }}
        title={enableSkip && !done ? "Klikni pro přeskočení" : undefined}
    >
        {out}
        {showCaret && !done && <span className="tw-caret" aria-hidden="true">▎</span>}
    </Tag>
  );
};

export default TypewriterMessage;

