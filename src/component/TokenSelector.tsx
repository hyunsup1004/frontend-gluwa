// src/components/TokenSelector.tsx
import React, { useEffect, useState } from 'react';
import { getBalance } from '../services/api';  // getBalance API ȣ�� �Լ�

interface TokenSelectorProps {
  onSelect: (currency: string) => void;  // ��ȭ ���� �� �θ� ������Ʈ�� ����
  onClose: () => void;  // ��� �ݱ�
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ onSelect, onClose }) => {
  const [tokens, setTokens] = useState<{ [key: string]: number }>({});  // �ܾ� ������ ����
  const [loading, setLoading] = useState<boolean>(true);  // �ε� ����
  const [error, setError] = useState<string | null>(null);  // ���� ����

  // �ܾ� ������ ��������
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const balances = await getBalance();  // API ȣ���Ͽ� �ܾ� ��������
        setTokens(balances);  // ������ �ܾ� ������ ����
      } catch (err) {
        console.error('Failed to fetch tokens:', err);  // ������� ���� ���� �α�
        setError('Failed to load tokens');  // ����ڿ��� ǥ���� ���� �޽���
      } finally {
        setLoading(false);  // �ε� �Ϸ�
      }
    };

    fetchBalances();  // ������Ʈ�� ����Ʈ�� �� �ܾ� �����͸� ������
  }, []);

  return (
    <section className="layer-wrap">
      <div className="dimmed" onClick={onClose}></div>  {/* ��� �ܺ� Ŭ�� �� �ݱ� */}
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
                {loading ? (  // �ε� ���� ��
                  <p>Loading tokens...</p>
                ) : error ? (  // ������ �߻��� ���
                  <p className="error">{error}</p>
                ) : (
                  <div className="lists">
                    {/* �ܾ� �����͸� �޾ƿ� ��, �� ��ū�� ��ư���� ǥ�� */}
                    {Object.entries(tokens).map(([token, balance]) => (
                      <button
                        key={token}
                        type="button"
                        className="currency-label"
                        onClick={() => {
                          onSelect(token);  // ���õ� ��ū�� �θ� ������Ʈ�� ����
                          onClose();  // ��� �ݱ�
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
