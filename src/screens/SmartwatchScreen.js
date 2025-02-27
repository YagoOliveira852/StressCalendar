import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { fetchStressData } from '../services/api';

export default function SmartwatchScreen({ navigation }) {
    const [stressData, setStressData] = useState([]);
    const screenWidth = Dimensions.get('window').width;

    const colors = ['green', 'lime', 'orange', 'red', 'maroon'];

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchStress();
        });
        return unsubscribe;
    }, [navigation]);

    const fetchStress = async () => {
        try {
            const data = await fetchStressData();
            setStressData(data);
        } catch (error) {
            console.error('Erro ao buscar dados de estresse:', error);
        }
    };

    const getStressOverTime = () => {
        if (stressData.length === 0) return { labels: [], datasets: [] };

        const timestamps = stressData.map(entry => new Date(entry.timestamp));
        const stressLevels = stressData.map(entry => entry.stressLevel);

        const minDate = timestamps[0];
        const maxDate = timestamps[timestamps.length - 1];
        const medianDate = timestamps[Math.floor(timestamps.length / 2)];

        let labels = timestamps.map(ts => `${ts.getMonth() + 1}/${ts.getDate()} ${ts.getHours()}:${ts.getMinutes()}`);
        if (timestamps.length > 10) {
            labels = timestamps.map((ts, i) => {
                if (i === 0) return `${minDate.getMonth() + 1}/${minDate.getDate()}`;
                if (i === Math.floor(timestamps.length / 2)) return `${medianDate.getMonth() + 1}/${medianDate.getDate()}`;
                if (i === timestamps.length - 1) return `${maxDate.getMonth() + 1}/${maxDate.getDate()}`;
                return '';
            });
        }

        return {
            labels: labels,
            datasets: [{ data: stressLevels }],
        };
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Estresse capturado no Smartwatch - Cenário 2</Text>

            {stressData.length > 0 ? (
                <View style={{ marginRight: 20 }}>
                    <LineChart
                        data={getStressOverTime()}
                        width={screenWidth - 32}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        fromZero
                        style={{ paddingRight: 30, }}
                        getDotColor={(dataPoint) => colors[Math.min(Math.max(dataPoint, 0), 4)]}
                    />
                </View>
            ) : (
                <Text style={styles.noData}>Nenhum dado disponível para exibir.</Text>
            )}
        </ScrollView>
    );
}

const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#f5f5f5',
    backgroundGradientTo: '#e0e0e0',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16, paddingLeft: 20 },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    noData: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginVertical: 10,
    },
});
