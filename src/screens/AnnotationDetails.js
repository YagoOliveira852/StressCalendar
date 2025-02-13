import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { deleteAnnotation } from '../services/api';  // Supondo que deleteAnnotation já esteja implementada

export default function AnnotationDetails({ route, navigation }) {
    const { annotation, refreshAnnotations } = route.params;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (refreshAnnotations) {
                refreshAnnotations(); // Chama a função para atualizar a lista principal
            }
        });

        return unsubscribe;
    }, [navigation, refreshAnnotations]);

    const handleDelete = async () => {
        Alert.alert(
            'Confirmar Exclusão',
            'Você tem certeza que deseja excluir esta anotação?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAnnotation(annotation.id);
                            Alert.alert('Sucesso', 'Anotação excluída com sucesso!');
                            if (refreshAnnotations) {
                                refreshAnnotations();  // Atualiza a lista de anotações
                            }
                            navigation.goBack();  // Retorna para a tela anterior
                        } catch (error) {
                            console.error('Erro ao excluir anotação:', error);
                            Alert.alert('Erro', 'Não foi possível excluir a anotação.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Detalhes da Anotação</Text>
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.value}>{annotation.date}</Text>
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.value}>{annotation.description}</Text>
            <Text style={styles.label}>Nível de Estresse:</Text>
            <Text style={styles.value}>{annotation.stressLevel}</Text>
            <Text style={styles.label}>Hora de Início:</Text>
            <Text style={styles.value}>{new Date(annotation.startTime).toLocaleTimeString()}</Text>
            <Text style={styles.label}>Hora de Fim:</Text>
            <Text style={styles.value}>{new Date(annotation.endTime).toLocaleTimeString()}</Text>

            <View style={styles.buttonContainer}>
                <Button title="Excluir Anotação" color="red" onPress={handleDelete} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 12,
    },
    value: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    buttonContainer: {
        marginTop: 20,
    },
});
