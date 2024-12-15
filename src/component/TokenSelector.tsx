// src/components/TokenSelector.tsx
import React, { useEffect, useState } from 'react';
import { getBalance } from '../services/api';  // getBalance API 호출 함수

interface TokenSelectorProps {
  onSelect: (currency: string) => void;  // 통화 선택 시 부모 컴포넌트로 전달
  onClose: () => void;  // 모달 닫기
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ onSelect, onClose }) => {
  const [tokens, setTokens] = useState<{ [key: string]: number }>({});  // 잔액 데이터 저장
  const [loading, setLoading] = useState<boolean>(true);  // 로딩 상태
  const [error, setError] = useState<string | null>(null);  // 에러 상태

  // 잔액 데이터 가져오기
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const balances = await getBalance();  // API 호출하여 잔액 가져오기
        setTokens(balances);  // 가져온 잔액 데이터 저장
      } catch (err) {
        console.error('Failed to fetch tokens:', err);  // 디버깅을 위한 에러 로그
        setError('Failed to load tokens');  // 사용자에게 표시할 에러 메시지
      } finally {
        setLoading(false);  // 로딩 완료
      }
    };

    fetchBalances();  // 컴포넌트가 마운트될 때 잔액 데이터를 가져옴
  }, []);

  return (
    <section className="layer-wrap">
      <div className="dimmed" onClick={onClose}></div>  {/* 모달 외부 클릭 시 닫기 */}
      <div className="layer-container">
        <header className="layer-header">
          <div className="inner">
            <h3>Select a Token</h3>
            <button type="button" className="button-close" onClick={onClose}>
              <i className="blind">Close</i>
            </button>
          </div>
        </header>
        <div className="layer-content">
          <div className="inner">
            <div className="select-token-wrap">
              <div className="currency-list-wrap">
                {loading ? (  // 로딩 중일 때
                  <p>Loading tokens...</p>
                ) : error ? (  // 에러가 발생한 경우
                  <p className="error">{error}</p>
                ) : (
                  <div className="lists">
                    {/* 잔액 데이터를 받아온 후, 각 토큰을 버튼으로 표시 */}
                    {Object.entries(tokens).map(([token, balance]) => (
                      <button
                        key={token}
                        type="button"
                        className="currency-label"
                        onClick={() => {
                          onSelect(token);  // 선택된 토큰을 부모 컴포넌트로 전달
                          onClose();  // 모달 닫기
                        }}
                      >
                        <div className={`token ${token}`} data-token-size="36"></div>
                        <div className="name">
                          <div className="full">{token}</div>
                          <span>Balance: {balance}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenSelector;
