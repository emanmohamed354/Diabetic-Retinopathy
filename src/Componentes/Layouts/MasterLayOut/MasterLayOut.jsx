import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MasterLayOut() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}