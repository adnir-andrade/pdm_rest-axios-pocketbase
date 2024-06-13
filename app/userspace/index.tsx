import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTokenContext } from "../../src/contexts/userContext";
import api from "../../src/services/api";
import { Car } from "../../src/types/Car";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const { token } = useTokenContext();
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    // exemplo com then-catch (na outra página usaremos async-await)
    api
      .get("/api/collections/cars/records", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setCars(response.data.items);
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  }, []);

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
      <Text style={styles.title}>Cars API LIST</Text>

      <View style={styles.linkContainer}>
        <Link href="/userspace/create_car" style={styles.link}>
          Create a new Car
        </Link>
      </View>
      <View style={styles.linkContainer}>
        <Link href="/userspace/create_brand" style={styles.link}>
          Register a new Brand
        </Link>
      </View>
      <View style={styles.linkContainer}>
        <Link href="/userspace/search" style={styles.link}>
          Search for a car by Brand
        </Link>
      </View>
      <View style={styles.linkContainer}>
        <Link href="/userspace/talk" style={styles.link}>
          Talk just because
        </Link>
      </View>
      <FlatList
        data={cars}
        renderItem={renderItem}
        keyExtractor={(car) => car.id}
        style={styles.flatlist}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flatlist: {
    padding: 16,
    width: "100%",
    flex: 1,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 16 },
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
  link: {
    paddingVertical: 8,
    marginVertical: 8,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  linkContainer: {
    backgroundColor: "black",
    width: 250,
    borderRadius: 30,
    paddingHorizontal: 16,
    marginVertical: 5,
  },
});
