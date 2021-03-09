import React, { useState } from 'react';
import Loading from 'src/option/components/loading';

export default function(){
  const [ loading, setLoading ] = useState(true);
  const lang = api.i18n.getUILanguage();

  return (
    <div className="option-list option-iframe">
      {loading && (
        <Loading float />
      )}
      <iframe
        onLoad={() => setLoading(false)}
        src={`https://ranhe.xyz/${!/zh-cn/i.test(lang) ? 'circle-about-en' : 'circle-about'}?lang=${lang}`}
      />
    </div>
  );
}
