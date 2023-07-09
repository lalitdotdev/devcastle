import dynamic from "next/dynamic";
import Image from "next/image";
import { FC } from "react";

import CustomImageRenderer from "./renderers/CustomImageRenderer";
import CustomCodeRenderer from "./renderers/CustomCodeRenderer";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);

interface EditorOutputContentProps {
  content: any;
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    color: "#374151",
    fontWeight: 400,
    fontFamily: "Inter, sans-serif",
    letterSpacing: "-0.01em",
    marginBottom: "1.5rem",
    marginTop: "1.5rem",
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
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
