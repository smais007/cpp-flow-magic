
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface FlowchartDisplayProps {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}

const FlowchartDisplay: React.FC<FlowchartDisplayProps> = ({ imageUrl, loading, error }) => {
  return (
    <div className="h-full w-full overflow-auto rounded-md border border-border bg-white p-4">
      {loading ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Skeleton className="h-[200px] w-[80%] rounded-md" />
          <p className="mt-4 animate-pulse-slow text-sm text-muted-foreground">Generating flowchart...</p>
        </div>
      ) : error ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <p className="text-destructive">{error}</p>
        </div>
      ) : imageUrl ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <img src={imageUrl} alt="Generated Flowchart" className="max-h-full max-w-full object-contain" />
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <p className="text-muted-foreground">Enter C++ code and click 'Generate Flowchart' to visualize your logic</p>
        </div>
      )}
    </div>
  );
};

export default FlowchartDisplay;
