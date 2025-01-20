import React from 'react';

const MetricCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded shadow flex items-center gap-4">
    <div className="text-blue-500 text-3xl">{icon}</div>
    <div>
      <h4 className="text-lg font-bold">{title}</h4>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

export default MetricCard;
