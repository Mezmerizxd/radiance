import * as React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="h-full ">
        <div>{children}</div>
      </div>
    </>
  );
};
