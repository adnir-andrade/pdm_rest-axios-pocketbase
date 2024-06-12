import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTokenContext } from "../../src/contexts/userContext";
import api from "../../src/services/api";
import { Brand } from "../../src/types/Brand";

export default function CreateBrand() {
  const router = useRouter();
  const { token } = useTokenContext();

  const [name, setName] = useState("");

  const handleCancel = () => {
    router.navigate(`/userspace/`);
  };

  const handleCreate = async () => {
    const data = {
      name,
    };

    // na outra pagina fizemos com Promise.then, aqui com async/await
    const createdBrand = await api.post<Brand>(
      "/api/collections/brands/records",
      data,
      {
        headers: {
          Authorization: token,
          "content-type": "application/json",
        },
      }
    );

    if (createdBrand.status === 200) {
      Alert.alert("Created!", createdBrand.data.name);
      router.replace("/userspace");
    } else {
      console.log(createdBrand);
      Alert.alert("Error!", "Error Creating Brand!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register a new Brand</Text>

      <TextInput
        style={styles.form}
        value={name}
        onChangeText={setName}
        placeholder="Brand name"
      />

      <TouchableOpacity style={styles.buttonContainer} onPress={handleCreate}>
        <Text style={styles.buttonText}>Register Brand</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleCancel}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 16 },
  buttonContainer: {
    backgroundColor: "black",
    width: 250,
    borderRadius: 30,
    paddingHorizontal: 16,
    marginVertical: 5,
  },
  buttonText: {
    paddingVertical: 8,
    marginVertical: 8,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  form: {
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    width: "70%",
    marginBottom: 20,
    textAlign: "center",
    padding: 10,
  },
});
