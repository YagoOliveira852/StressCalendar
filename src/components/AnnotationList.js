import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { deleteAnnotation } from '../services/api';

export default function AnnotationList({ annotations, selectedDate, fetchAnnotations, onEdit }) {
    const handleDelete = async (id) => {
        Alert.alert(
            "Confirmar Exclusão",
            "Você tem certeza que deseja deletar esta anotação?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Deletar", style: "destructive", onPress: async () => {
                        try {
                            await deleteAnnotation(id);
                            Alert.alert('Sucesso', 'Anotação deletada com sucesso!');
                            fetchAnnotations(selectedDate);
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Erro', 'Erro ao deletar anotação.');
                        }
                    }
                }
            ]
        );
    };

    const renderAnnotationItem = ({ item }) => (
        <View style={styles.annotationItemContainer}>
            <View style={[styles.annotationBar, { backgroundColor: item.color }]} />
            <View style={styles.annotationContent}>
                <Text>Causa: {item.cause}</Text>
                <Text>Grau de Estresse: {item.stressLevel}</Text>
                <Text>Horário: {item.timeRange}</Text>
            </View>
            <View style={styles.ButtonContainer}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => onEdit(item)}  // Aciona o modal de edição
                >
                    <Text style={styles.buttonText}>Editar </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.ButtonContainer}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                >
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
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
        padding: 10,
    },
    annotationBar: {
        width: 10,
    },
    annotationContent: {
        flex: 1,
        paddingLeft: 10,
    },
    ButtonContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        margin: 5,
    },
    editButton: {
        backgroundColor: '#1684E1',
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 5,
    },
    deleteButton: {
        backgroundColor: '#db3b4d',
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noAnnotations: {
        textAlign: 'center',
        color: '#888',
    },
});
