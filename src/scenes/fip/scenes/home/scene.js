import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {InteractionManager} from 'react-native';
import ActivityIndicator from '../../../../components/activity-indicator';
import NavigationService from '../../../../utils/navigation-service';
import Routes from './routes';

export default class HomeScreen extends React.Component {
  state = {};

  persistenceKey = 'fipHomeScreen';

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  }

  persistNavigationState = async navState => {
    try {
      await AsyncStorage.setItem(this.persistenceKey, JSON.stringify(navState));
    } catch (err) {
      // handle the error according to your needs
    }
  };

  loadNavigationState = async () => {
    const jsonString = await AsyncStorage.getItem(this.persistenceKey);
    return JSON.parse(jsonString);
  };

  render() {
    if (!this.state.animationsDone) {
      return <ActivityIndicator />;
    }

    return (
      <Routes
        loadNavigationState={this.loadNavigationState}
        onNavigationStateChange={NavigationService.onNavigationStateChange}
        persistNavigationState={this.persistNavigationState}
        renderLoadingExperimental={() => <ActivityIndicator />}
      />
    );
  }
}
