import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BarChartComponent = ({
  stats,
}: {
  stats: Array<{ name: string; broj: number }>;
}) => {
  const xTick = (props) => {
    const { x, y, payload } = props;

    return (
      <text x={x} y={y} dy={16} textAnchor="middle" fill="#FFFFFF">
        {payload.value}
      </text>
    );
  };

  const yTick = (props) => {
    const { x, y, payload } = props;

    return (
      <text x={x} y={y} dx={-8} dy={5} textAnchor="middle" fill="#FFFFFF">
        {payload.value}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={stats}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid horizontal={true} vertical={false} />
        <XAxis dataKey="name" tick={xTick} />
        <YAxis tick={yTick} />
        <Bar dataKey="broj" fill="#0059b3" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
