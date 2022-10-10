import useApp from '@/hooks/useApp';
import React, { useState } from 'react';
import { Button, Upload } from 'antd';

export interface ImportProps {
  id: string;
  title: string;
  tooltip?: string;
}

export default function (props: ImportProps) {
  const { title } = props;
  const app = useApp();
  const uploadProps = {
    maxCount: 1,
    name: 'file',
    fileList: [],
    multiple: false,
    accept: '.json,.circle',
    beforeUpload: () => false,
  };
  const [loading, setLoading] = useState(false);
  const handleImport = (info: any) => {
    const file = info.file;
    const reader = new FileReader();
    setLoading(true);
    reader.addEventListener('load', function () {
      app.send('import', { data: this.result }, (error: string) => {
        setLoading(false);
        if (error) {
          app.fire('notice', {
            type: 'error',
            message: error,
          });
          return;
        }
        location.reload();
      });
    });
    reader.readAsText(file);
  };

  return (
    <Upload {...uploadProps} onChange={handleImport}>
      <Button block size="middle" loading={loading}>
        {title}
      </Button>
    </Upload>
  );
}
