import { Typography } from 'antd';
import useApp from '@/hooks/useApp';
import React, { useState, useEffect } from 'react';
import './index.less';

const { Text } = Typography;

export default function (props: any) {
  const { name } = props;
  const app = useApp();
  const [value, setValue] = useState('');

  useEffect(() => {
    app
      .option({
        name,
        origin: true,
        table: 'keys',
      })
      .then((data: any) => {
        if (data && data.value && data.checked) {
          setValue(data.value);
        }
      });
  }, []);

  if (value) {
    return (
      <Text className="keyboard" keyboard>
        {value}
      </Text>
    );
  }

  return null;
}
