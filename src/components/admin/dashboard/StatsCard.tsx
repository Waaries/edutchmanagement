
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  description: string;
  value: number | null;
  loading: boolean;
  colorClass?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  description,
  value,
  loading,
  colorClass = "text-primary"
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-10 w-20" />
        ) : (
          <p className={`text-4xl font-bold ${colorClass}`}>{value || 0}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
