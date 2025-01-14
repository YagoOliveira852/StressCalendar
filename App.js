import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Provider, Portal, Modal, Button, Text } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import CalendarScreen from "./src/screens/CalendarScreen";

export default function App() {
  return (
    <CalendarScreen />
  );
}
