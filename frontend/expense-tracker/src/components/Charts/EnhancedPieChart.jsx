import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { FaPieChart, FaChartDonut } from 'react-icons/fa';

const EnhancedPieChart = ({ 
  data, 
  title = "Category Breakdown", 
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'],
  showTotal = true,
  totalLabel = "Total"
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isDoughnut, setIsDoughnut] = useState(true);

  const total = data?.reduce((sum, entry) => sum + entry.amount, 0) || 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-gray-100 font-medium">{data.name}</p>
          <p className="text-sm" style={{ color: data.payload.fill }}>
            Amount: ₱{data.value.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {((data.value / total) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry, index) => (
          <motion.div
            key={`legend-${index}`}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(-1)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {entry.value}
            </span>
          </motion.div>
        ))}
      </div>
    );
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        
        {/* Chart Style Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDoughnut(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              isDoughnut
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FaChartDonut size={14} />
            <span className="hidden sm:inline">Donut</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDoughnut(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              !isDoughnut
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <FaPieChart size={14} />
            <span className="hidden sm:inline">Pie</span>
          </motion.button>
        </div>
      </div>

      <div className="h-96 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={isDoughnut ? 60 : 0}
              paddingAngle={2}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {data?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  stroke={activeIndex === index ? '#374151' : 'transparent'}
                  strokeWidth={activeIndex === index ? 2 : 0}
                  style={{
                    filter: activeIndex === index ? 'brightness(1.1)' : 'brightness(1)',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            
            {/* Center Text for Donut Chart */}
            {isDoughnut && showTotal && (
              <>
                <text
                  x="50%"
                  y="50%"
                  dy={-8}
                  textAnchor="middle"
                  className="fill-gray-600 dark:fill-gray-400 text-sm"
                >
                  {totalLabel}
                </text>
                <text
                  x="50%"
                  y="50%"
                  dy={16}
                  textAnchor="middle"
                  className="fill-gray-900 dark:fill-gray-100 text-xl font-semibold"
                >
                  ₱{total.toLocaleString()}
                </text>
              </>
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      {data && data.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {data.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                  {item.name}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                ₱{item.amount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {((item.amount / total) * 100).toFixed(1)}%
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedPieChart;
