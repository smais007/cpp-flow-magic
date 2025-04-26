import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode }) => {
  const onChange = React.useCallback(
    (value: string) => {
      setCode(value);
    },
    [setCode]
  );

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-border bg-white">
      <CodeMirror
        value={code}
        height="100%"
        extensions={[cpp()]}
        onChange={onChange}
        className="font-mono text-sm"
        theme="light"
      />
    </div>
  );
};

export default CodeEditor;
