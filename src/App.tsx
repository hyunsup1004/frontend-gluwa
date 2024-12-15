import './style/index.scss';
import React, { useState, useEffect } from 'react';
import { getBalance, getPrice, postSwap } from './services/api'; // API ȣ�� �Լ�
import TokenSelector from './component/TokenSelector'; // TokenSelector ������Ʈ

const Main: React.FC = () => {
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState<'from' | 'to' | null>(null);
  const [fromCurrency, setFromCurrency] = useState<string>(''); // "You pay" ��ȭ
  const [toCurrency, setToCurrency] = useState<string>(''); // "You receive" ��ȭ
  const [amount, setAmount] = useState<number>(0); // �Է� �ݾ�
  const [balances, setBalances] = useState<{ [key: string]: number }>({}); // �ܾ�
  const [prices, setPrices] = useState<{ [key: string]: number }>({}); // ���� (USD ��)
  const [isSwapDisabled, setIsSwapDisabled] = useState<boolean>(true); // Swap ��ư ��Ȱ��ȭ ����

  useEffect(() => {
    // �ʱ� ������ �ε�
    const fetchData = async () => {
      try {
        const balancesData = await getBalance(); // �ܾ� API ȣ��
        const pricesData = await getPrice(); // ���� API ȣ��
        setBalances(balancesData);
        setPrices(pricesData);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    fetchData();
  }, []);

  // ���� ��ư Ȱ��ȭ ���θ� Ȯ���ϴ� �Լ�
  const checkSwapButtonState = () => {
    if (!fromCurrency || !toCurrency || amount <= 0) {
      setIsSwapDisabled(true); // ��ȭ�� �ݾ��� ��� �Էµ��� ������ ��Ȱ��ȭ
    } else if (amount > (balances[fromCurrency] || 0)) {
      setIsSwapDisabled(true); // �ܾ� �ʰ� �� ��Ȱ��ȭ
    } else {
      setIsSwapDisabled(false); // ������ �����ϸ� Ȱ��ȭ
    }
  };

  // �ݾ� ���� ó��
  const handleAmountChange = (value: number) => {
    setAmount(value);
    checkSwapButtonState(); // �ݾ� ���� �� ���� ��ư ���� Ȯ��
  };

  // "You pay"�� "You receive" ��ȭ ���� ó��
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    checkSwapButtonState(); // ��ȭ ���� �� ���� ��ư ���� Ȯ��
  };

  // Swap ó��
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

      {/* TokenSelector ��� */}
      {isTokenSelectorOpen && (
        <TokenSelector
          onSelect={(token: string) => {
            if (isTokenSelectorOpen === 'from') {
              setFromCurrency(token);
            } else {
              setToCurrency(token);
            }
            checkSwapButtonState(); // ���� �� ���� ��ư ���� Ȯ��
            setIsTokenSelectorOpen(null); // ��� �ݱ�
          }}
          onClose={() => setIsTokenSelectorOpen(null)}
        />
      )}
    </>
  );
};

export { Main as default };
