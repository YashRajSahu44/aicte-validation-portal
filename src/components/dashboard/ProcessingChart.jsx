import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
export default function ProcessingChart({ data, height = 280 }) {
  return (
    <div role="img" aria-label="Bar chart of applications received, processed and pending by month (simulated data)">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DCE2E8" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#667085' }} />
          <YAxis tick={{ fontSize: 12, fill: '#667085' }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Processed" stackId="a" fill="#123B63" />
          <Bar dataKey="Pending" stackId="a" fill="#E89B32" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
