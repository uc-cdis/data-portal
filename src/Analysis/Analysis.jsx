import React from 'react';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import { config } from '../params';
import { fetchArrangerGraphQL } from '../actions';
import { analysisApps } from '../configs';
import AnalysisApp from './AnalysisApp';
import AppCard from './AppCard';
import './Analysis.less';

class Analysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: null
    }
  }

  componentDidMount() {
    this.fetchGWASOrganOptions();
  }

  fetchGWASOrganOptions = async () => {
    return fetchArrangerGraphQL({
      query: '{ patients{ aggregations { Oncology_Primary__ICDOSite { buckets { key } } } } }'
    }).then(organs => {
      const result =  organs.data.patients.aggregations.Oncology_Primary__ICDOSite.buckets.map(bucket => ({ label: bucket.key, value: bucket.key }))
      this.setState({ options: result });
    });
  }

  openApp = app => {
    console.log('opening', app)
    this.props.history.push(`/analysis/${app}`)
  }

  render() {
    const { job, submitJob } = this.props;
    const { options } = this.state;
    const apps = config.analysisTools;

    return (
      <div className='analysis'>
        {
          apps.map(elt => {
            const app = analysisApps[elt];
            console.log('app is', app);
            return (
              <div className='analysis__app-card' onClick={() => this.openApp(elt)}>
                <AppCard key={elt} title={app.title} description={app.description} imageUrl={app.image} />
              </div>
            )
          })
        }
      </div>

    );
  }
};

Analysis.propTypes = {
  job: PropTypes.object.isRequired,
  submitJob: PropTypes.func.isRequired,
};

export default Analysis;

/*
<React.Fragment>
  { options && apps.includes('ndhVirus') ? <AnalysisApp job={job} submitJob={submitJob} app={virusSimApp} /> : null }
  { options && apps.includes('vaGWAS') ? <AnalysisApp job={job} submitJob={submitJob} app={{...gwasApp, options}} /> : null }
</React.Fragment>
*/
