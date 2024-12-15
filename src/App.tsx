import './style/index.scss';
import React, { useState, useEffect } from 'react';
import { getBalance, getPrice, postSwap } from './services/api'; // API 호출 함수
import TokenSelector from './component/TokenSelector'; // TokenSelector 컴포넌트

const Main: React.FC = () => {
  // 상태 변수 선언
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState<'from' | 'to' | null>(null); // 모달 상태 (from: "You pay", to: "You receive")
  const [fromCurrency, setFromCurrency] = useState<string>(''); // "You pay" 통화
  const [toCurrency, setToCurrency] = useState<string>(''); // "You receive" 통화
  const [amount, setAmount] = useState<number>(0); // 입력 금액
  const [balances, setBalances] = useState<{ [key: string]: number }>({}); // 잔액
  const [prices, setPrices] = useState<{ [key: string]: number }>({}); // 가격 (USD 값)
  const [isSwapDisabled, setIsSwapDisabled] = useState<boolean>(true); // Swap 버튼 비활성화 여부

  // 초기 데이터 로드 (잔액과 가격) - 비동기 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        const balancesData = await getBalance(); // 잔액 API 호출
        const pricesData = await getPrice(); // 가격 API 호출
        setBalances(balancesData); // 응답 받은 잔액 데이터 상태에 설정
        setPrices(pricesData); // 응답 받은 가격 데이터 상태에 설정
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    fetchData();
  }, []); // 빈 배열을 넣어 초기 렌더링 시 한 번만 호출

  // 금액 변경 처리 이벤트
  const handleAmountChange = (value: number) => {
    setAmount(value); // 입력 금액 상태 업데이트
    checkSwapButtonState(); // 금액 변경 시 스왑 버튼 상태 체크
  };

  // "You pay" 통화 선택 처리 이벤트
  const handleFromCurrencyChange = (currency: string) => {
    setFromCurrency(currency); // "You pay" 통화 상태 업데이트
    checkSwapButtonState(); // 통화 변경 시 스왑 버튼 상태 체크
  };

  // "You receive" 통화 선택 처리 이벤트
  const handleToCurrencyChange = (currency: string) => {
    setToCurrency(currency); // "You receive" 통화 상태 업데이트
    checkSwapButtonState(); // 통화 변경 시 스왑 버튼 상태 체크
  };

  // 스왑 버튼 활성화/비활성화 여부를 체크하는 함수
  const checkSwapButtonState = () => {
    // 모든 필드가 채워졌는지, 금액이 잔액을 초과하는지 등을 확인
    if (!fromCurrency || !toCurrency || amount <= 0) {
      setIsSwapDisabled(true); // 통화와 금액이 모두 입력되지 않으면 비활성화
    } else if (amount > (balances[fromCurrency] || 0)) {
      setIsSwapDisabled(true); // 잔액 초과 시 비활성화
    } else if (fromCurrency === toCurrency) {
      setIsSwapDisabled(true); // 같은 통화일 경우 비활성화
    } else {
      setIsSwapDisabled(false); // 조건을 충족하면 활성화
    }
  };

  // Swap 처리
  const handleSwap = async () => {
    if (!fromCurrency || !toCurrency || amount <= 0) return; // 필수 값들이 채워지지 않으면 반환

    try {
      // "You pay" 금액에서 잔액 차감
      const newBalanceFromCurrency = (Number(balances[fromCurrency]) || 0) - amount;

      // "You receive" 금액 계산 (가격 변환)
      const receiveAmount = (amount * (Number(prices[fromCurrency]) || 0)) / (Number(prices[toCurrency]) || 1);

      // "You receive" 통화의 잔액 추가
      const newBalanceToCurrency = (Number(balances[toCurrency]) || 0) + receiveAmount;

      // 서버로 스왑 요청 (postSwap)
      const swapData = { fromCurrency, toCurrency, amount };
      await postSwap(swapData); // API 호출 (POST 요청)

      // 스왑 후 잔액 업데이트 (UI 상태 갱신)
      setBalances({
        ...balances,
        [fromCurrency]: newBalanceFromCurrency, // "You pay" 통화 잔액 차감
        [toCurrency]: newBalanceToCurrency, // "You receive" 통화 잔액 추가
      });

      // 여기에 DB에서 발란스를 업데이트하는 부분을 추가할 수 있습니다.
      // 주석 처리된 부분: 나중에 DB에 발란스 업데이트 코드 추가 필요
      // 스왑과 밸랜스 업데이트 로직을 같이 사용할수있게 변경
      
      /*
      const updatedBalances = await updateBalancesOnServer(newBalanceFromCurrency, newBalanceToCurrency);
      setBalances(updatedBalances); 
      */

      alert('Swap completed!'); // 성공 알림
    } catch (error) {
      alert('Swap failed!');
      console.error('Swap failed:', error); // 에러 로그
    }
  };

  // "You pay"와 "You receive"의 통화를 교환하는 함수
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency); // "You pay"와 "You receive"의 값을 교환
    setToCurrency(fromCurrency);
    checkSwapButtonState(); // 상태 변경 후 스왑 버튼 상태 확인
  };

  // 상태 변경 후 checkSwapButtonState 호출
  useEffect(() => {
    checkSwapButtonState(); // fromCurrency, toCurrency, amount, balances 상태가 변경될 때마다 호출
  }, [fromCurrency, toCurrency, amount, balances]); // 의존성 배열에 필요한 상태 추가

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
                      onChange={(e) => handleAmountChange(Number(e.target.value))} // 금액 변경 시 처리
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
                      <span>Balance: {balances[fromCurrency]}</span> {/* 현재 선택된 통화의 잔액 표시 */}
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
                      value={fromCurrency && toCurrency && amount > 0
                        ? ((amount * prices[fromCurrency]) / prices[toCurrency]).toFixed(2) // 계산된 You receive 금액
                        : ''}
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
                      <span>Balance: {balances[toCurrency]}</span> {/* 현재 선택된 "You receive" 통화의 잔액 표시 */}
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
