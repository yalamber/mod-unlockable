import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isConnected?: boolean;
  walletAddress?: string | null;
  disconnect?: () => void;
}

function MainLayout({
  children,
  isConnected,
  walletAddress = '',
  disconnect,
}: LayoutProps) {
  function startAndEnd(str: string) {
    if (str.length > 35) {
      return (
        str.substring(0, 5) +
        '...' +
        str.substring(str.length - 5, str.length)
      );
    }
    return str;
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
        <div className="container px-5">
          <a className="navbar-brand" href="/">
            <img src="/logo.png" alt="MoD" width="120" />
          </a>
          {isConnected && walletAddress && (
            <div id="navbarResponsive">
              <i className="bi bi-wallet"></i> &nbsp;
              {startAndEnd(walletAddress)} &nbsp;
              <button className="btn" onClick={disconnect}>
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      </nav>
      {children}
      <footer className="py-5">
        <div className="container px-5">
          <p className="m-0 text-center small">
            Copyright &copy; Mint On Demand
          </p>
        </div>
      </footer>
    </>
  );
}

export default MainLayout;
