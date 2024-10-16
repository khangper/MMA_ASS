// FavoritesScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  toggleFavorite,
  loadFavorites,
  removeFavorites,
  clearFavorites,
} from "../src/redux/productsSlice";

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.products.favorites);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(loadFavorites());
    }
  }, [dispatch, status]);

  const handleRemoveFavorite = (product) => {
    dispatch(toggleFavorite(product));
    Alert.alert("Đã Xóa", `${product.artName} đã được xóa khỏi favorites.`);
  };

  const handleSelectItem = (item) => {
    if (selectedItems.includes(item.id)) {
      setSelectedItems(selectedItems.filter((id) => id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item.id]);
    }
  };

  const handleRemoveSelected = () => {
    Alert.alert(
      "Xác Nhận",
      "Bạn có chắc chắn muốn xóa các mục đã chọn khỏi favorites?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            dispatch(removeFavorites(selectedItems));
            setSelectedItems([]);
            setMultiSelectMode(false);
            Alert.alert(
              "Đã Xóa",
              "Các mục đã chọn đã được xóa khỏi favorites."
            );
          },
        },
      ]
    );
  };

  const handleRemoveAll = () => {
    if (favorites.length === 0) {
      Alert.alert("Thông Báo", "Không có mục nào để xóa.");
      return;
    }

    Alert.alert(
      "Xác Nhận",
      "Bạn có chắc chắn muốn xóa tất cả các mục khỏi favorites?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa Tất Cả",
          style: "destructive",
          onPress: () => {
            dispatch(clearFavorites());
            setSelectedItems([]);
            setMultiSelectMode(false);
            Alert.alert("Đã Xóa", "Tất cả các mục đã được xóa khỏi favorites.");
          },
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.favoriteItem,
        selectedItems.includes(item.id) && styles.selectedItem,
      ]}
      onPress={() => {
        if (multiSelectMode) {
          handleSelectItem(item);
        } else {
          navigation.navigate("ProductDetail", { productId: item.id });
        }
      }}
      onLongPress={() => setMultiSelectMode(true)}
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {item.artName || "Sản phẩm không tên"}
        </Text>
        <Text style={styles.productPrice}>${item.price || "N/A"}</Text>
      </View>
      {!multiSelectMode && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(item)}
        >
          <Icon name="close" size={24} color="red" />
        </TouchableOpacity>
      )}
      {multiSelectMode && (
        <Icon
          name={
            selectedItems.includes(item.id)
              ? "check-box"
              : "check-box-outline-blank"
          }
          size={24}
          color="green"
        />
      )}
    </TouchableOpacity>
  );

  // Lọc favorites dựa trên query tìm kiếm
  const filteredFavorites = favorites.filter((item) =>
    item.artName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorites</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm theo tên sản phẩm"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {multiSelectMode ? (
        <View style={styles.multiSelectActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setMultiSelectMode(false);
              setSelectedItems([]);
            }}
          >
            <Text style={styles.actionButtonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              selectedItems.length === 0 && styles.disabledButton,
            ]}
            onPress={handleRemoveSelected}
            disabled={selectedItems.length === 0}
          >
            <Text style={styles.actionButtonText}>Xóa đã chọn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              favorites.length === 0 && styles.disabledButton,
            ]}
            onPress={handleRemoveAll}
            disabled={favorites.length === 0}
          >
            <Text style={styles.actionButtonText}>Xóa tất cả</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.removeAllButton,
            favorites.length === 0 && styles.disabledButton,
          ]}
          onPress={handleRemoveAll}
          disabled={favorites.length === 0}
        >
          <Text style={styles.removeAllButtonText}>Xóa tất cả</Text>
        </TouchableOpacity>
      )}

      {filteredFavorites.length === 0 ? (
        <Text style={styles.emptyMessage}>Không tìm thấy favorites</Text>
      ) : (
        <FlatList
          data={filteredFavorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    position: "relative",
  },
  selectedItem: {
    backgroundColor: "#e0f7fa",
  },
  productImage: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    marginRight: 10,
    borderRadius: 5,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
  },
  removeButton: {
    padding: 5,
  },
  multiSelectActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  actionButton: {
    padding: 10,
    backgroundColor: "#ff6347",
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  removeAllButton: {
    padding: 10,
    backgroundColor: "#ff6347",
    borderRadius: 5,
    marginBottom: 20,
  },
  removeAllButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: "#777",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#ff6347",
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default FavoritesScreen;
