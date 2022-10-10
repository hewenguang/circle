import React from 'react';
import useApp from '@/hooks/useApp';
import Footer from './footer';
import Container from './container';

export default function () {
  const app = useApp();

  return (
    <>
      <Container app={app} />
      <Footer app={app} />
    </>
  );
}
