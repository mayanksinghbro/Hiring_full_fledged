export function LoadingSpinner({ text = 'Analyzing...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-6 fade-in-up">
            {/* Animated AI brain */}
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse" />
                </div>
            </div>
            <div className="text-center">
                <p className="text-lg font-semibold text-slate-200">{text}</p>
                <p className="text-sm text-slate-500 mt-1">AI is processing your data...</p>
            </div>
            {/* Animated dots */}
            <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="h-2 w-2 rounded-full bg-indigo-500"
                        style={{
                            animation: 'bounce 1.4s ease-in-out infinite',
                            animationDelay: `${i * 0.2}s`,
                        }}
                    />
                ))}
            </div>
            <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
}

export function SkeletonLoader({ rows = 5 }) {
    return (
        <div className="space-y-3 py-4">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                    <div className="h-10 w-10 rounded-lg shimmer" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 rounded shimmer" style={{ width: `${70 + Math.random() * 30}%` }} />
                        <div className="h-3 rounded shimmer" style={{ width: `${40 + Math.random() * 30}%` }} />
                    </div>
                </div>
            ))}
        </div>
    );
}
