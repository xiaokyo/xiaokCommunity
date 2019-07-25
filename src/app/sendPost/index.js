import React, {useState} from 'react';
import {Input, Button} from 'antd';
import BraftEditor from 'braft-editor';

//style
import 'braft-editor/dist/index.css';
import './style.less';

export default props => {
  const [editorState, seteditorState] = useState (
    BraftEditor.createEditorState (null)
  );

  // editor onchange
  const handleEditorChange = State => {
    seteditorState (State);
  };

  // 发表
  const submitPost = async () => {
    // const htmlContent = editorState.toHTML ();
    // console.log (htmlContent);
  };

  //tit onchange
  const titOnChange = e => {
    console.log (e);
  };

  const excludeControls = [
    'letter-spacing',
    'line-height',
    'clear',
    'headings',
    'list-ol',
    'list-ul',
    'remove-styles',
    'superscript',
    'subscript',
    'hr',
    'text-align',
  ];

  return (
    <div className="sendPost">
      <div className="tit">
        <Input placeholder="想个标题吧~" allowClear onChange={titOnChange} />
      </div>
      <div className="editor">
        <BraftEditor
          excludeControls={excludeControls}
          value={editorState}
          onChange={handleEditorChange}
        />
      </div>

      <Button type="primary" shape="round" onClick={submitPost}>发布</Button>
    </div>
  );
};
