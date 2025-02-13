import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import CalendarComponent from '../components/CalendarComponent';
import AnnotationModal from '../components/AnnotationModal';
import AnnotationList from '../components/AnnotationList';
import { fetchAllAnnotations, fetchAnnotationsByDate, saveAnnotation, updateAnnotation } from '../services/api';

export default function CalendarScreen({ navigation }) {
    const [selectedDate, setSelectedDate] = useState('');
    const [calendarMarks, setCalendarMarks] = useState({});
    const [annotations, setAnnotations] = useState([]);
    const [editingAnnotation, setEditingAnnotation] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCause, setSelectedCause] = useState('');
    const [stressLevel, setStressLevel] = useState(0);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [description, setDescription] = useState('');
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const colors = ['green', 'lime', 'orange', 'red', 'maroon'];

    useEffect(() => {
        const today = new Date();
        const todayString = today.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split('/').reverse().join('-'); // Formato "YYYY-MM-DD"
        setSelectedDate(todayString);
        fetchAnnotations(todayString);
        fetchMarks();
    }, []);

    useEffect(() => {
        // Atualiza quando a tela ganha o foco
        const unsubscribe = navigation.addListener('focus', () => {
            const today = new Date();
            const todayString = today.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split('/').reverse().join('-');
            setSelectedDate(todayString);
            fetchAnnotations(todayString);
            fetchMarks();
        });

        return unsubscribe;
    }, [navigation]);

    const fetchMarks = async () => {
        try {
            const data = await fetchAllAnnotations();

            if (!data || data.length === 0) {
                console.warn("Nenhuma anotação encontrada.");
                setCalendarMarks({});
                setAnnotations([]);
                return;
            }

            const marks = {};
            data.forEach((item) => {
                const stressLevel = item.stressLevel;
                if (!item.date || !item.startTime || !item.endTime) {
                    console.warn("Anotação inválida encontrada:", item);
                    return;
                }
                if (!marks[item.date] || stressLevel > marks[item.date].maxStressLevel) {
                    marks[item.date] = {
                        maxStressLevel: stressLevel,
                        dots: [{ color: colors[stressLevel] || 'grey' }],
                    };
                }
            });

            setCalendarMarks(marks);
        } catch (error) {
            console.error(error);
            setAnnotations([]);
            Alert.alert('Erro', 'Não foi possível carregar as anotações.');
        }
    };

    const fetchAnnotations = async (date) => {
        try {
            const data = await fetchAnnotationsByDate(date);
            const formattedData = data.map((item) => ({
                id: item.id,
                cause: item.cause,
                stressLevel: item.stressLevel,
                timeRange: `${new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                description: item.description,
                color: colors[item.stressLevel] || 'grey',
            }));
            setAnnotations(formattedData || []);
        } catch (error) {
            console.error(error);
            setAnnotations([]);
            Alert.alert('Erro', 'Não foi possível carregar as anotações.');
        }
    };

    const saveOrUpdateAnnotation = async () => {
        if (!selectedCause || stressLevel === undefined || !startTime || !endTime || !description) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios.');
            return;
        }

        const combineDateTime = (date, time) => {
            const combined = new Date(date);
            combined.setHours(time.getHours(), time.getMinutes());
            return combined.toISOString();
        };

        const annotation = {
            date: selectedDate,
            cause: selectedCause,
            stressLevel,
            startTime: combineDateTime(selectedDate, startTime),
            endTime: combineDateTime(selectedDate, endTime),
            description,
        };

        try {
            if (editingAnnotation) {
                await updateAnnotation(editingAnnotation.id, annotation);
                Alert.alert('Sucesso', 'Anotação atualizada com sucesso!');
            } else {
                await saveAnnotation(annotation);
                Alert.alert('Sucesso', 'Anotação salva com sucesso!');
            }
            setModalVisible(false);
            fetchMarks()
            fetchAnnotations(selectedDate);
            setEditingAnnotation(null);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível salvar a anotação.');
        }
    };

    return (
        <View style={styles.container}>
            <CalendarComponent
                annotations={annotations}
                selectedDate={selectedDate}
                handleDayPress={(day) => {
                    setSelectedDate(day.dateString);
                    fetchAnnotations(day.dateString);
                    fetchMarks();
                }}
                markedDates={calendarMarks}
            />

            <AnnotationList
                annotations={annotations}
                selectedDate={selectedDate}
                fetchAnnotations={fetchAnnotations}
                fetchMarks={fetchMarks}
                onEdit={(annotation) => {
                    setEditingAnnotation(annotation);
                    // setSelectedCause(annotation.cause);
                    // setStressLevel(annotation.stressLevel);
                    // setStartTime(new Date(annotation.startTime));
                    // setEndTime(new Date(annotation.endTime));
                    // setDescription(annotation.description);
                    setModalVisible(true);
                }}
            />

            <View style={styles.addAnnotationContainer}>
                <Button buttonStyle={styles.addAnnotation} titleStyle={styles.addAnnotationText} title="Adicionar Anotação" onPress={() => { setModalVisible(true); setEditingAnnotation(null); setDescription(''); setSelectedCause(''); setStressLevel(0); }} />
            </View>

            <AnnotationModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                saveAnnotation={saveOrUpdateAnnotation}
                selectedCause={selectedCause}
                setSelectedCause={setSelectedCause}
                stressLevel={stressLevel}
                setStressLevel={setStressLevel}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                description={description}
                setDescription={setDescription}
                showStartTimePicker={showStartTimePicker}
                setShowStartTimePicker={setShowStartTimePicker}
                showEndTimePicker={showEndTimePicker}
                setShowEndTimePicker={setShowEndTimePicker}
                colors={colors}
                editingAnnotation={editingAnnotation}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    addAnnotationContainer: {
        marginBottom: 14,
        marginTop: 5,
        alignItems: 'center',
    },
    addAnnotation: {
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 70,
    },
    addAnnotationText: {
        fontSize: 16,
    },
});
