import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
return (
    <View style={styles.container}>
    <Text style={styles.title}>Native Device Access</Text>

    <Text style={styles.subtitle}>
        Contoh akses fitur perangkat menggunakan Expo
    </Text>

    <Pressable
        style={styles.button}
        onPress={() => router.push("/camera")}
    >
        <Text style={styles.buttonText}>📷 Camera</Text>
    </Pressable>

    <Pressable
        style={styles.button}
        onPress={() => router.push("/location")}
    >
        <Text style={styles.buttonText}>📍 Location / GPS</Text>
    </Pressable>

    <Pressable
        style={styles.button}
        onPress={() => router.push("/document")}
    >
        <Text style={styles.buttonText}>📄 Document Picker</Text>
    </Pressable>
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
},

title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
},

subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
},

button: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
},

buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
},
});