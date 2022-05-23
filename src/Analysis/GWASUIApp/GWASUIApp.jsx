import React, { useState, useEffect } from 'react';
import QuantitativeGWAS from "./QuantitativeGWAS";
import CaseControlGWAS from "./CaseControlGWAS";
import PropTypes from 'prop-types';
import {
  Checkbox, Card
} from 'antd';
import { fetchAndSetCsrfToken } from "../../configs"

const cardContent = { width: 300, margin: 10, textAlign: "center" };

const GWASUIApp = (props) => {
  const [gwasTypeSelected, setGwasTypeSelected] = useState(false);
  const [gwasType, setGwasType] = useState("");

  useEffect(() => {
    fetchAndSetCsrfToken().catch((err) => { console.log('error on csrf load - should still be ok', err); });
  }, [props]);

  if (!gwasTypeSelected) {
    return (<>
      <div className="GWASUI-typeSelector">
        <div>
          <Card title="Case Control GWAS" bordered={true} style={cardContent}>
            <p>Lorem ipsum dolor sit amet</p>
            <p>Ut enim ad minim veniam, quis nostrud</p>
            <p>exercitation ullamco laboris nisi ut aliquip.</p>
          </Card>
          <div style={cardContent}>
            <Checkbox onChange={() => {
              setGwasType("caseControl");
              setGwasTypeSelected(true);
            }}></Checkbox>
          </div>
        </div>
        <div>
          <Card title="Quantitative Phenotype" bordered={true} style={cardContent}>
            <p>Lorem ipsum dolor sit amet</p>
            <p>Ut enim ad minim veniam, quis nostrud</p>
            <p>exercitation ullamco laboris nisi ut aliquip.</p>
          </Card>
          <div style={cardContent}>
            <Checkbox onChange={() => {
              setGwasType("quantitative");
              setGwasTypeSelected(true);
            }
            }></Checkbox>
          </div>
        </div>
      </div>
    </>)
  }
  return (
    <React.Fragment>
      {gwasTypeSelected && gwasType === "caseControl" && (<CaseControlGWAS></CaseControlGWAS>)}
      {gwasTypeSelected && gwasType === "quantitative" && (<QuantitativeGWAS refreshWorkflows={props.refreshWorkflows}></QuantitativeGWAS>)}
    </React.Fragment>
  )
};


GWASUIApp.propTypes = {
  userAuthMapping: PropTypes.object.isRequired,
  refreshWorkflows: PropTypes.func.isRequired,
};

export default GWASUIApp;
