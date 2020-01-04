import React, { useContext, useEffect } from 'react';

import { Context } from '../../context/Context';

export default function Gambling() {
  const { context, setContext } = useContext(Context);

  useEffect(() => {
    setContext({
      ...context,
      pathname: window.location.pathname
    })
  }, []);

  return <div>Degenerate Gambling Hockey Page</div>
}
