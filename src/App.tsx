import './style/index.scss';
import React, { useState } from 'react';
import { TokenSelector } from './component/TokenSelector';

const Main: React.FC = () => {
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const toggleTokenSelectorOpen = () => setIsTokenSelectorOpen(!isTokenSelectorOpen);

  return (
    <>
      <div>
        <section className="page swap-page">
          <div className="box-content">
            <div className="heading">
              <h2>Swap</h2>
            </div>

            <div className="swap-dashboard">
              <div className="swap-item active">
                <div className="title">
                  <h3>You pay</h3>
                </div>

                <div className="amount-input">
                  <div className="input">
                    <input type="number" placeholder='0' />
                  </div>
                  <button type="button" className="currency-label" onClick={toggleTokenSelectorOpen}>
                    <div className="token CTC" data-token-size="28"></div>
                    <strong className="name">CTC</strong>
                  </button>
                </div>

                <div className="amount item-flex">
                  <div className="lt">
                  </div>
                  <div className="rt">
                    <div className="balance">
                      <span>Balance: 10</span>
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" className="mark" onClick={() => { }}>
                <i className="blind">swap</i>
              </button>

              <div className="swap-item">
                <div className="title">
                  <h3>You receive</h3>
                </div>

                <div className="amount-input">
                  <div className="input">
                    <input type="number" placeholder='0' readOnly />
                  </div>
                  <button type="button" className="currency-label select" onClick={toggleTokenSelectorOpen}>
                    Select token
                  </button>
                </div>

                <div className="item-flex amount">
                  <div className="rt">
                    <div className="balance">
                      <span>Balance: 0</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="button-wrap">
                <button type="button" className="normal" disabled={true} onClick={() => { }}>
                  Swap
                </button>
              </div>

            </div>
          </div>
        </section>
      </div>

      {isTokenSelectorOpen && (
        <TokenSelector onClose={() => setIsTokenSelectorOpen(false)} />
      )}
    </>
  );
}

export { Main as default };
