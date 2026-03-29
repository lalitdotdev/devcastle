"use client";

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="not-prose bg-muted/50 border border-border/50 rounded-xl p-6 overflow-x-auto my-6 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 transition-colors">
      <code className="text-foreground/90 whitespace-pre">
        {data.code}
      </code>
    </pre>
  );
}

export default CustomCodeRenderer;
2;
