import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, ScrollView } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import {
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";

export default function App() {
  const [costo, setCosto] = useState("");
  const [salario, setSalario] = useState("");
  const [transmision, setTransmision] = useState("manual");
  const [pago, setPago] = useState("contado");
  const [resultado, setResultado] = useState(null);

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  if (!fontsLoaded) return null;

  const calcular = () => {

    const precio = parseFloat(costo);
    const sueldo = parseFloat(salario);

    if (!costo.trim() && !salario.trim()) {
      Alert.alert(
        "Campos vacíos",
        "Por favor ingresa el costo del auto y tu salario para continuar.",
        [{ text: "Entendido", style: "default" }]
      );
      return;
    }

    if (!costo.trim() || isNaN(precio) || precio <= 0) {
      Alert.alert(
        "Costo inválido",
        "Ingresa un costo del auto válido mayor a cero.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!salario.trim() || isNaN(sueldo) || sueldo <= 0) {
      Alert.alert(
        "Salario inválido",
        "Ingresa un salario válido mayor a cero.",
        [{ text: "OK" }]
      );
      return;
    }

    let precioFinal = precio;

    if (transmision === "automatico") {
      precioFinal += 1500;
    }

    let impuesto = 0; // se hace el cálculo dentro de cada if por separado por la suma de 8% al comprar por crédito
    let total = 0;
    let letra = 0;
    let estadoVenta = false;

    if (pago === "credito") {
      precioFinal = precioFinal * Math.pow((1 + 0.8), 9);
      impuesto = precioFinal * 0.07;
      total = precioFinal + impuesto;
      letra = total / (9 * 12);
      estadoVenta = sueldo * 0.3 >= letra;
    } else { // contado
      impuesto = precioFinal * 0.07;
      total = precioFinal + impuesto;
    }

    setResultado({
      costoAuto: precioFinal,
      impuesto,
      total,
      letra,
      treintaPorciento: sueldo * 0.3,
      estadoVenta,
    });
  };

  const RadioButton = ({ selected, onPress, label }) => ( // componente reutilizable de radiobutton
    <TouchableOpacity style={styles.radioContainer} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={[styles.radioText, selected && styles.radioTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ResultRow = ({ label, value, highlight }) => (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={[styles.resultValue, highlight && styles.resultValueHighlight]}>
        {value}
      </Text>
    </View>
  );

  const fmt = (n) => // función para formatear números a formato de moneda con 2 decimales y símbolo de dólar
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#0f2057" />
        <ScrollView style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.headerSub}>DEALERSHIP</Text>
            <Text style={styles.headerTitle}>HOU ZHENG</Text>
            <View style={styles.headerLine} />
          </View>

          <View style={styles.card}>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>COSTO DEL AUTO</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={costo}
                  onChangeText={setCosto}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SALARIO MENSUAL</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefix}>$</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={salario}
                  onChangeText={setSalario}
                />
              </View>
            </View>

            <Text style={styles.sectionLabel}>TRANSMISIÓN</Text>
            <View style={styles.radioRow}>
              <RadioButton
                label="Manual"
                selected={transmision === "manual"}
                onPress={() => setTransmision("manual")}
              />
              <RadioButton
                label="Automático"
                selected={transmision === "automatico"}
                onPress={() => setTransmision("automatico")}
              />
            </View>

            <Text style={styles.sectionLabel}>FORMA DE PAGO</Text>
            <View style={styles.radioRow}>
              <RadioButton
                label="Contado"
                selected={pago === "contado"}
                onPress={() => setPago("contado")}
              />
              <RadioButton
                label="Crédito"
                selected={pago === "credito"}
                onPress={() => setPago("credito")}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={calcular} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Calcular</Text>
            </TouchableOpacity>

            {resultado && (
              <View style={styles.resultado}>
                <Text style={styles.resultTitle}>FACTURA</Text>

                <ResultRow label="Costo del auto" value={fmt(resultado.costoAuto)} />
                <View style={styles.resultDivider} />
                <ResultRow label="ITBM (7%)" value={fmt(resultado.impuesto)} />
                <View style={styles.resultDivider} />
                <ResultRow label="Gran total" value={fmt(resultado.total)} highlight />

                {pago === "credito" && (
                  <>
                    <View style={styles.creditSection}>
                      <ResultRow label="Cuota mensual (9 años)" value={fmt(resultado.letra)} />
                      <View style={styles.resultDivider} />
                      <ResultRow label="30% de tu salario" value={fmt(resultado.treintaPorciento)} />
                    </View>

                    <View
                      style={[
                        styles.estadoBadge,
                        resultado.estadoVenta ? styles.estadoAprobado : styles.estadoRechazado,
                      ]}
                    >
                      <Text
                        style={[
                          styles.estadoText,
                          resultado.estadoVenta ? styles.estadoTextAprobado : styles.estadoTextRechazado,
                        ]}
                      >
                        {resultado.estadoVenta ? "✓  APROBADO" : "✕  NO APROBADO"}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f2057",
  },

  header: {
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 18,
    alignItems: "center",
  },

  headerSub: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 11,
    letterSpacing: 4,
    color: "#7aa3e0",
    marginBottom: 4,
  },

  headerTitle: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 38,
    color: "#ffffff",
    letterSpacing: 1,
  },

  headerLine: {
    width: 40,
    height: 2,
    backgroundColor: "#3b82f6",
    marginTop: 10,
    borderRadius: 2,
  },

  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 16,
  },

  inputGroup: {
    marginBottom: 18,
  },

  inputLabel: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 11,
    letterSpacing: 2,
    color: "#64748b",
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
  },

  inputPrefix: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 17,
    color: "#3b82f6",
    marginRight: 6,
  },

  input: {
    flex: 1,
    fontFamily: "Outfit_400Regular",
    fontSize: 17,
    color: "#1e293b",
    paddingVertical: 13,
  },

  sectionLabel: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 11,
    letterSpacing: 2,
    color: "#64748b",
    marginTop: 4,
    marginBottom: 12,
  },

  radioRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  radioOuterSelected: {
    borderColor: "#3b82f6",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3b82f6",
  },

  radioText: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: "#94a3b8",
  },

  radioTextSelected: {
    fontFamily: "Outfit_600SemiBold",
    color: "#1e293b",
  },

  button: {
    backgroundColor: "#1d4ed8",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
    shadowColor: "#1d4ed8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonText: {
    fontFamily: "Outfit_700Bold",
    color: "#ffffff",
    fontSize: 16,
    letterSpacing: 1,
  },

  resultado: {
    marginTop: 20,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  resultTitle: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 20,
    color: "#0f2057",
    marginBottom: 14,
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },

  resultLabel: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: "#64748b",
  },

  resultValue: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 15,
    color: "#1e293b",
  },

  resultValueHighlight: {
    fontFamily: "Outfit_700Bold",
    fontSize: 17,
    color: "#1d4ed8",
  },

  resultDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 2,
  },

  creditSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },

  estadoBadge: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  estadoAprobado: {
    backgroundColor: "#dcfce7",
  },

  estadoRechazado: {
    backgroundColor: "#fee2e2",
  },

  estadoText: {
    fontFamily: "Outfit_700Bold",
    fontSize: 16,
    letterSpacing: 1,
  },

  estadoTextAprobado: {
    color: "#15803d",
  },

  estadoTextRechazado: {
    color: "#b91c1c",
  },
});
