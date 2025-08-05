export const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  barPercentage: 0.5,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForBackgroundLines: {
    strokeDasharray: "",
    strokeWidth: 1,
    stroke: "rgba(0, 0, 0, 0.1)",
  },
  propsForLabels: {
    fontSize: 10,
    rotation: 0,
  },
}; 