import React from 'react';
import { Moon, Sun } from 'lucide-react';

export function ToggleLeft({ isActive, width = 20, height = 20 }) {
  return (
    <div className="relative flex items-center">
      {isActive ? (
        <Moon className="text-blue-600" width={width} height={height} />
      ) : (
        <Sun className="text-yellow-500" width={width} height={height} />
      )}
    </div>
  );
}
