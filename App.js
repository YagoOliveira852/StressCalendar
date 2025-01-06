import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Provider, Portal, Modal, Button, Text } from "react-native-paper";
import { Calendar } from "react-native-calendars";

export default function App() {
  const [selectedDate, setSelectedDate] = useState("");
  const [markedDates, setMarkedDates] = useState({
    "2025-01-06": { marked: true, dotColor: "blue" }, // Exemplo de data com anotação
  });
  const [isModalVisible, setModalVisible] = useState(false);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString); // Data selecionada
    setModalVisible(true); // Abre o modal
  };

  const saveAnnotation = () => {
    setMarkedDates({
      ...markedDates,
      [selectedDate]: { marked: true, dotColor: "blue" }, // Adiciona anotação
    });
    setModalVisible(false);
  };

  return (
    <Provider>
      <View style={styles.container}>
        {/* Componente de Calendário */}
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            ...markedDates,
            [selectedDate]: { selected: true, selectedColor: "orange" }, // Data selecionada em destaque
          }}
          theme={{
            todayTextColor: "red", // Cor do dia atual
          }}
        />

        {/* Modal para Anotações */}
        <Portal>
          <Modal visible={isModalVisible} onDismiss={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Adicionar anotação para {selectedDate}</Text>
              <Button onPress={saveAnnotation}>Salvar Anotação</Button>
            </View>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  modalContent: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
