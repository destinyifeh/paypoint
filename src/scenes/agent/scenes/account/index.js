import React from 'react';
import {InteractionManager} from 'react-native';
import ActivityIndicator from '../../../../components/activity-indicator';
import Routes from './routes';

export default class AccountScene extends React.Component {
  state = {};

  persistenceKey = 'accountScenePersistenceKey';

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  }

  componentWillUnmount() {
    console.log('UNMOUNTING ');
  }

  render() {
    if (!this.state.animationsDone) {
      return <ActivityIndicator />;
    }

    return <Routes />;
  }
}
