import React, { useCallback } from 'react';
import { Modal, View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Button } from "react-native-elements";
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { debounce } from 'lodash';

export default function AnnotationModal({
    modalVisible,
    setModalVisible,
    saveAnnotation,
    selectedCause,
    setSelectedCause,
    stressLevel,
    setStressLevel,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    showStartTimePicker,
    setShowStartTimePicker,
    showEndTimePicker,
    setShowEndTimePicker,
    colors,
    editingAnnotation
}) {
    // Debounce a função que altera o estado
    const handleStressLevelChange = useCallback(
        debounce((value) => {
            setStressLevel(value);
        }, 100), // Limita as atualizações a cada 100ms
        []
    );

    const resetModalState = () => {
        setSelectedCause('');
        setStressLevel(0);
        setStartTime(new Date());
        setEndTime(new Date());
    };

    return (
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
            <ScrollView contentContainerStyle={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Adicionar Anotação</Text>

                    <Text>Escolher Possível Causa:</Text>
                    <RNPickerSelect
                        onValueChange={setSelectedCause}
                        items={[
                            { label: 'Trabalho', value: 'Trabalho' },
                            { label: 'Família', value: 'Família' },
                            { label: 'Saúde', value: 'Saúde' },
                            { label: 'Outro', value: 'Outro' },
                        ]}
                        placeholder={{ label: 'Selecione uma causa', value: null }}
                        style={pickerSelectStyles}
                    />

                    <Text>Definir grau de estresse:</Text>
                    <View style={styles.stressLevelContainer}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={4}
                            step={1}
                            value={stressLevel}
                            onValueChange={handleStressLevelChange}
                            minimumTrackTintColor={colors[stressLevel]}
                            thumbTintColor={colors[stressLevel]}
                        />
                        <View style={styles.stressLevelInfo}>
                            <Text style={[styles.stressLevelText, { color: colors[stressLevel] }]}>
                                Nível de Estresse: {stressLevel}
                            </Text>
                        </View>
                    </View>

                    <Text>Selecionar Horário:</Text>
                    <View style={styles.timerButtonInfo}>
                        <Button
                            buttonStyle={styles.timerButton}
                            title={`Início: ${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`}
                            onPress={() => setShowStartTimePicker(true)}
                        />
                        <Button
                            buttonStyle={styles.timerButton}
                            title={`Fim: ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`}
                            onPress={() => setShowEndTimePicker(true)}
                        />
                    </View>

                    {showStartTimePicker && (
                        <DateTimePicker
                            value={startTime}
                            mode="time"
                            is24Hour={true}
                            onChange={(e, d) => {
                                setStartTime(d);
                                setShowStartTimePicker(false);
                            }}
                        />
                    )}

                    {showEndTimePicker && (
                        <DateTimePicker
                            value={endTime}
                            mode="time"
                            is24Hour={true}
                            onChange={(e, d) => {
                                setEndTime(d);
                                setShowEndTimePicker(false);
                            }}
                        />
                    )}


                    <Button buttonStyle={styles.saveButton} title={editingAnnotation ? "Atualizar Anotação" : "Salvar Anotação"} onPress={saveAnnotation} />

                    <Button buttonStyle={styles.cancelButton} title="Cancelar" onPress={() => { setModalVisible(false); resetModalState(); }} />
                </View>
            </ScrollView>
        </Modal>
    );
}

const pickerSelectStyles = {
    inputIOS: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        marginVertical: 8,
    },
    inputAndroid: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        marginVertical: 8,
    },
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        // backgroundColor: 'white',
        // padding: 20,
        // width: '80%',
        // borderRadius: 10,
        // alignItems: 'center',
        backgroundColor: "white",
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    stressLevelContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    stressLevelInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    stressLevelText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    timerButtonInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    timerButton: {
        // backgroundColor: "#87CEFA",
        width: 120,
        height: 60,
    },
    saveButton: {
        backgroundColor: "#5cdb5c",
        marginVertical: 5,
        borderRadius: 20
    },
    cancelButton: {
        backgroundColor: "#db3b4d",
        marginVertical: 5,
        borderRadius: 20,
    },
    modalButtons: {
        marginTop: 20,
    },
});
