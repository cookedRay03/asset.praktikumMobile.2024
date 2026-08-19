import { Stack } from "expo-router";

export default function RootLayout() {
return (
    <Stack>
    <Stack.Screen
        name="index"
        options={{
        title: "Device Access",
        }}
    />

    <Stack.Screen
        name="camera"
        options={{
        title: "Camera",
        }}
    />

    <Stack.Screen
        name="location"
        options={{
        title: "Location",
        }}
    />

    <Stack.Screen
        name="document"
        options={{
        title: "Document",
        }}
    />
    </Stack>
);
}