import React, { useContext, useEffect } from 'react';

import { Context } from '../../context/Context';

export default function Home() {
  const { context, setContext } = useContext(Context);

  useEffect(() => {
    setContext({
      ...context,
      pathname: window.location.pathname
    })
  }, []);

  return <div>Welcome to the Degenerate Hockey Helper</div>
}
