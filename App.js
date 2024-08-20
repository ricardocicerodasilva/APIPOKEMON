import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, ImageBackground, Modal, TouchableOpacity, Button, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const url = 'https://api.pokemontcg.io/v2/cards?page=1&pageSize=10';
  const backgroundImage = { uri: 'https://www.cache2net2.com//Repositorio/6824/Publicacoes/219398/grZ46G9d7YfYZq7VvJPSaB.jpg?=36' };

  useEffect(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data.data); // Atualiza o estado com a lista de cartas
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  const handleCardPress = (card) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity style={styles.cardItem} onPress={() => handleCardPress(item)}>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.background}>
        <View style={styles.cardContainer}>
          <Text style={styles.title}>Pokémon Cards</Text>
          <FlatList
            data={data}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        </View>
      </ImageBackground>

      {selectedCard && (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedCard.name}</Text>
              <Text style={styles.modalText}>Type: {selectedCard.type}</Text>
              <Text style={styles.modalText}>Rarity: {selectedCard.rarity}</Text>
              {selectedCard.images?.small ? (
                <Image source={{ uri: selectedCard.images.small }} style={styles.modalImage} />
              ) : (
                <Text style={styles.modalText}>No image available</Text>
              )}
              <Button title="Close" onPress={() => setModalVisible(false)} color="#007bff" />
            </View>
          </View>
        </Modal>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 0,
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  //cardContainer: {
   // backgroundColor: 'rgba(255, 255, 255, 0.9)', // Leve transparência no fundo
   // borderRadius: 15,
    //padding: 20,
    //width: '80%',
    //alignItems: 'center',
   // shadowColor: '#000',
   // shadowOffset: { width: 0, height: 2 },
   // shadowOpacity: 0.3,
    //shadowRadius: 5,
    //elevation: 5,
  //},
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    width: '100%',
  },
  cardItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  modalImage: {
    width: 150,
    height: 150,
    marginTop: 10,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
