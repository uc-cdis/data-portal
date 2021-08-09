import React from 'react';
import PropTypes from 'prop-types';
import { analysisApps } from '../localconf';
import AppCard from './AppCard';
import './Analysis.less';

class Analysis extends React.Component {
  openApp = (app) => {
    this.props.history.push(`/analysis/${encodeURIComponent(app)}`);
  }

  render() {
    return (
      <div className='analysis'>
        <h2 className='analysis__title'>Apps</h2>
        <div className='analysis-cards'>
          {
            Object.keys(analysisApps).map((appKey) => (
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
            ))
          }
        </div>
      </div>
    );
  }
}

Analysis.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Analysis;
