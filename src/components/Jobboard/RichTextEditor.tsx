import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import React, { forwardRef } from 'react';

import { EditorProps } from 'react-draft-wysiwyg';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    {
        loading: () => <Loader2 className="h-6 w-6 animate-spin" />,
        ssr: false
    }
);

const RichTextEditor = forwardRef<any, EditorProps>(function RichTextEditor(props, ref) {
    return (
        <div className="rich-text-editor-wrapper">
            <Editor
                editorClassName={cn(
                    "prose max-w-none dark:prose-invert focus:outline-none",
                    "min-h-[200px] px-4 py-3 rounded-md border border-input bg-background",
                    "transition-colors focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-ring focus-visible:ring-offset-2 text-black",
                    props.editorClassName
                )}
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'history'],
                    inline: {
                        options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
                    },
                    blockType: {
                        inDropdown: true,
                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
                    },
                    fontSize: {
                        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48],
                    },
                    textAlign: {
                        inDropdown: false,
                        options: ['left', 'center', 'right', 'justify'],
                    },
                    image: {
                        urlEnabled: true,
                        uploadEnabled: true,
                        alignmentEnabled: true,
                        uploadCallback: (file: File) => new Promise(resolve => {
                            // Implement your image upload logic here
                            // For this example, we're just creating a data URL
                            const reader = new FileReader();
                            reader.onload = () => resolve({ data: { link: reader.result } });
                            reader.readAsDataURL(file);
                        }),
                        previewImage: true,
                        inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                        alt: { present: true, mandatory: false },
                    },
                }}
                editorRef={(r: any) => {
                    if (typeof ref === 'function') {
                        ref(r);
                    } else if (ref) {
                        ref.current = r;
                    }
                }}
                {...props}
            />
        </div>
    );
});

export default RichTextEditor;
