import * as React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="bg-background-dark">
        <div>{children}</div>
      </div>
    </>
  );
};
