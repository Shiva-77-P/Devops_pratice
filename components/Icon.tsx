import React from 'react';
import { Terminal, Box, Ship, Server, CheckCircle, XCircle, ChevronRight, Play, RotateCcw, MessageSquare, Menu } from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = "", size = 20 }) => {
  switch (name) {
    case 'terminal': return <Terminal className={className} size={size} />;
    case 'box': return <Box className={className} size={size} />;
    case 'ship': return <Ship className={className} size={size} />;
    case 'server': return <Server className={className} size={size} />;
    case 'check': return <CheckCircle className={className} size={size} />;
    case 'x': return <XCircle className={className} size={size} />;
    case 'chevron-right': return <ChevronRight className={className} size={size} />;
    case 'play': return <Play className={className} size={size} />;
    case 'reset': return <RotateCcw className={className} size={size} />;
    case 'chat': return <MessageSquare className={className} size={size} />;
    case 'menu': return <Menu className={className} size={size} />;
    default: return <Terminal className={className} size={size} />;
  }
};