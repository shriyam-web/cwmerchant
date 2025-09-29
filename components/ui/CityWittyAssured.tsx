"use client";
import React from "react";

export default function CityWittyAssured() {
    return (
        <div className="flex justify-center items-center">
            <svg
                className="badge-button"
                viewBox="0 0 200 60"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-labelledby="btnTitle btnDesc"
                style={{ width: "auto", minWidth: "110px", height: "30px" }}
            >
                <title id="btnTitle">CityWitty Assured</title>
                <desc id="btnDesc">Premium CityWitty assured button with green style</desc>

                <defs>
                    {/* Green gradient background */}
                    <linearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="50%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#047857" />
                    </linearGradient>

                    {/* Shine gradient */}
                    <linearGradient id="shineGrad" x1="0" x2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>

                    {/* Checkmark */}
                    <symbol id="checkSymbol" viewBox="0 0 24 24">
                        <path
                            d="M20 6L9 17l-5-5"
                            stroke="#fff"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </symbol>
                </defs>

                <g>
                    {/* Background */}
                    <rect
                        x="0"
                        y="0"
                        width="200"
                        height="60"
                        rx="30"
                        fill="url(#btnGrad)"
                        className="badge-bg"
                        style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.25))" }}
                    />

                    {/* Circular check */}
                    <g transform="translate(15,12)">
                        <circle
                            cx="18"
                            cy="18"
                            r="18"
                            fill="#22C55E"
                            className="tickCircle"
                            style={{ filter: "drop-shadow(0 0 6px rgba(34,197,94,0.8))" }}
                        />
                        <use href="#checkSymbol" x="10" y="10" width="16" height="16" />
                    </g>

                    {/* Text */}
                    <g transform="translate(65,30)">
                        <text
                            x="0"
                            y="0"
                            fontSize="15"
                            fill="#fff"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 800,
                                pointerEvents: "none",
                                textShadow: "0 1px 2px rgba(0,0,0,0.25)",
                            }}
                        >
                            CityWitty
                        </text>
                        <text
                            x="0"
                            y="20"
                            fontSize="18"
                            fill="#fff"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 800,
                                pointerEvents: "none",
                                textShadow: "0 1px 2px rgba(0,0,0,0.25)",
                            }}
                        >
                            Assured
                        </text>
                    </g>

                    {/* Animated shine */}
                    <rect
                        className="shine"
                        x="-200"
                        y="0"
                        width="200"
                        height="60"
                        fill="url(#shineGrad)"
                        style={{
                            mixBlendMode: "screen",
                            borderRadius: "30px",
                            animation: "shine-slide 2.5s ease-in-out infinite",
                        }}
                    />
                </g>

                <style>
                    {`
            @keyframes shine-slide {
              0% { transform: translateX(-200%) rotate(-20deg); opacity: 0; }
              40% { opacity: 0.6; }
              70% { opacity: 0.8; }
              100% { transform: translateX(300%) rotate(-20deg); opacity: 0; }
            }
          `}
                </style>
            </svg>
        </div>
    );
}
