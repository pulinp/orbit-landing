import React, { useEffect, useRef, useState } from "react";
import {
    ShieldCheck,
    MessageSquare,
    Truck,
    ShoppingCart,
    ChartColumn,
    Globe,
    Layers,
    GitBranch,
    Database,
    Lock
} from "lucide-react";
import "./ArchitectureNodeGraph.css";

type NodeType = "central" | "peripheral";

interface Attribute {
    icon?: React.ElementType;
    label: string;
}

interface NodeData {
    id: string;
    type: NodeType;
    title: string;
    icon: React.ElementType;
    badge: string;
    attributes: Attribute[];
    color: string; // Hex for the accent color
}

const nodes: NodeData[] = [
    {
        id: "ops",
        type: "central",
        title: "Operations Control Tower",
        icon: Layers,
        badge: "Core",
        color: "#1ab394", // Teal
        attributes: [
            { icon: GitBranch, label: "Orchestration Engine" },
            { icon: Database, label: "Unified Data Layer" },
            { icon: Lock, label: "Role-Based Access" }
        ]
    },
    {
        id: "mia",
        type: "peripheral",
        title: "Market Intelligence",
        icon: ChartColumn,
        badge: "Module",
        color: "#6366f1", // Indigo
        attributes: [
            { label: "Demand Forecasting" },
            { label: "Competitor Analysis" },
            { label: "Price Optimization" }
        ]
    },
    {
        id: "cia",
        type: "peripheral",
        title: "Compliance",
        icon: ShieldCheck,
        badge: "Module",
        color: "#ec4899", // Pink
        attributes: [
            { label: "Regulatory Monitoring" },
            { label: "Risk Detection" },
            { label: "Document Validation" }
        ]
    },
    {
        id: "ecom",
        type: "peripheral",
        title: "E-Commerce",
        icon: ShoppingCart,
        badge: "Module",
        color: "#f59e0b", // Amber
        attributes: [
            { label: "Catalog Sync" },
            { label: "Channel Management" },
            { label: "SEO Automation" }
        ]
    },
    {
        id: "mkt",
        type: "peripheral",
        title: "Marketing",
        icon: Globe,
        badge: "Module",
        color: "#8b5cf6", // Violet
        attributes: [
            { label: "Ad Spend Optimization" },
            { label: "Campaign Analytics" },
            { label: "Audience Segmentation" }
        ]
    },
    {
        id: "log",
        type: "peripheral",
        title: "Logistics",
        icon: Truck,
        badge: "Module",
        color: "#10b981", // Emerald
        attributes: [
            { label: "Smart Routing" },
            { label: "Carrier Selection" },
            { label: "Freight Audit" }
        ]
    },
    {
        id: "sup",
        type: "peripheral",
        title: "Support",
        icon: MessageSquare,
        badge: "Module",
        color: "#3b82f6", // Blue
        attributes: [
            { label: "Ticket Routing" },
            { label: "Sentiment Analysis" },
            { label: "Auto-Responses" }
        ]
    }
];

export default function ArchitectureNodeGraph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number }>>(new Map());
    // Trigger re-render for line drawing on resize
    const [, setDimensions] = useState({ width: 0, height: 0 });

    const updatePositions = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();

        const newPositions = new Map<string, { x: number; y: number }>();

        nodes.forEach(node => {
            const el = document.getElementById(`node-${node.id}`);
            if (el) {
                const rect = el.getBoundingClientRect();
                // Calculate center relative to container
                newPositions.set(node.id, {
                    x: (rect.left - containerRect.left) + rect.width / 2,
                    y: (rect.top - containerRect.top) + rect.height / 2
                });
            }
        });

        setNodePositions(newPositions);
        setDimensions({ width: containerRect.width, height: containerRect.height });
    };

    // Update positions on mount and resize
    useEffect(() => {
        updatePositions();
        window.addEventListener('resize', updatePositions);
        // Initial delay to ensure DOM is painted
        setTimeout(updatePositions, 100);
        return () => window.removeEventListener('resize', updatePositions);
    }, []);

    const centralNode = nodes.find(n => n.type === "central");
    const centralPos = centralNode ? nodePositions.get(centralNode.id) : null;

    // Split peripheral nodes into left and right groups for the layout
    const peripheralNodes = nodes.filter(n => n.type === "peripheral");
    const leftNodes = peripheralNodes.slice(0, 3);
    const rightNodes = peripheralNodes.slice(3, 6);

    return (
        <div className="ang-container" ref={containerRef}>
            {/* SVG Layer for Connections */}
            <svg className="ang-connections">
                {centralPos && nodes.filter(n => n.type === "peripheral").map((node, index) => {
                    const pos = nodePositions.get(node.id);
                    if (!pos) return null;

                    // Determine if node is on the left or right side based on index
                    // peripheralNodes array indices: 0-2 are Left, 3-5 are Right
                    const isLeft = index < 3;

                    // OPS Node width is approx 300px (from CSS min-width/width)
                    // But we can approximate handles from centers
                    // Center X is roughly centralPos.x
                    // Left Handle X approx centralPos.x - 140
                    // Right Handle X approx centralPos.x + 140
                    // Node width is approx 250-280px. Half width ~125-140.

                    const opsHalfWidth = 140; // Approx half width of central card
                    const nodeHalfWidth = 125; // Approx half width of peripheral card

                    // Calculate Start and End points
                    // If Left Node: Connect from Node Right -> OPS Left
                    // If Right Node: Connect from Node Left -> OPS Right

                    const startX = isLeft ? pos.x + nodeHalfWidth : pos.x - nodeHalfWidth;
                    const endX = isLeft ? centralPos.x - opsHalfWidth : centralPos.x + opsHalfWidth;

                    const startY = pos.y;
                    const endY = centralPos.y;

                    // Control points for smooth horizontal S-curve
                    // CP1 pulls horizontally towards OPS from Start
                    // CP2 pulls horizontally outwards from OPS
                    const tightness = 0.5;
                    const deltaX = Math.abs(endX - startX) * tightness;

                    const cp1x = isLeft ? startX + deltaX : startX - deltaX;
                    const cp2x = isLeft ? endX - deltaX : endX + deltaX;

                    const pathD = `M${startX},${startY} C${cp1x},${startY} ${cp2x},${endY} ${endX},${endY}`;

                    const activeColor = node.color;

                    return (
                        <g key={`link-${node.id}`}>
                            {/* Base grey line */}
                            <path
                                d={pathD}
                                stroke="var(--lp-outline)"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="5,5"
                                opacity="1"
                            />
                            {/* Animated colored pulse */}
                            <path
                                d={pathD}
                                stroke={activeColor}
                                strokeWidth="2"
                                fill="none"
                                className="ang-connection-pulse"
                                style={{
                                    strokeDasharray: '10, 100',
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            />
                            {/* Connection Dots */}
                            <circle cx={startX} cy={startY} r="3" fill="var(--lp-outline)" />
                            <circle cx={endX} cy={endY} r="3" fill="var(--lp-outline)" />
                        </g>
                    );
                })}
            </svg>

            {/* Nodes Grid: 3 Columns (Left, Center, Right) */}
            <div className="ang-layout">

                {/* Left Column */}
                <div className="ang-col ang-col-side">
                    {leftNodes.map(node => (
                        <NodeCard key={node.id} node={node} />
                    ))}
                </div>

                {/* Center Column */}
                <div className="ang-col ang-col-center">
                    {centralNode && <NodeCard node={centralNode} />}
                </div>

                {/* Right Column */}
                <div className="ang-col ang-col-side">
                    {rightNodes.map(node => (
                        <NodeCard key={node.id} node={node} />
                    ))}
                </div>

            </div>
        </div>
    );
}

function NodeCard({ node }: { node: NodeData }) {
    const Icon = node.icon;
    return (
        <div
            id={`node-${node.id}`}
            className={`ang-card ${node.type}`}
            style={{ "--accent-color": node.color } as React.CSSProperties}
        >
            <div className="ang-card-header">
                <div className="ang-icon-wrapper">
                    <Icon size={20} />
                </div>
                <span className="ang-card-title">{node.title}</span>
                <span className="ang-badge">{node.badge}</span>
            </div>
            <div className="ang-card-body">
                {node.attributes.map((attr, i) => (
                    <div key={i} className="ang-attribute">
                        {attr.icon && <attr.icon size={14} className="ang-attr-icon" />}
                        {attr.icon ? null : <span className="ang-attr-bullet">+</span>}
                        <span>{attr.label}</span>
                    </div>
                ))}
            </div>
            {/* Connection handle points */}
            <div className="ang-handle ang-handle-left"></div>
            <div className="ang-handle ang-handle-right"></div>
            <div className="ang-handle ang-handle-top"></div>
            <div className="ang-handle ang-handle-bottom"></div>
        </div>
    );
}
