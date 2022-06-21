import { Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import Editor, { useMonaco,loader } from '@monaco-editor/react';

// loader.config({ paths:{vs:"https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.33.0/min/vs"}});
loader.config({paths:{vs:"http://192.168.1.200:9110/monaco-editor/min/vs"}})
// loader.config({monaco})
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
      if(_opts.language){
        _opts.defaultLanguage = _opts.language;
      }
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
      width={'800px'}
    >
      <Editor height='100vh' value={value} {...opts} />
    </Drawer>
  );
}
