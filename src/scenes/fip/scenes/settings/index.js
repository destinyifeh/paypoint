import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {InteractionManager, View} from 'react-native';
import ActivityIndicator from '../../../../components/activity-indicator';
import {COLOUR_BLUE} from '../../../../constants/styles';
import Routes from './routes';

export default class SettingsScene extends React.Component {
  persistenceKey = 'settingsScenePersistenceKey';

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
    if (!this.state.animationsDone) {
      return (
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={COLOUR_BLUE} />
        </View>
      );
    }

    return (
      <Routes
        loadNavigationState={this.loadNavigationState}
        persistNavigationState={this.persistNavigationState}
        renderLoadingExperimental={() => <ActivityIndicator />}
      />
    );
  }
}
