import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  Button,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Car } from "../../src/types/Car";
import api from "../../src/services/api";
import { useTokenContext } from "../../src/contexts/userContext";
import { Ionicons } from "@expo/vector-icons";

export default function Search() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [brand, setBrand] = useState<string>("");
  const { token } = useTokenContext();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await api.get<{ items: Car[] }>(
        "/api/collections/cars/records",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setCars(response.data.items);
      setFilteredCars(response.data.items);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSearch = () => {
    if (brand === "") {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter((car) =>
        car.brand.toLowerCase().includes(brand.toLowerCase())
      );
      setFilteredCars(filtered);
    }
  };

  const handleCancel = () => {
    router.navigate(`/userspace/`);
  };

  const handleEdit = (id) => {
    router.navigate(`/userspace/edit_car?id=${id}`);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this car?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            api
              .delete(`/api/collections/cars/records/${id}`, {
                headers: {
                  Authorization: token,
                },
              })
              .then((response) => {
                console.log(`Deleted post with ID ${id}`);
                router.replace("/userspace");
              })
              .catch((error) => {
                Alert.alert(error.message);
              });
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.flatContainer}>
      <View style={styles.detailsContainer}>
        <Text style={{ fontStyle: "italic", marginBottom: 10 }}>
          ID: {item.id}
        </Text>
        <Text style={{ fontWeight: "bold" }}>Brand: {item.brand}</Text>
        <Text style={{ fontWeight: "bold" }}>Model: {item.model}</Text>
        <Text style={{ fontWeight: "bold" }}>HP: {item.hp}</Text>
      </View>
      <TouchableOpacity
        style={styles.itemRightSide}
        onPress={() => handleEdit(item.id)}
      >
        <Ionicons name="pencil" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash-sharp" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Filter by brand"
        value={brand}
        onChangeText={setBrand}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleCancel}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredCars}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonContainer: {
    backgroundColor: "black",
    width: 250,
    borderRadius: 30,
    paddingHorizontal: 16,
    marginVertical: 5,
    alignSelf: "center",
  },
  buttonText: {
    paddingVertical: 8,
    marginVertical: 8,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  flatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    borderStyle: "solid",
    borderWidth: 1.5,
    borderRadius: 20,
    borderColor: "rgba(0, 0, 0, 0.3)",
    padding: 17.5,
  },
  detailsContainer: {
    flex: 1,
  },
  itemRightSide: {
    paddingHorizontal: 20,
  },
});
