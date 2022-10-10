import React from 'react';
import Copy from '@/component/copy';
import useApp from '@/hooks/useApp';
import './index.less';

export default function () {
  const app = useApp();
  const { version } = app.runtime.getManifest();

  return (
    <div className="version">
      {app.i10n('version')} v{version} <Copy text={version} />
    </div>
  );
}
