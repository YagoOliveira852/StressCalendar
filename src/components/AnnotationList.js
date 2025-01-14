import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function AnnotationList({ annotations, selectedDate }) {
    const formatTimeRange = (timeRange) => {
        const [start, end] = timeRange.split(" - ");
        const formatTime = (time) => {
            const [hour, minute] = time.split(":");
            return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
        };
        return `${formatTime(start)} - ${formatTime(end)}`;
    };

    const renderAnnotationItem = ({ item }) => (
        <View style={styles.annotationItem}>
            <Text>Causa: {item.cause}</Text>
            <Text>Grau de Estresse: {item.stressLevel}</Text>
            <Text>Horário: {formatTimeRange(item.timeRange)}</Text>
        </View>
    );

    return (
        <FlatList
            data={annotations}
            keyExtractor={(item, index) => `${selectedDate}-${index}`}
            renderItem={renderAnnotationItem}
            ListEmptyComponent={<Text style={styles.noAnnotations}>Sem anotações para esta data.</Text>}
            style={styles.annotationList}
        />
    );
}

const styles = StyleSheet.create({
    annotationItem: {
        padding: 10,
        backgroundColor: '#eaeaea',
        marginVertical: 5,
        borderRadius: 5,
    },
    noAnnotations: {
        textAlign: 'center',
        color: '#888',
    },
});
