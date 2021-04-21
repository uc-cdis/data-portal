import React from 'react';
import Dropdown from '@gen3/ui-component/dist/components/Dropdown';
import { filterConfig, guppyConfig, fieldMapping } from './conf';
import ConnectedFilter from '../src/components/ConnectedFilter';
import AccessibleFilter from '../src/components/ConnectedFilter/AccessibleFilter';
import UnaccessibleFilter from '../src/components/ConnectedFilter/UnaccessibleFilter';
import GuppyWrapper from '../src/components/GuppyWrapper';

const TotalCountWidget = props => (
  <h4>
      Total Count:
    {props.totalCount}
  </h4>
);

class SwitchableFilterExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 'all-data',
    };
  }

  changeLevel(level) {
    this.setState({ level });
  }

  render() {
    return (
      <React.Fragment>
        <Dropdown>
          <Dropdown.Button>
            Access Level: "{this.state.level}"
          </Dropdown.Button>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => this.changeLevel('all-data')}>All Data</Dropdown.Item>
            <Dropdown.Item onClick={() => this.changeLevel('accessible')}>Accessible</Dropdown.Item>
            <Dropdown.Item onClick={() => this.changeLevel('unaccessible')}>Unaccessible</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {
          this.state.level === 'all-data' && (
            <div>
              <GuppyWrapper
                filterConfig={filterConfig}
                guppyConfig={guppyConfig}
                fieldMapping={fieldMapping}
              >
                <TotalCountWidget />
                <ConnectedFilter />
              </GuppyWrapper>
            </div>
          )
        }
        {
          this.state.level === 'accessible' && (
            <div>
              <GuppyWrapper
                filterConfig={filterConfig}
                guppyConfig={guppyConfig}
                fieldMapping={fieldMapping}
              >
                <TotalCountWidget />
                <AccessibleFilter />
              </GuppyWrapper>
            </div>
          )
        }
        {
          this.state.level === 'unaccessible' && (
            <div>
              <GuppyWrapper
                filterConfig={filterConfig}
                guppyConfig={guppyConfig}
                fieldMapping={fieldMapping}
              >
                <TotalCountWidget />
                <UnaccessibleFilter />
              </GuppyWrapper>
            </div>
          )
        }
      </React.Fragment>
    );
  }
}

export default SwitchableFilterExample;
