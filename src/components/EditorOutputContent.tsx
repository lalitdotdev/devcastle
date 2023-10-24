"use client";
import dynamic from "next/dynamic";

import { FC } from "react";

import CustomCodeRenderer from "./renderers/CustomCodeRenderer";
import CustomImageRenderer from "./renderers/CustomImageRenderer";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  },
);

interface EditorOutputContentProps {
  content: any;
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const style = {
  paragraph: {
    fontSize: "0.885rem",
    lineHeight: "1.25rem",
    color: "#333",
    fontWeight: 400,
    fontFamily: "Arial, sans-serif",
    letterSpacing: "-0.01em",
    marginTop: "1.5rem",
    marginBottom: "1rem",
  },
};

const EditorOutputContent: FC<EditorOutputContentProps> = ({ content }) => {
  return (
    // @ts-ignore
    <Output
      style={style}
      data={content}
      className="text-sm"
      renderers={renderers}
    />
  );
};

export default EditorOutputContent;
