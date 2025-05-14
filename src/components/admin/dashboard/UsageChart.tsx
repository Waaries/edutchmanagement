
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataItem {
  name: string;
  value: number;
}

interface UsageChartProps {
  data: ChartDataItem[];
  loading: boolean;
}

const UsageChart: React.FC<UsageChartProps> = ({ data, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gebruikersstatistieken</CardTitle>
        <CardDescription>Visueel overzicht van gebruikersdata</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageChart;
