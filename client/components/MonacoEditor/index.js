import { Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
// console.log("🚀 -> file: index.js -> line 4 -> Editor", Editor)

export const drawerTools = {
  open() {},
  close() {}
};

const defaultOpts = {
  theme:"dark",
  defaultLanguage: 'json',
  defaultValue: '// some comment'
};

export default function EditorDrawer() {
  const [visible, toggle] = useState(false);
  const [value, setValue] = useState('// try to write e%v%a%l somewhere 😈 \n');
  const [opts, setOpts] = useState({ ...defaultOpts });
  const monaco = useMonaco();
  useEffect(() => {
    if (monaco) {
      console.log('here is the monaco instance:', monaco);
    }
    drawerTools.open = (content, _opts = {}) => {
      console.log('here is the monaco instance:', monaco);
      setValue(content);
      setOpts(Object.assign({}, defaultOpts, _opts));
      toggle(true);
    };
    drawerTools.close = () => {
      toggle(false);
    };
  }, [monaco]);

  useEffect(() => {
    console.log(opts);
  }, [opts]);

  return (
    <Drawer
      bodyStyle={{ padding: '0 0 0 0' }}
      placement='right'
      closable={false}
      visible={visible}
      onClose={() => toggle(false)}
      width={500}
    >
      <Editor className='dsa' height='100vh' value={value} {...opts} />
    </Drawer>
  );
}
