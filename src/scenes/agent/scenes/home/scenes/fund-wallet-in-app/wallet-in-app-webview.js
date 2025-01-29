import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import {
  paypointErrorMessage,
  paypointSuccessMessage,
} from '../../../../../../components/paypoint-flash-message';
import {WEBVIEW_FUNDING_URL} from '../../../../../../constants/api-resources';
import {retrieveAuthToken} from '../../../../../../utils/auth';
import {getDeviceDetails} from '../../../../../../utils/device';

export default function FundWalletInAppWebviewScene({navigation, route}) {
  const [loading, setLoading] = useState(true);
  const [deviceDetails, setDeviceDetails] = useState('');
  const [token, setToken] = useState('');
  console.log(route.params.currentAgent.username, 'despiradooo');
  const currentUser = route.params.currentAgent;
  const getToken = async () => {
    const {authToken} = await retrieveAuthToken();
    setToken(authToken);
  };

  useEffect(() => {
    getDeviceDetails().then(data => setDeviceDetails(data));
    getToken();
  }, []);

  const handleMessage = event => {
    try {
      const response = JSON.parse(event.nativeEvent.data);
      console.log('Payment Response:', response);
      if (response.key === 'Back') {
        return navigation.goBack();
      }

      if (response.key === 'success') {
        paypointSuccessMessage(null, 'Payment successful');
        return navigation.replace('HomeTabs');
      }

      if (response.key === 'error') {
        paypointErrorMessage(
          'Oops!',
          'Something went wrong, please try again.',
        );
        return navigation.replace('HomeTabs');
      }
    } catch (error) {
      console.error('Error parsing payment response:', error);
    }
  };

  if (!(token && currentUser && deviceDetails)) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator />
      </View>
    );
  }
  const uri = `${WEBVIEW_FUNDING_URL}?token=${token}&deviceId=${deviceDetails.deviceUuid}&username=${currentUser.username}`;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{uri}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        useWebKit={true}
        mixedContentMode="always"
        injectedJavaScriptBeforeContentLoaded={`
        (function() {
          console.log("Injected JavaScript running--Dez on it");
        })();
      `}
        onMessage={handleMessage}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
        onLoad={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.log('WebView loaded--Dez: ', nativeEvent);
        }}
        onLoadEnd={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.log('WebView load ended: ', nativeEvent);
        }}
        renderLoading={() => (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'white',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}>
            <ActivityIndicator />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
