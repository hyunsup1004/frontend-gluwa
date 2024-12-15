import React from 'react';

interface TokenSelectorProps {
  onClose: () => void;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({ onClose }) => {
  return (
    <section className="layer-wrap">
      <div className="dimmed" onClick={onClose}></div>
      <div className="layer-container">
        <header className="layer-header">
          <div className="inner">
            <h3>Select a token</h3>
            <button type="button" className="button-close" onClick={onClose}>
              <i className="blind">Close</i>
            </button>
          </div>
        </header>
        <div className="layer-content">
          <div className="inner">
            <div className="select-token-wrap">
              <div className="currency-list-wrap">
                <div className="lists">
                  <button type="button" className="currency-label" onClick={() => { }}>
                    <div className="token CTC" data-token-size="36"></div>
                    <div className="name">
                      <div className="full">Creditcoin</div>
                      <span>CTC</span>
                    </div>
                  </button>
                  <button type="button" className="currency-label" onClick={() => { }}>
                    <div className="token USDC" data-token-size="36"></div>
                    <div className="name">
                      <div className="full">USDCoin</div>
                      <span>USDC</span>
                    </div>
                  </button>
                  <button type="button" className="currency-label" onClick={() => { }}>
                    <div className="token USDT" data-token-size="36"></div>
                    <div className="name">
                      <div className="full">Tether USD</div>
                      <span>USDT</span>
                    </div>
                  </button>
                  <button type="button" className="currency-label" onClick={() => { }}>
                    <div className="token WCTC" data-token-size="36"></div>
                    <div className="name">
                      <div className="full">Wrapped CTC</div>
                      <span>WCTC</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
