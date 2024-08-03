import { createSlice } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';

// Initial state of the user slice
const initialState = {
    status: 'idle',
    loading: false,
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
    currentRole: (JSON.parse(localStorage.getItem('user')) || {}).role || null,
    currentToken: (JSON.parse(localStorage.getItem('user')) || {}).token || null,
    isLoggedIn: false,
    error: null,
    response: null,
    responseReview: null,
    responseProducts: null,
    responseSellerProducts: null,
    responseSpecificProducts: null,
    responseDetails: null,
    responseSearch: null,
    responseCustomersList: null,
    productData: [],
    sellerProductData: [],
    specificProductData: [],
    productDetails: {},
    productDetailsCart: {},
    filteredProducts: [],
    customersList: [],
};

// **Helper function to update cart details in local storage**
const updateCartDetailsInLocalStorage = (cartDetails) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    currentUser.cartDetails = cartDetails;
    localStorage.setItem('user', JSON.stringify(currentUser));
};

// **Helper function to update shipping data in local storage**
export const updateShippingDataInLocalStorage = (shippingData) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = {
        ...currentUser,
        shippingData: shippingData
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        authRequest: (state) => {
            state.status = 'loading'; // Set status to loading when an authentication request is made
        },
        underControl: (state) => {
            state.status = 'idle'; // Reset status and response on control
            state.response = null;
        },
        stuffAdded: (state) => {
            state.status = 'added'; // Set status to added
            state.response = null;
            state.error = null;
        },
        stuffUpdated: (state) => {
            state.status = 'updated'; // Set status to updated
            state.response = null;
            state.error = null;
        },
        updateFailed: (state, action) => {
            state.status = 'failed'; // Set status to failed
            state.responseReview = action.payload; // Set response review
            state.error = null;
        },
        updateCurrentUser: (state, action) => {
            state.currentUser = action.payload; // Update current user
            localStorage.setItem('user', JSON.stringify(action.payload)); // Store updated user in local storage
        },
        authSuccess: (state, action) => {
            localStorage.setItem('user', JSON.stringify(action.payload)); // Store authentication details in local storage
            state.currentUser = action.payload;
            state.currentRole = action.payload.role;
            state.currentToken = action.payload.token;
            state.status = 'success'; // Set status to success
            state.response = null;
            state.error = null;
            state.isLoggedIn = true; // Set logged in status
        },
        addToCart: (state, action) => {
            // Add or update product quantity in the cart
            const existingProduct = state.currentUser.cartDetails.find(
                (cartItem) => cartItem._id === action.payload._id
            );

            if (existingProduct) {
                existingProduct.quantity += 1; // Increase quantity if product already exists
            } else {
                const newCartItem = { ...action.payload };
                state.currentUser.cartDetails.push(newCartItem); // Add new product to cart
            }

            updateCartDetailsInLocalStorage(state.currentUser.cartDetails); // Update cart in local storage
        },
        removeFromCart: (state, action) => {
            // Remove or update product quantity in the cart
            const existingProduct = state.currentUser.cartDetails.find(
                (cartItem) => cartItem._id === action.payload._id
            );

            if (existingProduct) {
                if (existingProduct.quantity > 1) {
                    existingProduct.quantity -= 1; // Decrease quantity if more than 1
                } else {
                    const index = state.currentUser.cartDetails.findIndex(
                        (cartItem) => cartItem._id === action.payload._id
                    );
                    if (index !== -1) {
                        state.currentUser.cartDetails.splice(index, 1); // Remove product from cart
                    }
                }
            }

            updateCartDetailsInLocalStorage(state.currentUser.cartDetails); // Update cart in local storage
        },

        removeSpecificProduct: (state, action) => {
            // Remove a specific product from the cart
            const productIdToRemove = action.payload;
            state.currentUser.cartDetails = state.currentUser.cartDetails.filter(
                (cartItem) => cartItem._id !== productIdToRemove
            );

            updateCartDetailsInLocalStorage(state.currentUser.cartDetails); // Update cart in local storage
        },

        fetchProductDetailsFromCart: (state, action) => {
            // Fetch details of a specific product from the cart
            const productIdToFetch = action.payload;
            const productInCart = state.currentUser.cartDetails.find(
                (cartItem) => cartItem._id === productIdToFetch
            );

            if (productInCart) {
                state.productDetailsCart = { ...productInCart }; // Set product details
            } else {
                state.productDetailsCart = null;
            }
        },

        removeAllFromCart: (state) => {
            state.currentUser.cartDetails = []; // Clear the cart
            updateCartDetailsInLocalStorage([]); // Update cart in local storage
        },

        authFailed: (state, action) => {
            state.status = 'failed'; // Set status to failed
            state.response = action.payload; // Set response payload
            state.error = null;
        },
        authError: (state, action) => {
            state.status = 'error'; // Set status to error
            state.response = null;
            state.error = action.payload; // Set error payload
        },
        authLogout: (state) => {
            localStorage.removeItem('user'); // Remove user from local storage
            state.status = 'idle'; // Reset status
            state.loading = false;
            state.currentUser = null;
            state.currentRole = null;
            state.currentToken = null;
            state.error = null;
            state.response = true; // Set response to true (or you might want to change this)
            state.isLoggedIn = false; // Set logged out status
        },

        isTokenValid: (state) => {
            // Check if the token is valid
            if (state.currentToken) {
                try {
                    jwtDecode(state.currentToken); // Decode token
                    state.isLoggedIn = true; // Set logged in status
                } catch {
                    // If decoding fails, reset the state
                    localStorage.removeItem('user');
                    state.currentUser = null;
                    state.currentRole = null;
                    state.currentToken = null;
                    state.status = 'idle';
                    state.response = null;
                    state.error = null;
                    state.isLoggedIn = false;
                }
            } else {
                // If no token is available, reset the state
                localStorage.removeItem('user');
                state.currentUser = null;
                state.currentRole = null;
                state.currentToken = null;
                state.status = 'idle';
                state.response = null;
                state.error = null;
                state.isLoggedIn = false;
            }
        },

        getRequest: (state) => {
            state.loading = true; // Set loading status
        },
        getFailed: (state, action) => {
            state.response = action.payload; // Set response payload
            state.loading = false; // Stop loading
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false; // Stop loading
            state.error = action.payload; // Set error payload
        },

        getDeleteSuccess: (state) => {
            state.status = 'deleted'; // Set status to deleted
            state.loading = false; // Stop loading
            state.error = null;
            state.response = null;
        },

        productSuccess: (state, action) => {
            state.productData = action.payload; // Set product data
            state.responseProducts = null;
            state.loading = false; // Stop loading
            state.error = null;
        },
        getProductsFailed: (state, action) => {
            state.responseProducts = action.payload; // Set response for failed product fetch
            state.loading = false; // Stop loading
            state.error = null;
        },

        sellerProductSuccess: (state, action) => {
            state.sellerProductData = action.payload; // Set seller product data
            state.responseSellerProducts = null;
            state.loading = false; // Stop loading
            state.error = null;
        },
        getSellerProductsFailed: (state, action) => {
            state.responseSellerProducts = action.payload; // Set response for failed seller product fetch
            state.loading = false; // Stop loading
            state.error = null;
        },

        specificProductSuccess: (state, action) => {
            state.specificProductData = action.payload; // Set specific product data
            state.responseSpecificProducts = null;
            state.loading = false; // Stop loading
            state.error = null;
        },
        getSpecificProductsFailed: (state, action) => {
            state.responseSpecificProducts = action.payload; // Set response for failed specific product fetch
            state.loading = false; // Stop loading
            state.error = null;
        },

        productDetailsSuccess: (state, action) => {
            state.productDetails = action.payload; // Set product details
            state.responseDetails = null;
            state.loading = false; // Stop loading
            state.error = null;
        },
        getProductDetailsFailed: (state, action) => {
            state.responseDetails = action.payload; // Set response for failed product details fetch
            state.loading = false; // Stop loading
            state.error = null;
        },

        customersListSuccess: (state, action) => {
            state.customersList = action.payload; // Set customers list data
            state.responseCustomersList = null;
            state.loading = false; // Stop loading
            state.error = null;
        },

        getCustomersListFailed: (state, action) => {
            state.responseCustomersList = action.payload; // Set response for failed customers list fetch
            state.loading = false; // Stop loading
            state.error = null;
        },

        setFilteredProducts: (state, action) => {
            state.filteredProducts = action.payload; // Set filtered products
            state.responseSearch = null;
            state.loading = false; // Stop loading
            state.error = null;
        },
        getSearchFailed: (state, action) => {
            state.responseSearch = action.payload; // Set response for failed search
            state.loading = false; // Stop loading
            state.error = null;
        },
    },
});

// Export actions and reducer
export const {
  authRequest,
  underControl,
  stuffAdded,
  stuffUpdated,
  updateFailed,
  authSuccess,
  authFailed,
  //bug fix
  getCustomersListFailed,
  authError,
  authLogout,
  isTokenValid,
  getDeleteSuccess,
  getRequest,
  productSuccess,
  sellerProductSuccess,
  productDetailsSuccess,
  getProductsFailed,
  getSellerProductsFailed,
  getProductDetailsFailed,
  getFailed,
  getError,
  getSearchFailed,
  customersListSuccess,
  getSpecificProductsFailed,
  specificProductSuccess,
  addToCart,
  removeFromCart,
  removeSpecificProduct,
  removeAllFromCart,
  fetchProductDetailsFromCart,
  updateCurrentUser,
  setFilteredProducts,
} = userSlice.actions;

export const userReducer = userSlice.reducer;