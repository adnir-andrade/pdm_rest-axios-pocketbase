import { useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTokenContext } from "../../src/contexts/userContext";
import api from "../../src/services/api";
import { Car } from "../../src/types/Car";
import { Brand } from "../../src/types/Brand";

export default function CreateCar() {
  const params = useGlobalSearchParams();
  const router = useRouter();
  const { token } = useTokenContext();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [hp, setHp] = useState("");

  useEffect(() => {
    fetchCars();
    fetchBrands();
  }, []);

  const fetchCars = async () => {
    api
      .get(`/api/collections/cars/records/${params.id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setBrand(response.data.brand);
        setModel(response.data.model);
        setHp(response.data.hp.toString());
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

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

  const handleEdit = async () => {
    const data = {
      model,
      brand,
      hp: parseInt(hp),
    };

    const editedCar = await api.patch<Car>(
      `/api/collections/cars/records/${params.id}`,
      data,
      {
        headers: {
          Authorization: token,
          "content-type": "application/json",
        },
      }
    );

    if (editedCar.status === 200) {
      Alert.alert("Car edited!", editedCar.data.model);
      router.replace("/userspace");
    } else {
      Alert.alert("Error!", "Error Creating Car!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cars API EDIT</Text>

      <Text style={styles.attribute}>${params.id}</Text>
      <Picker
        selectedValue={brand}
        onValueChange={(itemValue) => setBrand(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a brand" value="" />
        {brands.map((brand) => (
          <Picker.Item key={brand.name} label={brand.name} value={brand.name} />
        ))}
      </Picker>
      <TextInput
        style={styles.attribute}
        value={model}
        onChangeText={setModel}
        placeholder="model"
      />
      <TextInput
        style={styles.attribute}
        value={hp}
        onChangeText={(text) => setHp(text.replace(/[^0-9]/g, ""))}
        placeholder="hp"
        keyboardType="number-pad"
      />

      <Button title="Edit Car" onPress={handleEdit} />
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
    width: "50%",
    marginBottom: 175,
  },
  attribute: {
    marginBottom: 20,
  },
});
