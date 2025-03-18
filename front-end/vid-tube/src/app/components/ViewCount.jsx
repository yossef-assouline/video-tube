import { formatCount } from '../utils/formatCount.js';
import { Eye } from 'lucide-react';
export default function ViewCount({ views }) {
  return (
    <div className="flex items-center gap-2">
        <Eye/>
      <span className="text-black font-medium">
        {formatCount(views)} views
      </span>
    </div>
  );
} 