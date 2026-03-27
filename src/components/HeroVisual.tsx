import React, { useEffect, useRef, useState } from 'react';
import { Check, TrendingUp } from 'lucide-react';

const HeroVisual: React.FC = () => {
    const visualRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [revenue, setRevenue] = useState(0);
    const [orders, setOrders] = useState(0);

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

        if (visualRef.current) {
            observer.observe(visualRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isVisible) {
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
    }, [isVisible]);

    return (
        <div 
            className={`hero-visual reveal ${isVisible ? 'visible' : ''}`} 
            ref={visualRef}
        >
            <div className="dash-mock">
                <div className="dash-bar">
                    <div className="dash-dot r"></div>
                    <div className="dash-dot y"></div>
                    <div className="dash-dot g"></div>
                </div>
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
            <div className="hero-float hf-1">
                <div className="hf-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                    <Check size={16} />
                </div> 
                FDA Approved
            </div>
            <div className="hero-float hf-2">
                <div className="hf-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                    <TrendingUp size={16} />
                </div> 
                Revenue +42%
            </div>
        </div>
    );
};

export default HeroVisual;
