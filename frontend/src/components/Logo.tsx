import { Code2 } from 'lucide-react'
import React from 'react'


type Props = {
    size?: number
}

const Logo = ({ size = 5 }: Props) => {
    return (
        <div className={`flex gap-1 items-center font-bold`} style={{ fontSize: `${size}px` }}>
                <Code2 className="h-5 w-5 text-red-500 dark:text-red-700" />
                    <span className="text-red-600 dark:text-red-700">Sheet</span>
                    <span className="text-blue-800 dark:text-blue-600">Code</span>
        </div>
    )
}

export default Logo