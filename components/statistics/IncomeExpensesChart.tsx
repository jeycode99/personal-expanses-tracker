import { chartConfig } from "@/helpers/chartConfig";
import { Dimensions, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface ChartData {
  labels: string[];
  values: number[];
}

interface IncomeExpensesChartProps {
  data: ChartData;
}

const screenWidth = Dimensions.get("window").width;

const IncomeExpensesChart: React.FC<IncomeExpensesChartProps> = ({ data }) => {
  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-lg shadow-black/10">
      <Text className="text-base font-medium mb-2">Income & Expenses</Text>
      
      {/* Legend */}
      <View className="flex-row justify-start items-center mb-4">
        <View className="flex-row items-center mr-4">
          <View className="w-3 h-3 rounded-full bg-blue-600 mr-2" />
          <Text className="text-sm text-gray-600">Income</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-red-600 mr-2" />
          <Text className="text-sm text-gray-600">Expenses</Text>
        </View>
      </View>

      <View className="items-center">
        <BarChart
          data={{
            labels: data.labels,
            datasets: [
              {
                data: data.values,
                colors: [
                  (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                  (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
                ]
              }
            ],
          }}
          width={screenWidth - 60}
          height={220}
          chartConfig={{
            ...chartConfig,
            propsForLabels: {
              ...chartConfig.propsForLabels,
              fill: '#374151',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          showBarTops={false}
          fromZero={true}
          withInnerLines={true}
          segments={4}
          yAxisLabel="$"
          yAxisSuffix=""
          flatColor={true}
          withCustomBarColorFromData={true}
        />
      </View>

      {/* Values Display */}
      <View className="flex-row justify-between mt-4 px-4">
        <View>
          <Text className="text-sm text-gray-500">Income</Text>
          <Text className="text-blue-600 font-semibold text-lg">
            ${data.values[0].toLocaleString()}
          </Text>
        </View>
        <View>
          <Text className="text-sm text-gray-500">Expenses</Text>
          <Text className="text-red-600 font-semibold text-lg">
            ${data.values[1].toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default IncomeExpensesChart; 