import { Code2 } from 'lucide-react'
import React from 'react'

type Props = {
    size?: number;
    className?: string;
}

const Logo = ({ size = 5, className = "" }: Props) => {
    const textSize = Math.max(size * 3, 14); // Ensure minimum readable size
    
    return (
        <div className={`flex gap-1 items-center font-bold ${className}`}>
            <Code2 className={`h-${size} w-${size} text-red-500 dark:text-red-700`} style={{ height: `${size}px`, width: `${size}px` }} />
            <span className="text-red-600 dark:text-red-700" style={{ fontSize: `${textSize}px` }}>Sheet</span>
            <span className="text-blue-800 dark:text-blue-600" style={{ fontSize: `${textSize}px` }}>Code</span>
        </div>
    )
}

export default Logo