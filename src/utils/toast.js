import RNToast from 'react-native-toast-message'; // ← uncomment when installed

const show = ({ type, title, message }) => {
  RNToast.show({
    type,
    text1: title,
    text2: message,
    visibilityTime: 3000,
    position: 'top',
    topOffset: 50,
  });
};

const Toast = {
  success: (message, title = 'Success') =>
    show({ type: 'success', title, message }),
  error: (message, title = 'Error') => show({ type: 'error', title, message }),
  info: (message, title = 'Info') => show({ type: 'info', title, message }),
};

export default Toast;
