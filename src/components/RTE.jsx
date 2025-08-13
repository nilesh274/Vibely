import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className='w-full'> 
      {label && (
        <label className='text-sm sm:text-md md:text-lg lg:text-xl font-sans font-semibold dark:text-slate-200 inline-block mb-1 pl-1'>
          {label}
        </label>
      )}

      <Controller
        name={name || "content"} 
        control={control}
        render={({ field: { onChange, value } }) => ( 
          <Editor
            apiKey="8q0m49z96wk6agvu4gsq2rhb8fyeyft63mt3muzwvijbao5o" 
            initialValue={defaultValue}
            init={{
              height: 300,
              menubar: true,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:12px }",
            }}
            onEditorChange={onChange}
            value={value || defaultValue} 
          />
        )}
      />
    </div>
  );
}
