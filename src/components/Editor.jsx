import React, { Component } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
function Editor(props) {
  return (
    <div className="editor">
      <h2>Sumarize News</h2>
      <CKEditor
        editor={ClassicEditor}
        data="<p></p>"
        onChange={(event, editor) => {
          const data = editor.getData();
          props.onChangeContent(data);
        }}
      />
    </div>
  );
}

export default Editor;
