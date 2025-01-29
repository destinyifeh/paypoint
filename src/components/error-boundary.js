import React from 'react';

import {View} from 'react-native';

import {USER} from '../constants';
import {COLOUR_BLUE} from '../constants/styles';
import ContactUsOptionsMenu from '../fragments/contact-us-options-menu';
import NavigationService from '../utils/navigation-service';
import {loadData} from '../utils/storage';
import Button from './button';
import Text from './text';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false, isFip: false};
  }
  async componentDidMount() {
    this.loadAsyncUser();
  }
  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    console.reportErrorsAsExceptions = false;
    //log to firebase
  }

  loadAsyncUser = async () => {
    const currentUser = await loadData(USER);
    const parseUser = JSON.parse(currentUser);
    this.setState({isFip: parseUser.fipUser});
  };

  onNavigate = () => {
    if (this.state.isFip) {
      NavigationService.navigate('Fip');
    } else {
      NavigationService.navigate('CrashRescue');
    }
    this.setState({hasError: false});
  };

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: `${COLOUR_BLUE}CC`,
            flex: 1,
            height: '100%',
            justifyContent: 'center',
            padding: 20,
            position: 'absolute',
            width: '100%',
            zIndex: 1,
          }}>
          <ContactUsOptionsMenu
            ref_={component => (this.contactUsOptionsMenu = component)}
            requestClose={() => this.contactUsOptionsMenu.close()}
          />

          <Text bold center white>
            Oops!
          </Text>
          <Text bigger bold center white>
            An error occured.
          </Text>

          <Button
            containerStyle={{
              alignSelf: 'center',
              backgroundColor: 'white',
              marginTop: 30,
              width: '80%',
            }}
            title="Go Home"
            titleStyle={{
              color: COLOUR_BLUE,
            }}
            onPress={this.onNavigate}
          />
          <Button
            containerStyle={{
              alignSelf: 'center',
              backgroundColor: 'white',
              // marginTop: 30,
              width: '80%',
            }}
            title="Contact Support"
            transparent
            onPressOut={() => this.contactUsOptionsMenu.open()}
          />

          <View
            style={{
              bottom: 15,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              position: 'absolute',
              width: '100%',
            }}>
            <Button
              onPress={() => {
                NavigationService.replace('Logout');
              }}
              title="Logout"
              transparent
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
