import React, { useEffect, useRef, useState } from 'react';
import { Check, TrendingUp, Search, ShieldCheck, Truck, Warehouse, ShoppingCart, Sparkles } from 'lucide-react';

const HeroVisual: React.FC = () => {
    const visualRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    
    // Animation States: 'typing' | 'agents' | 'dashboard'
    const [phase, setPhase] = useState<'typing' | 'agents' | 'dashboard'>('typing');
    const [typedText, setTypedText] = useState('');
    
    // Dashboard States
    const [revenue, setRevenue] = useState(0);
    const [orders, setOrders] = useState(0);

    const fullText = "Help me launch my business in the US";

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        if (visualRef.current) observer.observe(visualRef.current);
        return () => observer.disconnect();
    }, []);

    // Sequence Effect
    useEffect(() => {
        if (!isVisible) return;

        if (phase === 'typing') {
            let i = 0;
            const interval = setInterval(() => {
                setTypedText(fullText.slice(0, i + 1));
                i++;
                if (i >= fullText.length) {
                    clearInterval(interval);
                    setTimeout(() => setPhase('agents'), 800); // switch to agents after 0.8s
                }
            }, 50); // type speed
            return () => clearInterval(interval);
        }

        if (phase === 'agents') {
            const timer = setTimeout(() => {
                setPhase('dashboard');
            }, 3000); // Load for 3 seconds
            return () => clearTimeout(timer);
        }

        if (phase === 'dashboard') {
            // Animate Revenue
            const revTarget = 82400;
            const revDuration = 1500;
            const revStep = Math.ceil(revTarget / (revDuration / 30));
            
            const revTimer = setInterval(() => {
                setRevenue((prev) => {
                    if (prev + revStep >= revTarget) {
                        clearInterval(revTimer);
                        return revTarget;
                    }
                    return prev + revStep;
                });
            }, 30);

            // Animate Orders
            const ordersTarget = 1247;
            const ordersDuration = 1500;
            const ordersStep = Math.ceil(ordersTarget / (ordersDuration / 30));

            const ordersTimer = setInterval(() => {
                setOrders((prev) => {
                    if (prev + ordersStep >= ordersTarget) {
                        clearInterval(ordersTimer);
                        return ordersTarget;
                    }
                    return prev + ordersStep;
                });
            }, 30);

            return () => {
                clearInterval(revTimer);
                clearInterval(ordersTimer);
            };
        }
    }, [isVisible, phase]);

    // Render internal parts based on phase
    return (
        <div 
            className={`hero-visual reveal ${isVisible ? 'visible' : ''}`} 
            ref={visualRef}
        >
            <div className={`dash-mock phase-container ${phase}`}>
                {/* Fixed Mac Window Header */}
                <div className="dash-bar" style={{ marginBottom: phase === 'dashboard' ? '1rem' : '0' }}>
                    <div className="dash-dot r"></div>
                    <div className="dash-dot y"></div>
                    <div className="dash-dot g"></div>
                </div>

                <div className="anim-content-area">
                    {/* PHASE 1: TYPING */}
                    {phase === 'typing' && (
                        <div className="typing-phase">
                            <div className="chat-bubble">
                                <Sparkles size={18} className="chatbot-icon" />
                                <span className="typed-text">{typedText}</span>
                                <span className="cursor blink"></span>
                            </div>
                        </div>
                    )}

                    {/* PHASE 2: AGENTS */}
                    {phase === 'agents' && (
                        <div className="agents-phase">
                            <h3 className="agents-title">Orchestrating AI Agents...</h3>
                            <div className="agents-grid">
                                <div className="agent-card delay-1">
                                    <Search size={20} className="agent-icon" />
                                    <span>Market Intelligence</span>
                                    <div className="spinner"></div>
                                </div>
                                <div className="agent-card delay-2">
                                    <ShieldCheck size={20} className="agent-icon" />
                                    <span>Compliance</span>
                                    <div className="spinner"></div>
                                </div>
                                <div className="agent-card delay-3">
                                    <Truck size={20} className="agent-icon" />
                                    <span>Logistics</span>
                                    <div className="spinner"></div>
                                </div>
                                <div className="agent-card delay-4">
                                    <Warehouse size={20} className="agent-icon" />
                                    <span>Warehousing</span>
                                    <div className="spinner"></div>
                                </div>
                                <div className="agent-card delay-5">
                                    <ShoppingCart size={20} className="agent-icon" />
                                    <span>Marketing &amp; E-commerce</span>
                                    <div className="spinner"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PHASE 3: DASHBOARD */}
                    {phase === 'dashboard' && (
                        <div className="dashboard-phase fade-in">
                            <div className="dash-grid">
                                <div className="dash-card">
                                    <div className="dash-card-label">US Revenue</div>
                                    <div className="dash-card-val green">
                                        ${revenue.toLocaleString()}
                                    </div>
                                    <div className="dash-card-sub">Month 1 • +100%</div>
                                </div>
                                <div className="dash-card">
                                    <div className="dash-card-label">Compliance</div>
                                    <div className="dash-card-val green">100%</div>
                                    <div className="dash-card-bar">
                                        <div className="dash-card-bar-fill" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                                <div className="dash-card">
                                    <div className="dash-card-label">Orders Fulfilled</div>
                                    <div className="dash-card-val">
                                        {orders.toLocaleString()}
                                    </div>
                                    <div className="dash-card-bar">
                                        <div className="dash-card-bar-fill" style={{ width: '78%' }}></div>
                                    </div>
                                </div>
                                <div className="dash-card">
                                    <div className="dash-card-label">Channels Live</div>
                                    <div className="dash-card-val">3 / 3</div>
                                    <div className="dash-card-sub">Amazon • Shopify • DTC</div>
                                </div>
                                <div className="dash-card wide">
                                    <div className="dash-card-label">Weekly Revenue Trend</div>
                                    <div className="dash-chart">
                                        <div className="dash-chart-bar" style={{ height: '20%' }}></div>
                                        <div className="dash-chart-bar" style={{ height: '35%' }}></div>
                                        <div className="dash-chart-bar" style={{ height: '30%' }}></div>
                                        <div className="dash-chart-bar" style={{ height: '50%' }}></div>
                                        <div className="dash-chart-bar" style={{ height: '45%' }}></div>
                                        <div className="dash-chart-bar" style={{ height: '65%' }}></div>
                                        <div className="dash-chart-bar" style={{ height: '60%' }}></div>
                                        <div className="dash-chart-bar" style={{ height: '80%' }}></div>
                                        <div className="dash-chart-bar" style={{ height: '75%' }}></div>
                                        <div className="dash-chart-bar" style={{ height: '95%' }}></div>
                                        <div className="dash-chart-bar" style={{ height: '88%' }}></div>
                                        <div className="dash-chart-bar" style={{ height: '100%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floaters only in dashboard phase */}
            {phase === 'dashboard' && (
                <>
                    <div className="hero-float hf-1 fade-in">
                        <div className="hf-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                            <Check size={16} />
                        </div> 
                        FDA Approved
                    </div>
                    <div className="hero-float hf-2 fade-in">
                        <div className="hf-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                            <TrendingUp size={16} />
                        </div> 
                        Revenue +42%
                    </div>
                </>
            )}
        </div>
    );
};

export default HeroVisual;
