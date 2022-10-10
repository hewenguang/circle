import AppContext from './index';
import { useContext } from 'react';

export default function (pure = true) {
  const app: {
    app?: any;
  } = useContext(AppContext);
  if (pure) {
    return app.app ? app.app : app;
  }
  return app;
}
