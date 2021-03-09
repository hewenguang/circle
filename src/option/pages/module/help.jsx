import React, { useState } from 'react';
import Loading from 'src/option/components/loading';

export default function(){
  const [ loading, setLoading ] = useState(true);

  return (
    <div className="option-list option-iframe">
      {loading && (
        <Loading float />
      )}
      <iframe
        onLoad={() => setLoading(false)}
        src="https://ranhe.xyz/circle-about"
      />
    </div>
  );
}
