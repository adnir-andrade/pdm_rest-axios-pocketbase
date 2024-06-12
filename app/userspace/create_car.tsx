import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { Car } from "../../src/types/Car";
import { Picker } from "@react-native-picker/picker";
import { Brand } from "../../src/types/Brand";

export default function CreateCar() {
  const router = useRouter();
  const { token } = useTokenContext();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [hp, setHp] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await api.get<{ items: Brand[] }>(
        "/api/collections/brands/records",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setBrands(response.data.items);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleCancel = () => {
    router.navigate(`/userspace/`);
  };

  const handleCreate = async () => {
    const data = {
      model,
      brand,
      hp: parseInt(hp),
    };

    // na outra pagina fizemos com Promise.then, aqui com async/await
    const createdCar = await api.post<Car>(
      "/api/collections/cars/records",
      data,
      {
        headers: {
          Authorization: token,
          "content-type": "application/json",
        },
      }
    );

    if (createdCar.status === 200) {
      Alert.alert("Created!", createdCar.data.model);
      router.replace("/userspace");
    } else {
      console.log(createdCar);
      Alert.alert("Error!", "Error Creating Car!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cars API CREATE</Text>
      <View style={styles.form}>
        <Picker
          selectedValue={brand}
          onValueChange={(itemValue) => setBrand(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a brand" value="" />
          {brands.map((brand) => (
            <Picker.Item
              key={brand.name}
              label={brand.name}
              value={brand.name}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.attribute}
          value={model}
          onChangeText={setModel}
          placeholder="Insert Model here"
        />
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.attribute}
          value={hp}
          onChangeText={(text) => setHp(text.replace(/[^0-9]/g, ""))}
          placeholder="Insert HP here"
          keyboardType="number-pad"
        />
      </View>

      <TouchableOpacity style={styles.buttonContainer} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create Car</Text>
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
  picker: {
    height: 30,
    width: "100%",
    marginBottom: 175,
  },
  attribute: {
    padding: 10,
  },
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
  },
});
