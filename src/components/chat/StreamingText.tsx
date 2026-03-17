"use client";

import { useEffect, useRef, useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
}

/**
 * Renders text with a smooth character-by-character reveal animation.
 * New characters fade in with a brief opacity transition, similar to Gemini.
 * Once streaming completes, the full text is shown statically.
 */
export function StreamingText({ content, isStreaming }: StreamingTextProps) {
  const [displayLength, setDisplayLength] = useState(0);
  const prevContentRef = useRef('');
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isStreaming) {
      // Show everything immediately when not streaming
      setDisplayLength(content.length);
      prevContentRef.current = content;
      return;
    }

    const prevLen = prevContentRef.current.length;
    const targetLen = content.length;
    prevContentRef.current = content;

    if (targetLen <= prevLen) {
      setDisplayLength(targetLen);
      return;
    }

    // Animate from prevLen to targetLen with a fast reveal
    let current = prevLen;
    const charsToReveal = targetLen - prevLen;
    // Reveal chunks faster for large bursts, slower for single chars
    const charsPerFrame = Math.max(1, Math.ceil(charsToReveal / 3));

    const step = () => {
      current = Math.min(current + charsPerFrame, targetLen);
      setDisplayLength(current);
      if (current < targetLen) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafRef.current);
  }, [content, isStreaming]);

  if (!isStreaming || displayLength >= content.length) {
    return <MarkdownRenderer content={content} />;
  }

  const revealed = content.slice(0, displayLength);
  const revealing = content.slice(displayLength, Math.min(displayLength + 8, content.length));

  return (
    <span className="whitespace-pre-wrap break-words prose-chat">
      {revealed}
      <span className="streaming-reveal">{revealing}</span>
    </span>
  );
}
