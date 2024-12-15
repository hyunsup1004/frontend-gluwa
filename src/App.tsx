import './style/index.scss';
import React, { useState, useEffect } from 'react';
import { getBalance, getPrice, postSwap } from './services/api'; // API 호출 함수
import TokenSelector from './component/TokenSelector'; // TokenSelector 컴포넌트

const Main: React.FC = () => {
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState<'from' | 'to' | null>(null); // 모달 상태
  const [fromCurrency, setFromCurrency] = useState<string>(''); // "You pay" 통화
  const [toCurrency, setToCurrency] = useState<string>(''); // "You receive" 통화
  const [amount, setAmount] = useState<number>(0); // 입력 금액
  const [balances, setBalances] = useState<{ [key: string]: number }>({}); // 잔액
  const [prices, setPrices] = useState<{ [key: string]: number }>({}); // 가격 (USD 값)
  const [isSwapDisabled, setIsSwapDisabled] = useState<boolean>(true); // Swap 버튼 비활성화 여부

  useEffect(() => {
    // 초기 데이터 로드 (잔액과 가격)
    const fetchData = async () => {
      try {
        const balancesData = await getBalance(); // 잔액 API 호출
        const pricesData = await getPrice(); // 가격 API 호출
        setBalances(balancesData);
        setPrices(pricesData);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    fetchData();
  }, []);

  // 금액 변경 처리 이벤트
  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  // "You pay" 통화 선택 처리 이벤트
  const handleFromCurrencyChange = (currency: string) => {
    setFromCurrency(currency);
  };

  // "You receive" 통화 선택 처리 이벤트
  const handleToCurrencyChange = (currency: string) => {
    setToCurrency(currency);
  };

  // 스왑 버튼 활성화/비활성화 여부를 체크하는 함수
  const checkSwapButtonState = () => {  
    if (!fromCurrency || !toCurrency || amount <= 0) {
      setIsSwapDisabled(true); // 통화와 금액이 모두 입력되지 않으면 비활성화
    } else if (amount > (balances[fromCurrency] || 0)) {
      setIsSwapDisabled(true); // 잔액 초과 시 비활성화
    } else {
      setIsSwapDisabled(false); // 조건을 충족하면 활성화
    }
  };

  // Swap 처리
  const handleSwap = async () => {
    if (!fromCurrency || !toCurrency || amount <= 0) return;
    try {
      const swapData = { fromCurrency, toCurrency, amount };
      await postSwap(swapData);
      alert('Swap completed!');
    } catch (error) {
      alert('Swap failed!');
      console.error('Swap failed:', error);
    }
  };

  // "You pay"와 "You receive"의 통화를 교환하는 함수
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // 상태 변경 후 checkSwapButtonState 호출
  useEffect(() => {
    checkSwapButtonState();
  }, [fromCurrency, toCurrency, amount, balances]);

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
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => handleAmountChange(Number(e.target.value))}
                      placeholder="Enter amount"
                    />
                  </div>
                  <button type="button" className="currency-label" onClick={() => setIsTokenSelectorOpen('from')}>
                    <div className="token">{fromCurrency || 'Select Token'}</div>
                  </button>
                </div>

                <div className="amount item-flex">
                  <div className="lt"></div>
                  <div className="rt">
                    <div className="balance">
                      <span>Balance: {balances[fromCurrency]}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" className="mark" onClick={handleSwapCurrencies}>
                <i className="blind">swap</i>
              </button>

              <div className="swap-item">
                <div className="title">
                  <h3>You receive</h3>
                </div>

                <div className="amount-input">
                  <div className="input">
                    <input
                      type="number"
                      placeholder="0"
                      value={
                        fromCurrency && toCurrency && amount > 0
                          ? ((amount * prices[fromCurrency]) / prices[toCurrency]).toFixed(2)
                          : ''
                      }
                      readOnly
                    />
                  </div>
                  <button type="button" className="currency-label select" onClick={() => setIsTokenSelectorOpen('to')}>
                    {toCurrency || 'Select Token'}
                  </button>
                </div>

                <div className="item-flex amount">
                  <div className="rt">
                    <div className="balance">
                      <span>Balance: {balances[toCurrency]}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="button-wrap">
                <button type="button" className="normal" disabled={isSwapDisabled} onClick={handleSwap}>
                  Swap
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* TokenSelector 모달 */}
      {isTokenSelectorOpen && (
        <TokenSelector
          onSelect={(token: string) => {
            if (isTokenSelectorOpen === 'from') {
              handleFromCurrencyChange(token); // "You pay" 통화 변경
            } else {
              handleToCurrencyChange(token); // "You receive" 통화 변경
            }
            setIsTokenSelectorOpen(null); // 모달 닫기
          }}
          onClose={() => setIsTokenSelectorOpen(null)} // 모달 닫기
        />
      )}
    </>
  );
};

export { Main as default };
