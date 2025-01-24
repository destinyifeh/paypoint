import {showMessage} from 'react-native-flash-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const paypointSuccessMessage = (title, description) => {
  console.log(description, 'dee');
  showMessage({
    message: title || 'Success',
    description: description,
    type: 'success',
    icon: props => <AntDesign name="checkcircle" color="white" size={18} />,
    titleStyle: {left: 5},
    duration: 5000,
  });
};

const paypointErrorMessage = (title = null, description) => {
  showMessage({
    message: title || 'Error',
    description: description,
    type: 'danger',
    icon: props => <MaterialIcons name="error" color="white" size={18} />,
    titleStyle: {left: 5},
    duration: 5000,
  });
};

export {paypointErrorMessage, paypointSuccessMessage};
