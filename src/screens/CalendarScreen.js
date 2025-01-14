import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import CalendarComponent from '../components/CalendarComponent';
import AnnotationModal from '../components/AnnotationModal';
import AnnotationList from '../components/AnnotationList';

export default function CalendarScreen() {
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
        const todayString = today.toISOString().split('T')[0]; // Formato "YYYY-MM-DD"
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

        setAnnotations((prevAnnotations) => ({
            ...prevAnnotations,
            [selectedDate]: {
                marked: true,
                dots: [{ color: "purple" }],
                annotations: [
                    ...(prevAnnotations[selectedDate]?.annotations || []),
                    {
                        cause: selectedCause,
                        stressLevel,
                        timeRange: `${startTime.getHours()}:${startTime.getMinutes()} - ${endTime.getHours()}:${endTime.getMinutes()}`,
                    },
                ],
            },
        }));
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

            <Button buttonStyle={styles.addAnnotation} title="Adicionar Anotação" onPress={openModal} />

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
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    addAnnotation: {
        borderRadius: 10,
    },
});
