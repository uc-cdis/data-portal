import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';
import { analysisApps } from '../localconf';
import AppCard from './AppCard';
import TeamProjectHeader from './SharedUtils/TeamProject/TeamProjectHeader/TeamProjectHeader';
import CheckForTeamProjectApplication from './SharedUtils/TeamProject/Utils/CheckForTeamProjectApplication';
import './Analysis.less';

class Analysis extends React.Component {
  openApp = (app) => {
    this.props.history.push(`/analysis/${encodeURIComponent(app)}`);
  };

  render() {
    return (
      <div className='analysis'>
        <Row>
          <Col flex='1 0 auto'>
            <h2 className='analysis__title'>Apps</h2>
          </Col>
          {CheckForTeamProjectApplication(analysisApps) && (
            <Col flex='1 0 auto'>
              <QueryClientProvider client={new QueryClient()} contextSharing>
                <TeamProjectHeader showButton />
              </QueryClientProvider>
            </Col>
          )}
        </Row>
        <div className='analysis-cards'>
          {Object.keys(analysisApps).map((appKey) => (
            <div
              key={appKey}
              className='analysis__app-card'
              onClick={() => this.openApp(appKey)}
              onKeyPress={() => this.openApp(appKey)}
              role='button'
              tabIndex={0}
            >
              <AppCard
                title={analysisApps[appKey].title}
                description={analysisApps[appKey].description}
                imageUrl={analysisApps[appKey].image}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

Analysis.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Analysis;
