import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "FAVORITES_KEY";

// Thunk để fetch sản phẩm
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get(
      "https://66f50da79aa4891f2a23ab51.mockapi.io/Artshope"
    );
    return response.data;
  }
);

// Thunk để load favorites từ AsyncStorage
export const loadFavorites = createAsyncThunk(
  "products/loadFavorites",
  async () => {
    try {
      const favoritesData = await AsyncStorage.getItem(FAVORITES_KEY);
      return favoritesData ? JSON.parse(favoritesData) : [];
    } catch (error) {
      throw new Error("Failed to load favorites");
    }
  }
);

// Thunk để toggle một sản phẩm trong favorites
export const toggleFavorite = createAsyncThunk(
  "products/toggleFavorite",
  async (product, { getState }) => {
    const { favorites } = getState().products;
    const isFavorite = favorites.some((fav) => fav.id === product.id);
    let updatedFavorites;

    if (isFavorite) {
      // Loại bỏ khỏi favorites
      updatedFavorites = favorites.filter((fav) => fav.id !== product.id);
    } else {
      // Thêm vào favorites
      updatedFavorites = [...favorites, product];
    }

    // Lưu favorites cập nhật vào AsyncStorage
    try {
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      throw new Error("Failed to update favorites");
    }

    return { favorites: updatedFavorites };
  }
);

// Thunk để xóa nhiều sản phẩm trong favorites
export const removeFavorites = createAsyncThunk(
  "products/removeFavorites",
  async (productIds, { getState }) => {
    const { favorites } = getState().products;
    const updatedFavorites = favorites.filter(
      (fav) => !productIds.includes(fav.id)
    );

    try {
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      throw new Error("Failed to remove selected favorites");
    }

    return { favorites: updatedFavorites };
  }
);

// Thunk để xóa tất cả sản phẩm trong favorites
export const clearFavorites = createAsyncThunk(
  "products/clearFavorites",
  async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      return { favorites: [] };
    } catch (error) {
      throw new Error("Failed to clear favorites");
    }
  }
);

// Thunk để thêm feedback vào sản phẩm
export const addFeedback = createAsyncThunk(
  "products/addFeedback",
  async ({ productId, feedback }, { rejectWithValue }) => {
    try {
      const productResponse = await axios.get(
        `https://66f50da79aa4891f2a23ab51.mockapi.io/Artshope/${productId}`
      );
      const product = productResponse.data;

      const updatedFeedback = product.feedback
        ? [...product.feedback, feedback]
        : [feedback];

      const updatedProductResponse = await axios.put(
        `https://66f50da79aa4891f2a23ab51.mockapi.io/Artshope/${productId}`,
        { feedback: updatedFeedback }
      );

      return updatedProductResponse.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Tạo slice sản phẩm
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    favorites: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchProducts lifecycle
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Handle loadFavorites lifecycle
      .addCase(loadFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.favorites = action.payload;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Handle toggleFavorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload.favorites;
      })

      // Handle removeFavorites
      .addCase(removeFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload.favorites;
      })

      // Handle clearFavorites
      .addCase(clearFavorites.fulfilled, (state, action) => {
        state.favorites = [];
      })

      // Handle addFeedback lifecycle
      .addCase(addFeedback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedProduct = action.payload;
        const index = state.items.findIndex(
          (product) => product.id === updatedProduct.id
        );
        if (index !== -1) {
          state.items[index] = updatedProduct;
        }
      })
      .addCase(addFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
