import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox, Card, Space,
} from 'antd';
import { fetchAndSetCsrfToken } from '../../configs';
import GWASQuantitative from '../GWASWizard/GWASQuantitative';
import GWASCaseControl from '../GWASWizard/GWASCaseControl';

const cardContent = {
  width: 350, height: 280, margin: 10, textAlign: 'center',
};

const GWASUIApp = (props) => {
  const [gwasTypeSelected, setGwasTypeSelected] = useState(false);
  const [gwasType, setGwasType] = useState('');

  const resetGWASType = () => {
    setGwasType('');
    setGwasTypeSelected(false);
  };

  useEffect(() => {
    // eslint-disable-next-line no-console
    fetchAndSetCsrfToken().catch((err) => { console.log('error on csrf load - should still be ok', err); });
  }, [props]);

  if (!gwasTypeSelected) {
    return (
      <React.Fragment>
        <Space direction={'vertical'} style={{ width: '100%' }} align={'center'}>
          <div className='GWASUI-typeSelector'>
            <div>
              <Card title='Case Control GWAS' bordered style={cardContent}>
                <p>
                  Genome-wide association studies (GWAS) for a case-control study.
                  Here, the genotypes of roughly equal number of diseased (“cases”) and healthy (“controls”)
                  people are compared to determine which genetic variants are associated with the disease.
                  Cases are encoded as ‘1’ while controls are encoded as ‘0’ and a binary model is used.
                </p>
              </Card>
              <div style={cardContent}>
                <Checkbox onChange={() => {
                  setGwasType('caseControl');
                  setGwasTypeSelected(true);
                }}
                />
              </div>
            </div>
            <div>
              <Card title='Quantitative Phenotype' bordered style={cardContent}>
                <p>
                  Genome-wide association studies (GWAS) for quantitative phenotype.
                  Here, GWAS evaluates statistical association between genetic variation and a continuous phenotype.
                  A phenotype, also called a trait, can be any measured or observed property of an individual.
                </p>
              </Card>
              <div style={cardContent}>
                <Checkbox onChange={() => {
                  setGwasType('quantitative');
                  setGwasTypeSelected(true);
                }}
                />
              </div>
            </div>
          </div>
        </Space>

      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {gwasTypeSelected && gwasType === 'caseControl' && (
        <GWASCaseControl
          resetGWASType={resetGWASType}
          refreshWorkflows={props.refreshWorkflows}
        />
      )}
      {gwasTypeSelected && gwasType === 'quantitative' && (
        <GWASQuantitative
          resetGWASType={resetGWASType}
          refreshWorkflows={props.refreshWorkflows}
        />
      )}
    </React.Fragment>
  );
};

GWASUIApp.propTypes = {
  refreshWorkflows: PropTypes.func.isRequired,
};

export default GWASUIApp;
