import dynamic from "next/dynamic";
import Image from "next/image";
import { FC } from "react";
import style from "styled-jsx/style";
import CustomImageRenderer from "./renderers/CustomImageRenderer";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);

interface EditorOutputContentProps {
  content: any;
}

const renderers = {
  image: CustomImageRenderer,
  // code: CustomCodeRenderer,
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

// const CustomCodeRenderer = ({ data }: any) => {};

export default EditorOutputContent;
