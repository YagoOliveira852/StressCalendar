import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import CalendarComponent from '../components/CalendarComponent';
import AnnotationModal from '../components/AnnotationModal';
import AnnotationList from '../components/AnnotationList';


export default function CalendarScreen({ navigation }) {
    const [selectedDate, setSelectedDate] = useState('');
    const [annotations, setAnnotations] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCause, setSelectedCause] = useState('');
    const [stressLevel, setStressLevel] = useState(0);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const colors = ['green', 'lime', 'orange', 'red', 'maroon'];
    const getColorForLevel = (level) => colors[level] || 'grey';

    useEffect(() => {
        const today = new Date();
        const todayString = today.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }).split('/').reverse().join('-'); // Formato "YYYY-MM-DD"
        setSelectedDate(todayString);
    }, []);


    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

    const openModal = () => setModalVisible(true);

    const saveAnnotation = () => {
        if (!selectedCause) {
            alert("Por favor, selecione uma causa para a anotação.");
            return;
        }

        const newAnnotation = {
            id: new Date().getTime(),
            cause: selectedCause,
            stressLevel,
            timeRange: `${startTime.getHours()}:${startTime.getMinutes()} - ${endTime.getHours()}:${endTime.getMinutes()}`,
            color: colors[stressLevel],  // Cor associada ao stressLevel
        };

        // Atualiza as anotações
        setAnnotations((prevAnnotations) => {
            const existingAnnotations = prevAnnotations[selectedDate]?.annotations || [];
            const allAnnotations = [...existingAnnotations, newAnnotation];

            // Encontra o maior nível de estresse entre todas as anotações
            const maxStressLevel = Math.max(...allAnnotations.map((annotation) => annotation.stressLevel));
            const maxStressColor = colors[maxStressLevel];

            // Define o dot do maior grau de estresse
            return {
                ...prevAnnotations,
                [selectedDate]: {
                    marked: true,
                    dots: [{ color: maxStressColor }],
                    annotations: allAnnotations,
                },
            };
        });

        setModalVisible(false);
        resetModalState();
    };




    const resetModalState = () => {
        setSelectedCause('');
        setStressLevel(0);
        setStartTime(new Date());
        setEndTime(new Date());
    };

    return (
        <View style={styles.container}>
            <CalendarComponent
                annotations={annotations}
                selectedDate={selectedDate}
                handleDayPress={handleDayPress}
            />

            <AnnotationList annotations={annotations[selectedDate]?.annotations || []} selectedDate={selectedDate} />

            <View style={styles.addAnnotationContainer}>
                <Button buttonStyle={styles.addAnnotation} titleStyle={styles.addAnnotationText} title="Adicionar Anotação" onPress={openModal} />
            </View>

            <AnnotationModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                saveAnnotation={saveAnnotation}
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
