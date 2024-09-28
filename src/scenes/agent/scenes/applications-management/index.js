import React from 'react';
import {InteractionManager} from 'react-native';
import ActivityIndicator from '../../../../components/activity-indicator';
import Routes from './routes';

export default class ApplicationsManagementScene extends React.Component {
  state = {};

  persistenceKey = 'ApplicationsManagementScenePersistenceKey';

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  }

  render() {
    if (!this.state.animationsDone) {
      return <ActivityIndicator />;
    }

    return <Routes />;
  }
}
