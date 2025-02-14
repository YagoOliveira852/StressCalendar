import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { fetchAllAnnotations } from '../services/api';

export default function GraphScreen({ navigation }) {
    const [annotations, setAnnotations] = useState([]);
    const screenWidth = Dimensions.get('window').width;

    const colors = ['green', 'lime', 'orange', 'red', 'maroon'];

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchAnnotations();
        });
        return unsubscribe;
    }, [navigation]);

    const fetchAnnotations = async () => {
        try {
            const data = await fetchAllAnnotations();
            setAnnotations(data);
        } catch (error) {
            console.error('Erro ao buscar anotações:', error);
        }
    };

    const getCauseFrequency = () => {
        const causes = annotations.map(a => a.cause).filter(Boolean);
        const causeCount = causes.reduce((acc, cause) => {
            acc[cause] = (acc[cause] || 0) + 1;
            return acc;
        }, {});

        const values = Object.values(causeCount).map(value => Math.floor(value));

        return {
            labels: [...Object.keys(causeCount)],
            datasets: [
                { data: [...values] },
            ],
        };
    };

    const getStressOverTime = () => {
        const dates = annotations.map(a => {
            const date = new Date(a.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;  // Formato MM/DD
        });

        const uniqueDates = [...new Set(dates)].sort((a, b) => {
            const [monthA, dayA] = a.split('/').map(Number);
            const [monthB, dayB] = b.split('/').map(Number);
            return monthA === monthB ? dayA - dayB : monthA - monthB;
        });

        const maxStressLevelsByDate = uniqueDates.map(date => {
            const levels = annotations
                .filter(a => {
                    const current = `${new Date(a.date).getMonth() + 1}/${new Date(a.date).getDate()}`;
                    return current === date;
                })
                .map(a => Math.floor(a.stressLevel))
                .filter(value => !isNaN(value));
            const maxLevel = Math.max(...levels, 0);
            return maxLevel;
        });

        return {
            labels: uniqueDates,
            datasets: [
                { data: maxStressLevelsByDate },
                { data: [4], withDots: false },
            ],

        };
    };



    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Análise Gráfica de Estressores</Text>

            <Text style={styles.graphTitle}>Frequência das Causas de Estresse</Text>
            {annotations.length > 0 ? (
                <BarChart
                    data={getCauseFrequency()}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    fromZero={true}

                />
            ) : (
                <Text style={styles.noData}>Nenhuma anotação disponível para exibir.</Text>
            )}

            <Text style={styles.graphTitle}>Nível de Estresse ao Longo do Tempo</Text>
            {annotations.length > 0 ? (
                <LineChart
                    data={getStressOverTime()}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    fromZero
                    getDotColor={(dataPoint) => colors[Math.min(Math.max(dataPoint, 0), 4)]}
                />
            ) : (
                <Text style={styles.noData}>Nenhuma anotação disponível para exibir.</Text>
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
    style: { borderRadius: 16 },
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
    graphTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    noData: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginVertical: 10,
    },
});
