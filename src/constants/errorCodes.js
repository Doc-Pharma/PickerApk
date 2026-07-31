// src/constants/errorCodes.js
// Machine-readable error codes the backend attaches to API error responses
// (as `code`) for failures the app needs to branch on, rather than matching
// on the human-readable `message` text. Kept in sync with picker-app-backend's
// PICKER_TASK_ERROR_CODE (src/constants/constants.js).
const ApiErrorCode = {
  ORDER_CANCELLED: 'ORDER_CANCELLED',
};

export default ApiErrorCode;
