import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Toolbar from './Toolbar';

import '../../styles/editor.css';

const RichTextEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-xl p-2 bg-white">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="min-h-[200px] mt-2 prose max-w-none" />
    </div>
  );
};

export default RichTextEditor;
