const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center">
                {/* Main Illustration Section */}
                <div className="mb-12 relative">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-96 h-96 bg-gradient-to-br from-red-100 to-pink-100 rounded-full opacity-20 animate-pulse"></div>
                    </div>

                    {/* 404 with Character Illustration */}
                    <div className="relative z-10 flex items-center justify-center">
                        <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl">
                            {/* 404 Text Background */}
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                                </linearGradient>
                                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>

                            {/* First 4 */}
                            <text x="50" y="200" fontSize="180" fontWeight="bold" fill="url(#grad1)" opacity="0.9">4</text>

                            {/* Second 4 */}
                            <text x="450" y="200" fontSize="180" fontWeight="bold" fill="url(#grad1)" opacity="0.9">4</text>

                            {/* Character in the middle (0 position) */}
                            <g transform="translate(250, 80)">
                                {/* Head */}
                                <circle cx="50" cy="40" r="35" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />

                                {/* Hair */}
                                <ellipse cx="50" cy="25" rx="40" ry="20" fill="#374151" />
                                <ellipse cx="35" cy="20" rx="15" ry="12" fill="#374151" />
                                <ellipse cx="65" cy="22" rx="12" ry="10" fill="#374151" />

                                {/* Face */}
                                <circle cx="42" cy="35" r="3" fill="#1f2937" />
                                <circle cx="58" cy="35" r="3" fill="#1f2937" />
                                <path d="M 45 50 Q 50 55 55 50" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />

                                {/* Confused expression lines */}
                                <path d="M 35 25 L 40 30" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
                                <path d="M 60 30 L 65 25" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />

                                {/* Body */}
                                <rect x="30" y="75" width="40" height="60" rx="20" fill="url(#grad2)" />

                                {/* Arms */}
                                <ellipse cx="15" cy="95" rx="12" ry="25" fill="#fbbf24" transform="rotate(-20 15 95)" />
                                <ellipse cx="85" cy="95" rx="12" ry="25" fill="#fbbf24" transform="rotate(20 85 95)" />

                                {/* Hand on forehead gesture */}
                                <circle cx="8" cy="80" r="8" fill="#fbbf24" />
                                <rect x="4" y="76" width="8" height="15" rx="4" fill="#fbbf24" />

                                {/* Legs */}
                                <rect x="38" y="135" width="12" height="40" rx="6" fill="#1e40af" />
                                <rect x="55" y="135" width="12" height="40" rx="6" fill="#1e40af" />

                                {/* Feet */}
                                <ellipse cx="44" cy="180" rx="8" ry="5" fill="#374151" />
                                <ellipse cx="61" cy="180" rx="8" ry="5" fill="#374151" />

                                {/* Question mark bubble */}
                                <g transform="translate(85, 10)">
                                    <ellipse cx="0" cy="0" rx="20" ry="15" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                                    <text x="0" y="8" fontSize="24" fontWeight="bold" fill="#ef4444" textAnchor="middle">?</text>
                                    <polygon points="-15,10 -8,20 -5,15" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                                </g>
                            </g>

                            {/* Floating elements */}
                            <g opacity="0.6">
                                <circle cx="100" cy="100" r="4" fill="#8b5cf6">
                                    <animate attributeName="cy" values="100;90;100" dur="2s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="500" cy="120" r="6" fill="#06b6d4">
                                    <animate attributeName="cy" values="120;110;120" dur="2.5s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="120" cy="300" r="5" fill="#10b981">
                                    <animate attributeName="cy" values="300;290;300" dur="3s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="480" cy="320" r="4" fill="#f59e0b">
                                    <animate attributeName="cy" values="320;310;320" dur="2.2s" repeatCount="indefinite" />
                                </circle>
                            </g>
                        </svg>
                    </div>
                </div>

                {/* Text Content */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        404 Page Not Found
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Oops! Looks like this page got lost in the digital universe.
                        Our confused friend here is just as puzzled as you are!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound