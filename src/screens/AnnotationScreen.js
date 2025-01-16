import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '@env';

export default function AnnotationsScreen() {
    const [annotations, setAnnotations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/annotations`)
            .then((response) => {
                setAnnotations(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching annotations:', error);
                setError('Erro ao buscar anotações. Tente novamente mais tarde.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Anotações Agrupadas</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <FlatList
                data={annotations}
                keyExtractor={(item) => item.date}
                renderItem={({ item }) => (
                    <View style={styles.annotationGroup}>
                        <Text style={styles.date}>{item.date}</Text>
                        <Text>{item.annotations}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    error: {
        color: 'red',
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    annotationGroup: {
        marginBottom: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});
