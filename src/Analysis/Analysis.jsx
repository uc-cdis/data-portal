import React from 'react';
import PropTypes from 'prop-types';
import { config } from '../params';
import { analysisApps } from '../configs';
import AppCard from './AppCard';
import './Analysis.less';

class Analysis extends React.Component {
  openApp = (app) => {
    this.props.history.push(`/analysis/${app}`);
  }

  render() {
    const apps = config.analysisTools;

    return (
      <div className='analysis'>
        <h2 className='analysis__title'>Apps</h2>
        <div className='analysis-cards'>
          {
            apps.map((elt) => {
              const app = analysisApps[elt];
              return (
                <div
                  key={elt}
                  className='analysis__app-card'
                  onClick={() => this.openApp(elt)}
                  role='button'
                  tabIndex={0}
                >
                  <AppCard title={app.title} description={app.description} imageUrl={app.image} />
                </div>
              );
            })
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
