import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import CalendarComponent from '../components/CalendarComponent';
import AnnotationModal from '../components/AnnotationModal';
import AnnotationList from '../components/AnnotationList';
import { fetchAllAnnotations, fetchAnnotationsByDate, saveAnnotation, updateAnnotation } from '../services/api';

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState('');
    const [calendarMarks, setCalendarMarks] = useState({});
    const [annotations, setAnnotations] = useState([]);
    const [editingAnnotation, setEditingAnnotation] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCause, setSelectedCause] = useState('');
    const [stressLevel, setStressLevel] = useState(0);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
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
                // Validações para evitar campos undefined
                if (!item.date || !item.startTime || !item.endTime) {
                    console.warn("Anotação inválida encontrada:", item);
                    return; // Ignora anotações inválidas
                }

                // Calcular o maior nível de estresse para a data
                if (!marks[item.date] || stressLevel > marks[item.date].maxStressLevel) {
                    marks[item.date] = {
                        maxStressLevel: stressLevel,
                        dots: [{ color: colors[stressLevel] || 'grey' }], // Apenas o maior nível de estresse
                    };
                }
            });

            const finalMarks = marks;
            setCalendarMarks(finalMarks);

        } catch (error) {
            console.error(error);
            setAnnotations([]);
            Alert.alert('Erro', 'Não foi possível carregar as anotações.');
        }
    };


    const fetchAnnotations = async (date) => {
        try {
            const data = await fetchAnnotationsByDate(date);

            // Formatar os dados das anotações
            const formattedData = data.map((item, index) => ({
                id: item.id,
                cause: item.cause,
                stressLevel: item.stressLevel,
                timeRange: `${new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                color: colors[item.stressLevel] || 'grey',
            }));

            setAnnotations(formattedData || []);
            // Calcular o maior nível de estresse para marcar o dot
            if (formattedData.length > 0) {
                const maxStressLevel = Math.max(...formattedData.map(item => item.stressLevel));
                const dotColor = colors[maxStressLevel] || 'grey';

                // Atualizar o calendário com o dot
                setCalendarMarks((prevMarks) => ({
                    ...prevMarks,
                    [date]: {
                        marked: true,
                        dots: [{ color: dotColor }],
                    },
                }));
            } else {
                // Remove o dot se não houver anotações para a data
                setCalendarMarks((prevMarks) => {
                    const updatedMarks = { ...prevMarks };
                    delete updatedMarks[date];
                    return updatedMarks;
                });
            }
        } catch (error) {
            console.error(error);
            setAnnotations([]);
            Alert.alert('Erro', 'Não foi possível carregar as anotações.');
        }
    };


    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        fetchAnnotations(day.dateString);
    };

    const saveAnnotationToServer = async () => {
        if (!selectedCause || stressLevel === undefined || !startTime || !endTime) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios.');
            return;
        }

        const annotation = {
            date: selectedDate,
            cause: selectedCause,
            stressLevel,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
        };

        try {
            await saveAnnotation(annotation);
            Alert.alert('Sucesso', 'Anotação salva com sucesso!');
            setModalVisible(false);
            fetchAnnotations(selectedDate);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível salvar a anotação.');
        }
    };

    const saveOrUpdateAnnotation = async () => {
        if (!selectedCause || stressLevel === undefined || !startTime || !endTime) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios.');
            return;
        }

        // Combinar a data selecionada com os horários escolhidos
        const combineDateTime = (date, time) => {
            const combined = new Date(date);
            combined.setHours(time.getHours(), time.getMinutes());
            return combined.toISOString();
        };


        const annotation = {
            date: selectedDate, // Data correta do calendário
            cause: selectedCause,
            stressLevel,
            startTime: combineDateTime(selectedDate, startTime), // Correção aqui
            endTime: combineDateTime(selectedDate, endTime),     // Correção aqui
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
                handleDayPress={handleDayPress}
                markedDates={calendarMarks}
            />


            <AnnotationList
                annotations={annotations}
                selectedDate={selectedDate}
                fetchAnnotations={fetchAnnotations}
                onEdit={(annotation) => {
                    setEditingAnnotation(annotation);
                    // setSelectedCause(annotation.cause);
                    // setStressLevel(annotation.stressLevel);

                    // const startDate = new Date(annotation.startTime);
                    // const endDate = new Date(annotation.endTime);

                    // // Corrigir o fuso horário aplicando o deslocamento inverso
                    // setStartTime(new Date(startDate.getTime() + startDate.getTimezoneOffset() * 60000));
                    // setEndTime(new Date(endDate.getTime() + endDate.getTimezoneOffset() * 60000));

                    setModalVisible(true);
                }}


            />


            <View style={styles.addAnnotationContainer}>
                <Button buttonStyle={styles.addAnnotation} titleStyle={styles.addAnnotationText} title="Adicionar Anotação" onPress={() => { setModalVisible(true); setEditingAnnotation(null); }} />
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
});
