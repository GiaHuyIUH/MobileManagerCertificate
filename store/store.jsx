import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Sử dụng AsyncStorage cho React Native
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice";
import walletReducer from './slices/walletSlice';

// Cấu hình persist với AsyncStorage
const persistConfig = {
  key: "root",
  storage: AsyncStorage, // Thay đổi từ storage mặc định sang AsyncStorage
};

// Kết hợp các reducer
const rootReducer = combineReducers({
  auth: authReducer,
  courses: courseReducer,
  wallet: walletReducer,
});

// Tạo persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store với persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt serializable check cho redux-persist
    }),
});

// Tạo persistor cho store
export const persistor = persistStore(store);
export default store;
