import './style/index.scss';
import React, { useState, useEffect } from 'react';
import { getBalance, getPrice, postSwap } from './services/api'; // API ȣ�� �Լ�
import TokenSelector from './component/TokenSelector'; // TokenSelector ������Ʈ

const Main: React.FC = () => {
  // ���� ���� ����
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState<'from' | 'to' | null>(null); // ��� ���� (from: "You pay", to: "You receive")
  const [fromCurrency, setFromCurrency] = useState<string>(''); // "You pay" ��ȭ
  const [toCurrency, setToCurrency] = useState<string>(''); // "You receive" ��ȭ
  const [amount, setAmount] = useState<number>(0); // �Է� �ݾ�
  const [balances, setBalances] = useState<{ [key: string]: number }>({}); // �ܾ�
  const [prices, setPrices] = useState<{ [key: string]: number }>({}); // ���� (USD ��)
  const [isSwapDisabled, setIsSwapDisabled] = useState<boolean>(true); // Swap ��ư ��Ȱ��ȭ ����

  // �ʱ� ������ �ε� (�ܾװ� ����) - �񵿱� ȣ��
  useEffect(() => {
    const fetchData = async () => {
      try {
        const balancesData = await getBalance(); // �ܾ� API ȣ��
        const pricesData = await getPrice(); // ���� API ȣ��
        setBalances(balancesData); // ���� ���� �ܾ� ������ ���¿� ����
        setPrices(pricesData); // ���� ���� ���� ������ ���¿� ����
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    fetchData();
  }, []); // �� �迭�� �־� �ʱ� ������ �� �� ���� ȣ��

  // �ݾ� ���� ó�� �̺�Ʈ
  const handleAmountChange = (value: number) => {
    setAmount(value); // �Է� �ݾ� ���� ������Ʈ
    checkSwapButtonState(); // �ݾ� ���� �� ���� ��ư ���� üũ
  };

  // "You pay" ��ȭ ���� ó�� �̺�Ʈ
  const handleFromCurrencyChange = (currency: string) => {
    setFromCurrency(currency); // "You pay" ��ȭ ���� ������Ʈ
    checkSwapButtonState(); // ��ȭ ���� �� ���� ��ư ���� üũ
  };

  // "You receive" ��ȭ ���� ó�� �̺�Ʈ
  const handleToCurrencyChange = (currency: string) => {
    setToCurrency(currency); // "You receive" ��ȭ ���� ������Ʈ
    checkSwapButtonState(); // ��ȭ ���� �� ���� ��ư ���� üũ
  };

  // ���� ��ư Ȱ��ȭ/��Ȱ��ȭ ���θ� üũ�ϴ� �Լ�
  const checkSwapButtonState = () => {
    // ��� �ʵ尡 ä��������, �ݾ��� �ܾ��� �ʰ��ϴ��� ���� Ȯ��
    if (!fromCurrency || !toCurrency || amount <= 0) {
      setIsSwapDisabled(true); // ��ȭ�� �ݾ��� ��� �Էµ��� ������ ��Ȱ��ȭ
    } else if (amount > (balances[fromCurrency] || 0)) {
      setIsSwapDisabled(true); // �ܾ� �ʰ� �� ��Ȱ��ȭ
    } else if (fromCurrency === toCurrency) {
      setIsSwapDisabled(true); // ���� ��ȭ�� ��� ��Ȱ��ȭ
    } else {
      setIsSwapDisabled(false); // ������ �����ϸ� Ȱ��ȭ
    }
  };

  // Swap ó��
  const handleSwap = async () => {
    if (!fromCurrency || !toCurrency || amount <= 0) return; // �ʼ� ������ ä������ ������ ��ȯ

    try {
      // "You pay" �ݾ׿��� �ܾ� ����
      const newBalanceFromCurrency = (Number(balances[fromCurrency]) || 0) - amount;

      // "You receive" �ݾ� ��� (���� ��ȯ)
      const receiveAmount = (amount * (Number(prices[fromCurrency]) || 0)) / (Number(prices[toCurrency]) || 1);

      // "You receive" ��ȭ�� �ܾ� �߰�
      const newBalanceToCurrency = (Number(balances[toCurrency]) || 0) + receiveAmount;

      // ������ ���� ��û (postSwap)
      const swapData = { fromCurrency, toCurrency, amount };
      await postSwap(swapData); // API ȣ�� (POST ��û)

      // ���� �� �ܾ� ������Ʈ (UI ���� ����)
      setBalances({
        ...balances,
        [fromCurrency]: newBalanceFromCurrency, // "You pay" ��ȭ �ܾ� ����
        [toCurrency]: newBalanceToCurrency, // "You receive" ��ȭ �ܾ� �߰�
      });

      // ���⿡ DB���� �߶����� ������Ʈ�ϴ� �κ��� �߰��� �� �ֽ��ϴ�.
      // �ּ� ó���� �κ�: ���߿� DB�� �߶��� ������Ʈ �ڵ� �߰� �ʿ�
      // ���Ұ� �뷣�� ������Ʈ ������ ���� ����Ҽ��ְ� ����
      
      /*
      const updatedBalances = await updateBalancesOnServer(newBalanceFromCurrency, newBalanceToCurrency);
      setBalances(updatedBalances); 
      */

      alert('Swap completed!'); // ���� �˸�
    } catch (error) {
      alert('Swap failed!');
      console.error('Swap failed:', error); // ���� �α�
    }
  };

  // "You pay"�� "You receive"�� ��ȭ�� ��ȯ�ϴ� �Լ�
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency); // "You pay"�� "You receive"�� ���� ��ȯ
    setToCurrency(fromCurrency);
    checkSwapButtonState(); // ���� ���� �� ���� ��ư ���� Ȯ��
  };

  // ���� ���� �� checkSwapButtonState ȣ��
  useEffect(() => {
    checkSwapButtonState(); // fromCurrency, toCurrency, amount, balances ���°� ����� ������ ȣ��
  }, [fromCurrency, toCurrency, amount, balances]); // ������ �迭�� �ʿ��� ���� �߰�

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
                      onChange={(e) => handleAmountChange(Number(e.target.value))} // �ݾ� ���� �� ó��
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
                      <span>Balance: {balances[fromCurrency]}</span> {/* ���� ���õ� ��ȭ�� �ܾ� ǥ�� */}
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
                        ? ((amount * prices[fromCurrency]) / prices[toCurrency]).toFixed(2) // ���� You receive �ݾ�
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
                      <span>Balance: {balances[toCurrency]}</span> {/* ���� ���õ� "You receive" ��ȭ�� �ܾ� ǥ�� */}
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
              handleFromCurrencyChange(token); // "You pay" ��ȭ ����
            } else {
              handleToCurrencyChange(token); // "You receive" ��ȭ ����
            }
            setIsTokenSelectorOpen(null); // ��� �ݱ�
          }}
          onClose={() => setIsTokenSelectorOpen(null)} // ��� �ݱ�
        />
      )}
    </>
  );
};

export { Main as default };
