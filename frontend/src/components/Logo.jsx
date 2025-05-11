import { Code2 } from 'lucide-react'
import React from 'react'

// Fix the parameter handling with proper defaults
const Logo = ({ size = 5, className = "" }) => {
    const textSize = Math.max(size * 3, 14); // Ensure minimum readable size
    
    return (
        <div className={`flex gap-1 items-center font-bold ${className}`}>
            <Code2 className={`h-${textSize} w-${textSize} text-red-500 dark:text-red-700`} style={{ height: `${textSize}px`, width: `${textSize}px` }} />
            <span className="text-red-600 dark:text-red-700" style={{ fontSize: `${textSize}px` }}>Sheet</span>
            <span className="text-blue-800 dark:text-blue-600" style={{ fontSize: `${textSize}px` }}>Code</span>
        </div>
    )
}

export default Logo