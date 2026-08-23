import {
  View,
  Text,
} from "react-native";

import { useRouter } from "expo-router";

import PageButton from "@/components/PageButton";
import { pageStyles } from "@/styles";

export default function DocsPage() {
  const router = useRouter();

  return (
    <View style={pageStyles.container}>
      <Text style={pageStyles.title}>
        Documentation
      </Text>

      <Text style={pageStyles.description}>
        Pilih materi yang ingin dipelajari.
      </Text>

      <View style={pageStyles.card}>
        <Text style={pageStyles.cardTitle}>
          Expo
        </Text>

        <Text>
          Framework untuk React Native.
        </Text>
      </View>

      <PageButton
        title="Learn Expo"
        onPress={() =>
          router.push("/docs/expo")
        }
      />

      <PageButton
        title="Learn Expo Router"
        onPress={() =>
          router.push("/docs/expo/router")
        }
      />

      <PageButton
        title="Learn Dynamic Route"
        onPress={() =>
          router.push(
            "/docs/expo/router/dynamic-route"
          )
        }
      />

      <PageButton
        title="Learn Catch-All Route"
        onPress={() =>
          router.push(
            "/docs/expo/router/catch-all"
          )
        }
      />

      <PageButton
        title="Back"
        onPress={() =>
          router.back()
        }
      />
    </View>
  );
}