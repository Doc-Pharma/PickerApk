// src/navigation/routes.js
const Routes = {
  // Auth flow
  SPLASH: 'Splash',
  LOGIN: 'Login',
  OTP: 'OTP',

  // App update
  UPDATE: 'Update',

  // Main
  HOME: 'Home',

  // Profile
  PROFILE: 'Profile',

  // Past Orders
  PAST_ORDERS: 'PastOrders',
  PAST_ORDER_DETAIL: 'PastOrderDetail',

  // Put Away flow
  PUT_AWAY_DETAIL: 'PutAwayDetail',
  PUT_AWAY_SCAN_PRODUCT: 'PutAwayScanProduct',
  PUT_AWAY_QUANTITY: 'PutAwayQuantity',
  PUT_AWAY_SCAN_LOCATION: 'PutAwayScanLocation',
  PUT_AWAY_PLACED: 'PutAwayPlaced',
  PUT_AWAY_COMPLETE: 'PutAwayComplete',

  // Product qr scanning flow
  PRODUCT_QR_SCAN: 'ProductQrScan',
  PRODUCT_DETAILS: 'ProductDetails',
  PRODUCT_VERIFY_LOCATION: 'ProductVerifyLocation',

  // Picking flow
  PICKING_ORDER_DETAIL: 'PickingOrderDetail',
  PICKING_SCAN_PRODUCT: 'PickingScanProduct',
  PICKING_CONFIRM_ITEM: 'PickingConfirmItem',
  PICKING_REVIEW: 'PickingReview',
  PICKING_INVOICE: 'PickingInvoice',
  PICKING_COMPLETE: 'PickingComplete',
};

export default Routes;
