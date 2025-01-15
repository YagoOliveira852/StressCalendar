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
        <View style={styles.annotationItemContainer}>
            {/* Barra colorida */}
            <View style={[styles.annotationBar, { backgroundColor: item.color }]} />

            {/* Conteúdo da anotação */}
            <View style={styles.annotationContent}>
                <Text>Causa: {item.cause}</Text>
                <Text>Grau de Estresse: {item.stressLevel}</Text>
                <Text>Horário: {formatTimeRange(item.timeRange)}</Text>
            </View>
        </View>
    );

    return (
        <FlatList
            data={annotations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAnnotationItem}
            ListEmptyComponent={<Text style={styles.noAnnotations}>Sem anotações para esta data.</Text>}
            style={styles.annotationList}
        />
    );
}

const styles = StyleSheet.create({
    annotationItemContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
        overflow: 'hidden',
    },
    annotationBar: {
        width: 10,  // Largura da barra colorida
    },
    annotationContent: {
        flex: 1,
        padding: 10,
    },
    noAnnotations: {
        textAlign: 'center',
        color: '#888',
    },
});

