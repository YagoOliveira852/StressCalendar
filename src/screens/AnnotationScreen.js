import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '@env';

export default function AnnotationScreen({ navigation }) {
    const [annotations, setAnnotations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnnotations = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/annotations`);
            setAnnotations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching annotations:', error);
            setError('Erro ao buscar anotações. Tente novamente mais tarde.');
            setLoading(false);
        }
    };

    useEffect(() => {
        // Atualiza as anotações quando a tela ganha o foco
        const unsubscribe = navigation.addListener('focus', () => {
            fetchAnnotations();
        });

        return unsubscribe; // Remove o listener quando o componente é desmontado
    }, [navigation]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>Todas as Anotações</Text> */}
            {error && <Text style={styles.error}>{error}</Text>}
            <FlatList
                data={annotations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.annotationItem}>
                        <Text style={styles.date}>Data: {item.date}</Text>
                        <Text style={styles.description}>Descrição: {item.description}</Text>
                        <Text style={styles.stressLevel}>Nível de Estresse: {item.stressLevel}</Text>
                        <TouchableOpacity
                            style={styles.viewButton}
                            onPress={() =>
                                navigation.navigate('AnnotationDetails', {
                                    annotation: item,
                                    refreshAnnotations: fetchAnnotations,
                                })
                            }
                        >
                            <Text style={styles.buttonText}>Ver Detalhes</Text>
                        </TouchableOpacity>
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
    annotationItem: {
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
    description: {
        fontSize: 14,
        marginBottom: 4,
    },
    stressLevel: {
        fontSize: 14,
        marginBottom: 4,
    },
    viewButton: {
        backgroundColor: '#1684E1',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
