import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {InteractionManager} from 'react-native';
import NavigationService from '../../../../utils/navigation-service';
import BaseScene from '../../../base-scene';
import SplashScene from '../../../splash';
import Routes from './routes';

export default class ServicesScene extends BaseScene {
  screen_name = 'Services';
  persistenceKey = 'servicesScenePersistenceKey';

  state = {};

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
        // loadNavigationState={this.loadNavigationState}
        onNavigationStateChange={NavigationService.onNavigationStateChange}
        // persistNavigationState={this.persistNavigationState}
        renderLoadingExperimental={() => (
          <SplashScene animationDuration={500} delay={50} />
        )}
      />
    );
  }
}
