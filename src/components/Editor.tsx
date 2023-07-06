"use client";
import { FC, useCallback, useEffect, useRef, useState } from "react";

interface EditorProps {
  communityId: string;
}
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { PostCreateRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";

import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
const Editor: FC<EditorProps> = ({ communityId }) => {
  // type safety for form using generic type argument PostCreateRequest (see src/lib/validators/post.ts)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreateRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      communityId,
      title: "",
      content: null,
    },
  });

  const ref = useRef<EditorJS>();
  // Initializing the editor but differing the loading dynamically

  const [isMounted, setIsMounted] = useState<boolean>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const List = (await import("@editorjs/list")).default;
    const Table = (await import("@editorjs/table")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const ImageTool = (await import("@editorjs/image")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const Code = (await import("@editorjs/code")).default;
    const Quote = (await import("@editorjs/quote")).default;
    const Marker = (await import("@editorjs/marker")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor", // div to which the editor is trying to mount to
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type something awesome! ..",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },

          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], "imageUploader");

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          table: Table,
          embed: Embed,
          inlineCode: InlineCode,
          code: Code,
          quote: Quote,
          marker: Marker,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  // error handling for react-hook-form

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // mapping over them

      for (const [_key, value] of Object.entries(errors)) {
        // return toast message for each error

        toast({
          title: "Something went wrong",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        // set focus to title
        _titleRef.current?.focus();
      }, 0);
    };
    if (isMounted) {
      init();

      // cleanup function to destroy the editor instance when the component unmounts (see https://editorjs.io/saving-data) (see https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup)
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  const { ref: titleRef, ...rest } = register("title"); // register the title field with react-hook-form and get the ref to the input element (see https://react-hook-form.com/api/useform/register) and spread the rest of the props to the input element.

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form
        id="community-post-form"
        className="w-fit"
        onSubmit={handleSubmit(() => {})}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);

              // @ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />

          {/* shell to mount the editor */}

          <div id="editor" className="min-h-[500px]" />
        </div>
      </form>
    </div>
  );
};

export default Editor;
