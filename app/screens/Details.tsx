import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Modal,
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
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  // const handleUpdateUser = async () => {
  //   if (!name.trim() || !address.trim()) {
  //     Alert.alert("Error", "Please enter both name and address.");
  //     return;
  //   }

  //   try {
  //     await updateDoc(doc(FIREBASE_DB, "users", "<DOCUMENT_ID>"), {
  //       name: name,
  //       address: address,
  //     });
  //     Alert.alert("Success", "User updated successfully!");
  //     setName(""); // Clear the input after successful update
  //     setAddress("");
  //   } catch (e) {
  //     console.error("Error updating document: ", e);
  //     Alert.alert("Error", "Error updating user in database.");
  //   }
  // };

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

  const handleUpdateUser = async () => {
    setIsLoading(true);
    try {
      await updateDoc(doc(FIREBASE_DB, "users", selectedUserId), {
        name: name,
        address: address,
      });
      setIsModalVisible(false); // Close the modal after successful update
      fetchUsers(); // Fetch users again to update the list
    } catch (error) {
      console.error("Error updating document: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (userId, userName, userAddress) => {
    setSelectedUserId(userId);
    setName(userName);
    setAddress(userAddress);
    setIsModalVisible(true);
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
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    openEditModal(item.id, item.name, item.address)
                  }
                >
                  <Text>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteUser(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              autoCapitalize="none"
              onChangeText={setName}
              value={name}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              autoCapitalize="none"
              onChangeText={setAddress}
              value={address}
            />
            <View style={styles.modalButtonsContainer}>
              <Button title="Update" onPress={handleUpdateUser} />
              <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
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
  actionsContainer: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});
