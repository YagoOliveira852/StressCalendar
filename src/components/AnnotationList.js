import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function AnnotationList({ annotations }) {
    const renderAnnotationItem = ({ item }) => (
        <View style={styles.annotationItemContainer}>
            <View style={[styles.annotationBar, { backgroundColor: item.color }]} />
            <View style={styles.annotationContent}>
                <Text>Causa: {item.cause}</Text>
                <Text>Grau de Estresse: {item.stressLevel}</Text>
                <Text>Horário: {item.timeRange}</Text>
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
        width: 10,
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
