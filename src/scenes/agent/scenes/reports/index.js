import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {InteractionManager} from 'react-native';
import NavigationService from '../../../../utils/navigation-service';
import SplashScene from '../../../splash';
import Routes from './routes';

export default class ReportsScene extends React.Component {
  state = {};

  persistenceKey = 'reportsScenePersistenceKey';

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
    return (
      <Routes
        loadNavigationState={this.loadNavigationState}
        onNavigationStateChange={NavigationService.onNavigationStateChange}
        persistNavigationState={this.persistNavigationState}
        renderLoadingExperimental={() => (
          <SplashScene animationDuration={500} delay={50} />
        )}
      />
    );
  }
}
