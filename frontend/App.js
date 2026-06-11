import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, ScrollView, Animated, Dimensions, Platform, Modal, useWindowDimensions } from 'react-native';

// 📦 Google AdMob Mobile Ads SDK Imports
import { BannerAd, BannerAdSize, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

// ==========================================
// 🎯 PRODUCTION ADMOB UNIQUE IDENTIFIERS BINDING
// ==========================================
const bannerAdUnitId = 'ca-app-pub-2499469286718451/7612457788';
const interstitialAdUnitId = 'ca-app-pub-2499469286718451/7302342303';

// Create a static global instance for Interstitial Ads
const interstitialInstance = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

// ==========================================
// ⚡ XAUCORE PRO SECURE TRADING INTERFACE
// ==========================================
export default function App() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;

  const [currentTab, setCurrentTab] = useState('Home'); 
  const [wallet, setWallet] = useState({ balance: 10000.00, equity: 10000.00, floating_pnl: 0.00 });
  const [activeTrades, setActiveTrades] = useState([]);
  
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD'); 
  const [lotSize, setLotSize] = useState(1);
  const [fundInput, setFundInput] = useState('');
  const [tradeType, setTradeType] = useState('BUY'); 
  const [showAssetSelector, setShowAssetSelector] = useState(false);

  // 100% Stable Base Prices Index Array
  const [marketPrices, setMarketPrices] = useState({
    XAUUSD: { price: 2315.45, change: -0.34 },
    BTCUSD: { price: 67240.10, change: 1.45 },
    NAS100: { price: 19420.50, change: -0.12 },
    JPN225ft: { price: 38920.00, change: 0.22 }
  });

  const [infoModal, setInfoModal] = useState({ visible: false, title: '', content: '' });

  // 📡 MONETIZATION EFFECT: BACKGROUND PRE-LOADING ENGINE
  useEffect(() => {
    const unsubscribeLoaded = interstitialInstance.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('🤖 AdMob Interstitial Asset Loaded & Buffered.');
      }
    );

    const unsubscribeClosed = interstitialInstance.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('🔄 Interstitial Dismissed. Re-buffering next slot...');
        interstitialInstance.load(); // Reload instantly for next interaction trigger
      }
    );

    // Initial trigger to fetch active ad bundle
    interstitialInstance.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  // 📈 LIVE REAL-TIME FEED DISPATCHER WITH WEB PROTECTION
  useEffect(() => {
    const marketInterval = setInterval(() => {
      setMarketPrices(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(symbol => {
          const tickDirection = Math.random() > 0.48 ? 1 : -1;
          const pipSize = symbol === 'XAUUSD' ? 0.25 : symbol === 'BTCUSD' ? 12.50 : 2.10;
          const volatilityDelta = (Math.random() * pipSize) * tickDirection;
          
          const currentPrice = updated[symbol]?.price || 100;
          const currentChange = updated[symbol]?.change || 0;

          updated[symbol] = {
            price: parseFloat((currentPrice + volatilityDelta).toFixed(2)),
            change: parseFloat((currentChange + (volatilityDelta * 0.0005)).toFixed(2))
          };
        });
        return updated;
      });
    }, 800); 

    return () => clearInterval(marketInterval);
  }, []);

  // Secure Floating Equity Engine
  useEffect(() => {
    if (activeTrades.length === 0) {
      setWallet(prev => ({ ...prev, floating_pnl: 0.00, equity: prev.balance }));
      return;
    }
    
    let totalPnl = 0;
    activeTrades.forEach(trade => {
      const currentPrice = marketPrices[trade.symbol]?.price || trade.price_open;
      const priceDifference = trade.type === 'BUY' 
        ? currentPrice - trade.price_open 
        : trade.price_open - currentPrice;
      
      const contractMultiplier = trade.symbol === 'XAUUSD' ? 100 : trade.symbol === 'BTCUSD' ? 1 : 10;
      totalPnl += priceDifference * trade.volume * contractMultiplier;
    });

    setWallet(prev => ({
      ...prev,
      floating_pnl: parseFloat(totalPnl.toFixed(2)),
      equity: parseFloat((prev.balance + totalPnl).toFixed(2))
    }));
  }, [marketPrices, activeTrades]);

  // Overlay Modal Core Handler
  const triggerAppAlert = (title, message) => {
    setInfoModal({ visible: true, title, content: message });
  };

  // Safe Transaction Sandbox Executions
  const executeDeposit = () => {
    const amount = parseFloat(fundInput);
    if (isNaN(amount) || amount <= 0) {
      triggerAppAlert("Error", "Please enter a valid numeric transaction amount.");
      return;
    }
    setWallet(prev => {
      const nextBalance = prev.balance + amount;
      return { ...prev, balance: nextBalance, equity: nextBalance + prev.floating_pnl };
    });
    setFundInput('');
    triggerAppAlert("Success", `$${amount} has been safely credited to your account balance.`);
  };

  const executeWithdrawal = () => {
    const amount = parseFloat(fundInput);
    if (isNaN(amount) || amount <= 0) {
      triggerAppAlert("Error", "Please enter a valid numeric transaction amount.");
      return;
    }
    if (amount > wallet.balance) {
      triggerAppAlert("Declined", "Insufficient free liquidity available for this extraction.");
      return;
    }
    setWallet(prev => {
      const nextBalance = prev.balance - amount;
      return { ...prev, balance: nextBalance, equity: nextBalance + prev.floating_pnl };
    });
    setFundInput('');
    triggerAppAlert("Success", `$${amount} has been successfully debited from your ledger.`);
  };

  const resetWholeLedger = () => {
    setWallet({ balance: 10000.00, equity: 10000.00, floating_pnl: 0.00 });
    setActiveTrades([]);
    setFundInput('');
    triggerAppAlert("Ledger Reconfigured", "Account thresholds cleanly restored to base $10,000.00 parameters.");
  };

  const executeLiveOrder = () => {
    const currentPrice = marketPrices[selectedSymbol]?.price || 0;
    const newTrade = {
      ticket: Math.floor(100000 + Math.random() * 900000),
      symbol: selectedSymbol,
      type: tradeType,
      volume: lotSize,
      price_open: currentPrice
    };
    setActiveTrades(prev => [newTrade, ...prev]);
    triggerAppAlert("Order Placed", `Market ${tradeType} contract initialized for ${lotSize} standard lots of ${selectedSymbol} at $${currentPrice}.`);
  };

  // 🚀 LIQUIDATION TRIGGER INTERSTITIAL IMPLEMENTATION
  const liquidateTrade = (ticket) => {
    setActiveTrades(prev => prev.filter(t => t.ticket !== ticket));
    
    // Check if background ad buffer is ready, then stream full screen ad overlay instantly
    if (interstitialInstance.isLoaded) {
      interstitialInstance.show();
    } else {
      console.log('Ad processing delayed or network request missed.');
      triggerAppAlert("Liquidation Success", "Target position successfully cleared from open risk tables.");
    }
  };

  const processGridFeature = (feature) => {
    const featureData = {
      Promotion: { title: "🎯 Dynamic Campaigns", content: "Active Pool: Execute 15 standard lots on Gold arrays before Friday settlement to unlock premium zero-spread accounts." },
      News: { title: "📰 Financial Terminal Feed", content: "Breaking: Spot Gold fluctuations observed ahead of central bank quantitative updates. Tech indices maintain tight resistance grids." },
      Calendar: { title: "📅 Economic Impact Events", content: "High Impact Scheduled Today:\n• US Core Retail Sales (MoM)\n• Core CPI Data Index \nValidate margin thresholds before market hours." },
      Webinar: { title: "📹 Broadcaster Masterclass", content: "Live tape streaming starting in 25 minutes. Deep dive exploration into liquidity pockets and matrix voids." }
    };
    if (featureData[feature]) {
      triggerAppAlert(featureData[feature].title, featureData[feature].content);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Main Framework Viewport Guard */}
      <View style={{ flex: 1, maxWidth: isLandscape ? '92%' : '100%', alignSelf: 'center', width: '100%' }}>
        
        {/* Navigation Head */}
        <View style={styles.topHeaderNav}>
          <Text style={styles.topHeaderBrand}>XauCore Pro</Text>
          <View style={styles.topHeaderRightIcons}>
            <TouchableOpacity style={styles.headerTouchArea} onPress={() => triggerAppAlert("Search Matrix", "Asset scanning array is completely operational.")}>
              <Text style={styles.iconPlaceholder}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerTouchArea} onPress={() => triggerAppAlert("Support Desk", "Initializing 1-on-1 connection to trade support network server...")}>
              <Text style={styles.iconPlaceholder}>💬</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content View with padding injection to prevent bottom overlapping */}
        <ScrollView style={styles.mainScrollContext} contentContainerStyle={{ paddingBottom: 160 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          
          {/* ==========================================
              TAB 1: HOME
             ========================================== */}
          {currentTab === 'Home' && (
            <View style={styles.tabContentContainer}>
              <View style={styles.vAccountSummaryCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vCardMetaLabel}>Total Value 👁️</Text>
                  <Text style={[styles.vCardBalanceMain, { fontSize: windowWidth < 360 ? 24 : 28 }]}>
                    ${wallet.equity.toFixed(2)} <Text style={styles.vUsdTag}>USD ▾</Text>
                  </Text>
                  <Text style={styles.vCardPnlRow}>Today's Real PnL <Text style={{ color: wallet.floating_pnl >= 0 ? '#00b0ff' : '#ff5252', fontWeight: 'bold' }}>
                    ${wallet.floating_pnl >= 0 ? '+' : ''}{wallet.floating_pnl.toFixed(2)} USD
                  </Text></Text>
                </View>
                <TouchableOpacity style={styles.vActionDepositBtn} onPress={() => setCurrentTab('Funds')}>
                  <Text style={styles.vActionDepositText}>Deposit</Text>
                </TouchableOpacity>
              </View>

              {/* Functional Feature Quick Grid */}
              <View style={styles.vGridIconPanel}>
                {[
                  { i: '🎯', l: 'Promotion', id: 'Promotion' }, 
                  { i: '📰', l: 'News', id: 'News' }, 
                  { i: '📅', l: 'Calendar', id: 'Calendar' }, 
                  { i: '📹', l: 'Webinar', id: 'Webinar' }
                ].map((item, idx) => (
                  <TouchableOpacity key={idx} style={styles.vGridItem} onPress={() => processGridFeature(item.id)}>
                    <View style={styles.vGridIconBox}><Text style={{ fontSize: 18 }}>{item.i}</Text></View>
                    <Text style={styles.vGridItemLabel} numberOfLines={1}>{item.l}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionHeaderTitle}>Best Overall Strategies</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 4 }}>
                <TouchableOpacity style={styles.strategyCard} onPress={() => triggerAppAlert("Subscription Gate", "Do you want to initialize copy-allocation rules for Master Hong Matrix?")}>
                  <Text style={styles.strategyCardName}>🥇 Master Hong</Text>
                  <Text style={styles.strategyCardSub}>Crypto Account Mirror</Text>
                  <Text style={styles.strategyCardReturnVal}>+130.44%</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.strategyCard} onPress={() => triggerAppAlert("Subscription Gate", "Do you want to sync your balance to XauCore high-frequency robotic pool?")}>
                  <Text style={styles.strategyCardName}>🚀 XauCore HFT</Text>
                  <Text style={styles.strategyCardSub}>Gold Scalping Pool</Text>
                  <Text style={styles.strategyCardReturnVal}>+125.28%</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}

          {/* ==========================================
              TAB 2: MARKETS
             ========================================== */}
          {currentTab === 'Markets' && (
            <View style={styles.tabContentContainer}>
              <Text style={styles.sectionHeaderTitle}>Spotlight Movery (Live Processing)</Text>
              <View style={styles.spotlightContainerCard}>
                {Object.keys(marketPrices).map((symbolKey) => {
                  const assetData = marketPrices[symbolKey] || { price: 0, change: 0 };
                  const isGold = symbolKey === 'XAUUSD';
                  const isBtc = symbolKey === 'BTCUSD';
                  const subLabelText = isGold ? "Spot Bullion" : isBtc ? "Digital Asset" : symbolKey === 'NAS100' ? "US Tech Index" : "Nikkei Future";

                  return (
                    <TouchableOpacity key={symbolKey} style={styles.spotlightAssetRow} onPress={() => { setSelectedSymbol(symbolKey); setCurrentTab('Trade'); }}>
                      <View style={styles.spotlightAssetLeft}>
                        <View style={[styles.assetIconCirc, { backgroundColor: isGold ? '#ffd700' : '#1e293b' }]}>
                          <Text style={{ fontSize: 12 }}>{isGold ? '🏅' : isBtc ? '🪙' : '📊'}</Text>
                        </View>
                        <View>
                          <Text style={styles.assetMainSymbol}>{symbolKey}</Text>
                          <Text style={styles.assetSubLabel}>{subLabelText}</Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.assetPriceValue}>
                          {assetData.price ? assetData.price.toFixed(2) : "0.00"}
                        </Text>
                        <Text style={{ color: assetData.change >= 0 ? '#00e676' : '#ff5252', fontSize: 11, fontWeight: 'bold' }}>
                          {assetData.change >= 0 ? '+' : ''}{assetData.change ? assetData.change.toFixed(2) : "0.00"}%
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* ==========================================
              TAB 3: TRADE
             ========================================== */}
          {currentTab === 'Trade' && (
            <View style={styles.tabContentContainer}>
              <View style={styles.vServerLabelBadgeRow}>
                <View style={styles.vServerBadge}><Text style={styles.vServerText}>Live Account</Text></View>
                <Text style={styles.vDeveloperProfileName}>Aamir Akram <Text style={{ color: '#546e7a' }}>24307273 ▾</Text></Text>
              </View>

              <View style={styles.vExecutionHeaderToggle}>
                <TouchableOpacity style={[styles.vToggleHalf, { backgroundColor: '#ff1744' }, tradeType === 'SELL' && styles.vToggleActiveBorder]} onPress={() => setTradeType('SELL')}>
                  <Text style={styles.vToggleActionText}>SELL MARKET</Text>
                  <Text style={styles.vTogglePriceSub}>{(marketPrices[selectedSymbol]?.price - 0.05).toFixed(2)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.vToggleHalf, { backgroundColor: '#263238' }, tradeType === 'BUY' && styles.vToggleActiveBorder]} onPress={() => setTradeType('BUY')}>
                  <Text style={styles.vToggleActionText}>BUY MARKET</Text>
                  <Text style={styles.vTogglePriceSub}>{(marketPrices[selectedSymbol]?.price + 0.05).toFixed(2)}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.vOrderPanelContainerCard}>
                <TouchableOpacity style={styles.dropdownTriggerRow} onPress={() => setShowAssetSelector(!showAssetSelector)}>
                  <Text style={styles.vActiveOrderSymbolText}>Active Contract: {selectedSymbol} ▾</Text>
                </TouchableOpacity>
                
                {showAssetSelector && (
                  <View style={styles.selectorDropdownContainer}>
                    {Object.keys(marketPrices).map((symKey) => (
                      <TouchableOpacity key={symKey} style={styles.selectorDropItem} onPress={() => { setSelectedSymbol(symKey); setShowAssetSelector(false); }}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{symKey}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                <View style={styles.vLotControlWrapper}>
                  <TouchableOpacity style={styles.vLotMathNode} onPress={() => setLotSize(p => Math.max(1, p - 1))}><Text style={styles.vLotMathText}>-</Text></TouchableOpacity>
                  <View style={{ flex: 1, alignItems: 'center' }}><Text style={styles.vLotLabelHeader}>Volume (Lots)</Text><Text style={styles.vLotMainNumText}>{lotSize}</Text></View>
                  <TouchableOpacity style={styles.vLotMathNode} onPress={() => setLotSize(p => p + 1)}><Text style={styles.vLotMathText}>+</Text></TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.vMainOrderSubmitBtn, { backgroundColor: tradeType === 'BUY' ? '#00e676' : '#ff1744' }]} onPress={executeLiveOrder}>
                  <Text style={styles.vMainOrderSubmitText}>Transmit Live {tradeType} Contract</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionHeaderTitle}>Open Operational Positions ({activeTrades.length})</Text>
              {activeTrades.length === 0 ? <Text style={styles.vNoPositionsText}>No active market exposure running.</Text> : (
                activeTrades.map((t, idx) => {
                  const currentPrice = marketPrices[t.symbol]?.price || t.price_open;
                  const runningPnl = t.type === 'BUY' 
                    ? (currentPrice - t.price_open) * t.volume * (t.symbol === 'XAUUSD' ? 100 : 1)
                    : (t.price_open - currentPrice) * t.volume * (t.symbol === 'XAUUSD' ? 100 : 1);

                  return (
                    <View key={idx} style={styles.vPositionRowItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.vPosSymbolText}>{t.symbol} <Text style={{ fontSize: 11, color: t.type === 'BUY' ? '#00e676' : '#ff5252' }}>{t.type}</Text></Text>
                        <Text style={styles.vPosMetaText}>Lots: {t.volume} | Entry: ${t.price_open.toFixed(2)}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={[styles.vPosProfitText, { color: runningPnl >= 0 ? '#00b0ff' : '#ff5252', marginBottom: 4 }]}>
                          ${runningPnl.toFixed(2)}
                        </Text>
                        <TouchableOpacity style={styles.vPosLiquidateBtn} onPress={() => liquidateTrade(t.ticket)}><Text style={styles.vPosLiquidateText}>LIQUIDATE</Text></TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* ==========================================
              TAB 4: EARN
             ========================================== */}
          {currentTab === 'Earn' && (
            <View style={styles.tabContentContainer}>
              <View style={styles.vEarnHeroCard}>
                <Text style={styles.vEarnHeroTitle}>Earn <Text style={{ color: '#ff6d00' }}>6.37% APR</Text> on USDT Vault</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginVertical: 8 }}>
                  <View style={styles.vEarnBadgeMini}><Text style={styles.vEarnBadgeMiniText}>Flexible Tier</Text></View>
                  <View style={styles.vEarnBadgeMini}><Text style={styles.vEarnBadgeMiniText}>Guaranteed Multiplier</Text></View>
                </View>
                <TouchableOpacity style={styles.vEarnSubscribeBtn} onPress={() => triggerAppAlert("Vault Strategy", "Allocation contract confirmed for yield distribution.")}><Text style={styles.vEarnSubscribeText}>Subscribe</Text></TouchableOpacity>
              </View>

              <Text style={styles.sectionHeaderTitle}>Flexible Capital Savings Pool</Text>
              {[{ c: 'USDT', p: 'Platform Rewards Index', a: '1.37%-6.37%' }, { c: 'USDC', p: 'Stable Asset Vault Allocation', a: '0.94%' }, { c: 'ETH', p: 'Ethereum Liquidity Staking Pool', a: '0.80%' }].map((coin, idx) => (
                <View key={idx} style={styles.vEarnCoinRow}>
                  <View><Text style={styles.vEarnCoinMain}>{coin.c}</Text><Text style={styles.vEarnCoinSub}>{coin.p}</Text></View>
                  <Text style={styles.vEarnCoinAprText}>{coin.a}</Text>
                </View>
              ))}
            </View>
          )}

          {/* ==========================================
              TAB 5: FUNDS
             ========================================== */}
          {currentTab === 'Funds' && (
            <View style={styles.tabContentContainer}>
              <View style={styles.vAccountSummaryCard}>
                <View>
                  <Text style={styles.vCardMetaLabel}>Total Asset Balance (Ledger)</Text>
                  <Text style={styles.vCardBalanceMain}>${wallet.balance.toFixed(2)} <Text style={styles.vUsdTag}>USD</Text></Text>
                </View>
              </View>

              <View style={styles.vFundsActionGridRow}>
                <TouchableOpacity style={styles.vFundsActionBtn} onPress={executeWithdrawal}><Text style={styles.vFundsActionBtnText}>Transfer</Text></TouchableOpacity>
                <TouchableOpacity style={styles.vFundsActionBtn} onPress={executeWithdrawal}><Text style={styles.vFundsActionBtnText}>Withdraw</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.vFundsActionBtn, { backgroundColor: '#ff6d00' }]} onPress={executeDeposit}><Text style={[styles.vFundsActionBtnText, { color: '#fff' }]}>Deposit</Text></TouchableOpacity>
              </View>

              <View style={styles.panelCard}>
                <Text style={styles.panelTitle}>⚙️ Simulator Capital Sandbox Configuration</Text>
                <TextInput style={styles.input} placeholder="Enter Amount ($)" placeholderTextColor="#455a64" value={fundInput} onChangeText={setFundInput} keyboardType="numeric" />
                
                <TouchableOpacity style={styles.vResetSubmitBtn} onPress={resetWholeLedger}>
                  <Text style={styles.vMainOrderSubmitText}>RESET LEDGER THRESHOLD TO $10,000</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </ScrollView>

        {/* 📦 PERSISTENT ADMOB ADAPTIVE BANNER POSITION CONTAINER */}
        <View style={styles.admobFixedBannerWrapper}>
          <BannerAd
            unitId={bannerAdUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        </View>

        {/* 🗺️ Dynamic Sticky Navigation Bottom Bar */}
        <View style={styles.vTabBarContainer}>
          {['Home', 'Markets', 'Trade', 'Earn', 'Funds'].map((tab) => (
            <TouchableOpacity key={tab} style={[styles.vTabItemNode, currentTab === tab && styles.vTabItemNodeActive]} onPress={() => setCurrentTab(tab)}>
              <Text style={[styles.vTabIconText, currentTab === tab && { color: '#ff6d00' }]}>
                {tab === 'Home' ? '🏠' : tab === 'Markets' ? '📊' : tab === 'Trade' ? '🔄' : tab === 'Earn' ? '💰' : '💼'}
              </Text>
              <Text style={[styles.vTabLabelText, currentTab === tab && { color: '#ff6d00', fontWeight: 'bold' }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Pop-up Overlay Sheets Box */}
      <Modal animationType="fade" transparent={true} visible={infoModal.visible} onRequestClose={() => setInfoModal({ visible: false, title: '', content: '' })}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContentCard}>
            <Text style={styles.modalTitleText}>{infoModal.title}</Text>
            <Text style={styles.modalBodyText}>{infoModal.content}</Text>
            <TouchableOpacity style={styles.modalCloseButtonNode} onPress={() => setInfoModal({ visible: false, title: '', content: '' })}>
              <Text style={styles.modalCloseButtonText}>Dismiss Information</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

// ==========================================
// 🎨 RESPONSIVE STRUCTURE STYLESHEET
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050708' },
  tabContentContainer: { flex: 1, width: '100%' },

  topHeaderNav: { height: 55, borderBottomWidth: 0.5, borderColor: '#11161a', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#080c0e' },
  topHeaderBrand: { color: '#ffffff', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  topHeaderRightIcons: { flexDirection: 'row', gap: 6 },
  headerTouchArea: { padding: 10 },
  iconPlaceholder: { color: '#fff', fontSize: 16 },

  mainScrollContext: { flex: 1, paddingHorizontal: 14, paddingTop: 12 },

  vAccountSummaryCard: { backgroundColor: '#0b1013', padding: 16, borderRadius: 12, borderWidth: 0.5, borderColor: '#182227', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  vCardMetaLabel: { color: '#78909c', fontSize: 11, fontWeight: '500' },
  vCardBalanceMain: { color: '#ffffff', fontWeight: 'bold', marginTop: 4, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  vUsdTag: { fontSize: 13, color: '#90a4ae', fontWeight: 'normal' },
  vCardPnlRow: { color: '#90a4ae', fontSize: 12, marginTop: 4 },
  vActionDepositBtn: { backgroundColor: '#ff6d00', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20, marginLeft: 8 },
  vActionDepositText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },

  vGridIconPanel: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginVertical: 8, backgroundColor: '#0b1013', padding: 12, borderRadius: 12, gap: 4 },
  vGridItem: { alignItems: 'center', width: '22%', minWidth: 60, paddingVertical: 4 },
  vGridIconBox: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#141c20', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  vGridItemLabel: { color: '#90a4ae', fontSize: 11, fontWeight: '500', width: '100%', textAlign: 'center' },

  sectionHeaderTitle: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', marginTop: 12, marginBottom: 8, letterSpacing: 0.3 },
  strategyCard: { backgroundColor: '#0b1013', padding: 12, borderRadius: 10, borderWidth: 0.5, borderColor: '#182227', marginRight: 10, width: 145 },
  strategyCardName: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  strategyCardSub: { color: '#546e7a', fontSize: 10, marginTop: 2 },
  strategyCardReturnVal: { color: '#00e676', fontSize: 15, fontWeight: 'bold', marginTop: 8 },

  spotlightContainerCard: { backgroundColor: '#0b1013', borderRadius: 12, borderWidth: 0.5, borderColor: '#182227', paddingVertical: 2, marginBottom: 10 },
  spotlightAssetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 0.5, borderBottomColor: '#141c20' },
  spotlightAssetLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  assetIconCirc: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  assetMainSymbol: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  assetSubLabel: { color: '#546e7a', fontSize: 11 },
  assetPriceValue: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },

  vServerLabelBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  vServerBadge: { backgroundColor: '#ff6d00', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4 },
  vServerText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  vDeveloperProfileName: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  vExecutionHeaderToggle: { flexDirection: 'row', borderRadius: 8, overflow: 'hidden', backgroundColor: '#141c20', marginBottom: 12 },
  vToggleHalf: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  vToggleActiveBorder: { borderWidth: 1.5, borderColor: '#ffffff' },
  vToggleActionText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  vTogglePriceSub: { color: '#e0e0e0', fontSize: 12, marginTop: 2, fontFamily: 'monospace' },

  vOrderPanelContainerCard: { backgroundColor: '#0b1013', padding: 14, borderRadius: 12, borderWidth: 0.5, borderColor: '#182227', marginBottom: 12 },
  dropdownTriggerRow: { paddingVertical: 4, marginBottom: 6, alignItems: 'center' },
  vActiveOrderSymbolText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  selectorDropdownContainer: { backgroundColor: '#141c20', borderRadius: 8, borderWidth: 0.5, borderColor: '#23323a', padding: 2, marginBottom: 10 },
  selectorDropItem: { padding: 10, borderBottomWidth: 0.5, borderBottomColor: '#1c282f' },

  vLotControlWrapper: { flexDirection: 'row', backgroundColor: '#050708', borderRadius: 8, padding: 4, alignItems: 'center', borderWidth: 0.5, borderColor: '#1c282f', marginBottom: 12 },
  vLotMathNode: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  vLotMathText: { color: '#ff6d00', fontSize: 20, fontWeight: 'bold' },
  vLotLabelHeader: { color: '#546e7a', fontSize: 10, fontWeight: 'bold' },
  vLotMainNumText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  vMainOrderSubmitBtn: { paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', width: '100%' },
  vMainOrderSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },

  vNoPositionsText: { color: '#546e7a', fontSize: 12, paddingVertical: 8, fontStyle: 'italic' },
  vPositionRowItem: { backgroundColor: '#0b1013', padding: 12, borderRadius: 10, borderLeftWidth: 3, borderLeftColor: '#ff6d00', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 8 },
  vPosSymbolText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  vPosMetaText: { color: '#78909c', fontSize: 11, marginTop: 1 },
  vPosProfitText: { fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' },
  vPosLiquidateBtn: { backgroundColor: '#141c20', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, borderWidth: 0.5, borderColor: '#23323a' },
  vPosLiquidateText: { color: '#ff5252', fontSize: 10, fontWeight: 'bold' },

  vEarnHeroCard: { backgroundColor: '#11181c', padding: 16, borderRadius: 12, borderWidth: 0.5, borderColor: '#223038', marginBottom: 12 },
  vEarnHeroTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  vEarnBadgeMini: { backgroundColor: '#1c2930', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4 },
  vEarnBadgeMiniText: { color: '#ff6d00', fontSize: 10, fontWeight: 'bold' },
  vEarnSubscribeBtn: { backgroundColor: '#ffffff', paddingVertical: 8, borderRadius: 20, alignItems: 'center', marginTop: 8 },
  vEarnSubscribeText: { color: '#000', fontWeight: 'bold', fontSize: 11 },
  vEarnCoinRow: { backgroundColor: '#0b1013', padding: 12, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  vEarnCoinMain: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  vEarnCoinSub: { color: '#546e7a', fontSize: 11 },
  vEarnCoinAprText: { color: '#00e676', fontWeight: 'bold', fontSize: 13 },

  vFundsActionGridRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  vFundsActionBtn: { flex: 1, backgroundColor: '#141c20', paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#23323a' },
  vFundsActionBtnText: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },

  panelCard: { backgroundColor: '#0b1013', padding: 12, borderRadius: 10, borderWidth: 0.5, borderColor: '#182227' },
  panelTitle: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: '#050708', color: '#fff', padding: 10, borderRadius: 6, marginBottom: 12, fontSize: 13, borderWidth: 0.5, borderColor: '#1c282f' },
  vResetSubmitBtn: { paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#211210', borderWidth: 0.5, borderColor: '#ff1744' },

  // AdMob Banner Container Interface Styling
  admobFixedBannerWrapper: { position: 'absolute', bottom: 56, left: 0, right: 0, height: 50, backgroundColor: '#050708', justifyContent: 'center', alignItems: 'center', zIndex: 998, borderTopWidth: 0.5, borderTopColor: '#141c20' },

  vTabBarContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, backgroundColor: '#080c0e', borderTopWidth: 0.5, borderColor: '#141c20', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', zIndex: 999 },
  vTabItemNode: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  vTabItemNodeActive: { borderTopWidth: 2, borderColor: '#ff6d00' },
  vTabIconText: { fontSize: 14, color: '#546e7a' },
  vTabLabelText: { color: '#546e7a', fontSize: 9, marginTop: 2 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContentCard: { backgroundColor: '#0b1013', width: '100%', maxWidth: 340, borderRadius: 12, borderWidth: 0.5, borderColor: '#1c282f', padding: 16 },
  modalTitleText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginBottom: 10 },
  modalBodyText: { color: '#90a4ae', fontSize: 13, lineHeight: 18, marginBottom: 16 },
  modalCloseButtonNode: { backgroundColor: '#ff6d00', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  modalCloseButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 }
});