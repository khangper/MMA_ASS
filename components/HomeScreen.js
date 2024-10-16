// HomeScreen.js
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  fetchProducts,
  toggleFavorite,
  loadFavorites,
} from "../src/redux/productsSlice";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [searchText, setSearchText] = useState("");
  const {
    items: products,
    favorites,
    status,
    error,
  } = useSelector((state) => state.products);
  const image = {
    uri: "https://wowart.vn/wp-content/uploads/2020/01/hoc-ve-chan-dung.jpg",
  };

  const image1 = {
    uri: "https://vn1.vdrive.vn/alohadecor.vn/2023/12/the-starry-night-dem-day-sao-vincent-van-gogh-5f3e7ccb-3f45-45c2-a483-f613a6b835b0.jpg",
  };
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(loadFavorites()); // Load favorites on mount
  }, [dispatch]);

  const handleToggleFavorite = (product) => {
    dispatch(toggleFavorite(product));
  };

  const handleBrandFilter = (brand) => {
    setSelectedBrand(brand);
  };

  const brandFilterButtons = useMemo(
    () => (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.brandFilterContainer}
      >
        {["All", "Arteza", "Color Splash", "Edding", "KingArt"].map((brand) => (
          <TouchableOpacity
            key={brand}
            style={styles.brandFilterButton}
            onPress={() => handleBrandFilter(brand === "All" ? null : brand)}
          >
            <View
              style={[
                styles.brandFilterButtonInner,
                selectedBrand === (brand === "All" ? null : brand) &&
                  styles.activeBrandButton,
              ]}
            >
              <Text
                style={[
                  styles.brandFilterText,
                  selectedBrand === (brand === "All" ? null : brand) &&
                    styles.activeBrandText,
                ]}
              >
                {brand}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    ),
    [selectedBrand]
  );

  const filteredProducts = products.filter((item) => {
    const matchesBrand = selectedBrand ? item.brand === selectedBrand : true;
    const matchesSearch = item.artName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  const renderProductItem = ({ item }) => {
    if (!item || !item.id) {
      console.warn("Invalid product item:", item);
      return null;
    }

    const isFavorite = favorites.some((fav) => fav.id === item.id);

    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() =>
          navigation.navigate("ProductDetail", { productId: item.id })
        }
      >
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/150" }}
          style={styles.productImage}
        />

        {/* Hiển thị giá trị phần trăm khuyến mãi */}
        {item.limitedTimeDeal > 0 && (
          <View style={styles.dealBadge}>
            <Text style={styles.dealText}>
              -{Math.round(item.limitedTimeDeal * 100)}%
            </Text>
          </View>
        )}

        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {item.artName || "Unnamed Product"}
        </Text>
        <Text style={styles.productPrice}>${item.price || "N/A"}</Text>
        <Text style={styles.productBrand}>
          Brand: {item.brand || "Unknown"}
        </Text>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleToggleFavorite(item)}
        >
          <Icon
            name="favorite"
            size={24}
            color={isFavorite ? "#ff6347" : "#D3D3D3"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchAndFilterContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity onPress={() => {}}>
            <Icon name="search" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Brand Filter Buttons */}
        <View style={styles.filterContainer}>{brandFilterButtons}</View>
      </View>

      {/* Product List */}
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) =>
            item && item.id ? item.id.toString() : Math.random().toString()
          }
          numColumns={2}
          contentContainerStyle={styles.productListContainer}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  searchAndFilterContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  filterContainer: {
    height: 50, // Fixed height for filter container
  },
  brandFilterScrollContent: {
    paddingVertical: 5,
  },
  brandFilterButton: {
    marginRight: 10,
  },
  brandFilterButtonInner: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
  },
  activeBrandButton: {
    backgroundColor: "#99FF33",
  },
  brandFilterText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },
  activeBrandText: {
    color: "#FFFF33",
  },
  productListContainer: {
    paddingHorizontal: 5,
    paddingTop: 10, // Add some top padding to create space
  },
  productItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    alignItems: "center",
    position: "relative", // Quan trọng để hiển thị phần tử chéo góc
  },
  productImage: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 10,
  },
  dealBadge: {
    position: "absolute",
    top: 10, // Căn ở góc trên
    left: 10, // Căn ở góc phải
    backgroundColor: "#ff6347", // Màu nền nổi bật cho badge
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  dealText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
  },
  productBrand: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
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
});

export default HomeScreen;
