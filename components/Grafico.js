import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// ⚡️ Substitua 'agua' e 'copos' pelo seu campo e unidade!
export default function Grafico({ registros }) {
  if (registros.length < 2) {
    return <Text style={{textAlign: 'center', margin: 10}}>
//Adicione pelo menos 2 registros para ver o gráfico.
</Text>;
  }

  const data = {
    labels: registros.map(reg => new Date(reg.id).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })).reverse(), // Eixo X (Datas)
    datasets: [
      {
        data: registros.map(reg => reg.trabalho).reverse(), // Eixo Y (Valores)
      },
    ],
  };

  return (
    <View>
      <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>Evolução (Água)</Text>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 40} // Largura da tela
        height={220}
        yAxisSuffix=" copos"
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </View>
  );
}