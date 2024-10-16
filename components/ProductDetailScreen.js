import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  addFeedback,
  fetchProducts,
  toggleFavorite,
} from "../src/redux/productsSlice";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  const dispatch = useDispatch();

  const product = useSelector((state) =>
    state.products.items.find((item) => item.id === productId)
  );

  const favorites = useSelector((state) => state.products.favorites);
  const isFavorite = favorites.some((fav) => fav.id === productId);

  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [filterRating, setFilterRating] = useState(0);

  // Animation reference for favorite button
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Reload products nếu sản phẩm không tìm thấy
  useEffect(() => {
    if (!product) {
      dispatch(fetchProducts());
    }
  }, [dispatch, product]);

  // Hàm toggle favorite
  const handleToggleFavorite = (product) => {
    dispatch(toggleFavorite(product));

    // Animation khi nhấn nút favorite
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Hiển thị thông báo
    Alert.alert(
      isFavorite ? "Đã Bỏ Yêu Thích" : "Đã Thêm Vào Yêu Thích",
      isFavorite
        ? `${product.artName} đã được loại bỏ khỏi danh sách yêu thích.`
        : `${product.artName} đã được thêm vào danh sách yêu thích.`
    );
  };

  // Hàm submit feedback
  const submitFeedback = () => {
    if (feedback.trim() && rating > 0) {
      const newFeedback = {
        rating,
        author: "Guest", // Bạn có thể thay đổi để lấy tên người dùng
        comment: feedback.trim(),
      };

      dispatch(addFeedback({ productId, feedback: newFeedback }))
        .unwrap()
        .then(() => {
          Alert.alert("Feedback Đã Gửi", "Cảm ơn bạn đã góp ý!");
          setFeedback("");
          setRating(0);
        })
        .catch((err) => {
          Alert.alert("Lỗi", err || "Đã xảy ra lỗi!");
        });
    } else {
      Alert.alert("Lỗi", "Vui lòng nhập feedback và chọn rating.");
    }
  };

  // Đặt rating
  const handleRating = (newRating) => {
    setRating(newRating);
  };

  // Lọc feedback theo rating
  const filteredFeedback =
    filterRating > 0
      ? product.feedback.filter((fb) => fb.rating === filterRating)
      : product.feedback;

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

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hình ảnh sản phẩm */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: product.image
                ? product.image
                : "https://via.placeholder.com/350",
            }}
            style={styles.productImage}
          />
        </View>

        {/* Chi tiết sản phẩm */}
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>
            {product.artName || "Sản phẩm không tên"}
          </Text>

          {/* Giá và nút favorite */}
          <View style={styles.priceFavoriteContainer}>
            <Text style={styles.productPrice}>
              ${product.price !== undefined ? product.price.toFixed(2) : "N/A"}
            </Text>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => handleToggleFavorite(product)}
              >
                <Icon
                  name={isFavorite ? "heart" : "heart-o"}
                  size={24}
                  color={isFavorite ? "#ff6347" : "#D3D3D3"}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Text style={styles.productDescription}>
            {product.description || "Không có mô tả sản phẩm."}
          </Text>
        </View>

        {/* Thuộc tính sản phẩm */}
        <View style={styles.attributesContainer}>
          <View style={styles.attributeItem}>
            <Icon name="tag" size={16} />
            <Text style={styles.attributeText}>Brand:</Text>
            <Text style={styles.attributeText}>
              {product.brand || "Không rõ"}
            </Text>
          </View>
          <View style={styles.attributeItem}>
            <MaterialIcons
              name="production-quantity-limits"
              size={24}
              color="black"
            />
            <Text style={styles.attributeText}>limited Time Deal:</Text>
            <Text style={styles.attributeText}>
              {product.limitedTimeDeal || "Don't have"}
            </Text>
          </View>
          <View style={styles.attributeItem}>
            <MaterialIcons name="layers" size={24} color="#1E90FF" />
            <Text style={styles.attributeText}>Glass Surface:</Text>
            <Text style={styles.attributeText}>
              {product.glassSurface ? "Yes" : "No"}
            </Text>
          </View>
        </View>

        {/* Phần Feedback */}
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackHeader}>Feedback</Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Viết feedback của bạn ở đây"
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
          />
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                <Icon
                  name={star <= rating ? "star" : "star-o"}
                  size={24}
                  color="#ff6347"
                />
              </TouchableOpacity>
            ))}
          </View>
          {/* <Button title="Send Feedback" onPress={submitFeedback} /> */}
          <TouchableOpacity style={styles.buttonFB} onPress={submitFeedback}>
            <Text style={styles.buttonTextFB}>Send Feedback</Text>
          </TouchableOpacity>
          {/* Thay thế nút Show Feedback bằng icon */}
          <TouchableOpacity
            style={styles.feedbackIconButton}
            onPress={() => setShowFeedbackModal(true)}
          >
            <Icon name="comments" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Feedback */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showFeedbackModal}
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Feedback</Text>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Lọc theo Rating:</Text>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setFilterRating(star)}
                style={[
                  styles.filterButton,
                  filterRating === star && styles.activeFilterButton,
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterRating === star && styles.activeFilterButtonText,
                  ]}
                >
                  {star} Sao
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setFilterRating(0)}
              style={[
                styles.filterButton,
                filterRating === 0 && styles.activeFilterButton,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterRating === 0 && styles.activeFilterButtonText,
                ]}
              >
                Tất cả
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredFeedback}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.feedbackItem}>
                <Text style={styles.feedbackAuthor}>{item.author}:</Text>
                <Text>{item.comment}</Text>
                <Text style={styles.feedbackRating}>{item.rating} Sao</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.noFeedbackText}>Không có feedback nào.</Text>
            }
          />
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setShowFeedbackModal(false)}
          >
            <Text style={styles.closeModalButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 20,
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
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  detailsContainer: {
    padding: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  priceFavoriteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6347",
  },
  favoriteButton: {
    padding: 10,
  },
  productDescription: {
    fontSize: 16,
    color: "#555",
    textAlign: "justify",
  },
  attributesContainer: {
    flexDirection: "column", // Giữ cấu trúc theo chiều dọc
    alignItems: "flex-start", // Căn các mục thuộc tính về phía trái
    padding: 15, // Thêm padding để tạo khoảng cách với cạnh container
    marginVertical: 15, // Tăng khoảng cách trên và dưới
    backgroundColor: "#f0f0f0", // Thêm màu nền nhẹ để nổi bật phần thông tin
    borderRadius: 10, // Bo góc cạnh cho container
    shadowColor: "#000", // Thêm bóng đổ cho cảm giác nổi bật
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Bóng đổ trên Android
  },
  attributeItem: {
    flexDirection: "row", // Giữ các phần tử trong mục theo chiều ngang
    alignItems: "center", // Căn giữa các phần tử theo chiều dọc
    marginBottom: 10, // Thêm khoảng cách giữa các mục
    paddingVertical: 5, // Thêm khoảng cách trên và dưới cho các mục
    paddingHorizontal: 10, // Thêm khoảng cách trái và phải cho các mục
    backgroundColor: "#ffffff", // Màu nền trắng cho các mục để làm rõ ràng
    borderRadius: 8, // Bo góc các mục
    shadowColor: "#000", // Bóng đổ nhẹ để nổi bật
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  attributeText: {
    marginLeft: 8, // Thêm khoảng cách giữa biểu tượng và text
    fontSize: 16, // Tăng kích thước chữ cho dễ đọc hơn
    color: "#333", // Giữ màu chữ tối để dễ đọc
    fontWeight: "600", // Tăng độ đậm chữ
  },

  feedbackContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  feedbackHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    minHeight: 60,
    textAlignVertical: "top",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  feedbackIconButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    alignSelf: "center",
    width: 50,
    height: 50,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    marginRight: 10,
    alignSelf: "center",
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ff6347",
    margin: 5,
  },
  activeFilterButton: {
    backgroundColor: "#ff6347",
  },
  filterButtonText: {
    color: "#ff6347",
  },
  activeFilterButtonText: {
    color: "#fff",
  },
  feedbackItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  feedbackAuthor: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  feedbackRating: {
    color: "#ff6347",
    marginTop: 5,
  },
  closeModalButton: {
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeModalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  noFeedbackText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
    fontSize: 16,
  },
  buttonFB: {
    backgroundColor: "#FFA500", // Màu cam sáng cho nổi bật
    paddingVertical: 15, // Tạo độ dày cho nút
    paddingHorizontal: 25, // Tạo không gian ngang cho nút
    borderRadius: 30, // Bo tròn nút
    alignItems: "center", // Canh giữa text theo chiều ngang
    shadowColor: "#000", // Màu cho shadow
    shadowOffset: { width: 0, height: 2 }, // Đổ bóng dưới nút
    shadowOpacity: 0.2, // Độ mờ của bóng
    shadowRadius: 4, // Bán kính của bóng
    elevation: 5, // Tạo hiệu ứng nổi trên Android
  },
  buttonTextFB: {
    color: "#FFF", // Màu chữ trắng để nổi bật trên nền cam
    fontSize: 18, // Kích thước chữ vừa phải
    fontWeight: "bold", // Chữ đậm để dễ nhìn hơn
  },
});

export default ProductDetailScreen;
