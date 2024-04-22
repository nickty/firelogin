import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../FirebaseConfig";

const Details = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, "users"));
      const fetchedUsers = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({ id: doc.id, ...doc.data() });
      });
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!name.trim() || !address.trim()) {
      Alert.alert("Error", "Please enter both name and address.");
      return;
    }

    try {
      setIsLoading(true);
      const docRef = await addDoc(collection(FIREBASE_DB, "users"), {
        name: name,
        address: address,
      });
      console.log("Document written with ID: ", docRef.id);
      Alert.alert("Success", "User added successfully!");
      setName(""); // Clear the input after successful submission
      setAddress("");
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "Error adding user to database.");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const handleUpdateUser = async () => {
    if (!name.trim() || !address.trim()) {
      Alert.alert("Error", "Please enter both name and address.");
      return;
    }

    try {
      await updateDoc(doc(FIREBASE_DB, "users", "<DOCUMENT_ID>"), {
        name: name,
        address: address,
      });
      Alert.alert("Success", "User updated successfully!");
      setName(""); // Clear the input after successful update
      setAddress("");
    } catch (e) {
      console.error("Error updating document: ", e);
      Alert.alert("Error", "Error updating user in database.");
    }
  };

  const handleDeleteUser = async (userId) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(FIREBASE_DB, "users", userId));
      // Update the local state to reflect the changes
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error removing document: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        autoCapitalize="none"
        onChangeText={(text) => setName(text)}
        value={name}
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Address"
        autoCapitalize="none"
        onChangeText={(text) => setAddress(text)}
        value={address}
      ></TextInput>

      <View style={styles.buttonContainer}>
        <Button title="Add User" onPress={handleAddUser} />
        <Button title="Update User" onPress={handleUpdateUser} />
      </View>

      {isLoading ? (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="#0000ff"
        />
      ) : (
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text>{item.name}</Text>
              <Text>{item.address}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteUser(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "#ffccff",
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
  },
});
