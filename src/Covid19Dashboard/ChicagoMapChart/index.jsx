import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { mapboxAPIToken, covid19DashboardConfig } from '../../localconf';
import ControlPanel from '../ControlPanel';

import communityData from '../data/chicago_communities';
// import zipData from '../data/il_illinois_zip_codes_geo.min';
// The following is a truncated zipcode file containing entries
// only for northen IL to save space/time
import zipData from '../data/north';
import countyData from '../data/us_counties';
// These are static data from the American Community Survey
import popData from '../data/2015-2019-acs-il_zcta';

import PopulationIL, { dataLegend as populationLegend } from '../overlays/PopulationIL';
import InsuredLayer, { dataLegend as insuredLegend } from '../overlays/InsuredLayer';
import UnemployedLayer, { dataLegend as unemployedLegend } from '../overlays/UnemployedLayer';
import IncomeLayer, { dataLegend as incomeLegend } from '../overlays/IncomeLayer';

// Vaccination data by zipcode
import VaccinatedFirstLayer, { dataLegend as firstDoseLegend } from '../overlays/VaccinatedFirstLayer';
import VaccinatedFullLayer, { dataLegend as fullyVaccinatedLegend } from '../overlays/VaccinatedFullLayer';
// Confirmed cases and test performed by zipcode
import CaseLayer, { dataLegend as confirmedCasesLegend } from '../overlays/CaseLayer';
import TestLayer, { dataLegend as totalTestedLegend } from '../overlays/TestLayer';
// import TimeCaseLayer from '../overlays/TimeCaseLayer';
// import MobilityLayer from '../overlays/GoogleMobilityLayer';
// import MobilityLayerGnp from '../overlays/GoogleMobilityLayerGnp';
// import MobilityLayerPrk from '../overlays/GoogleMobilityLayerPrk';
// import MobilityLayerWrk from '../overlays/GoogleMobilityLayerWrk';
// import MobilityLayerTrn from '../overlays/GoogleMobilityLayerTrn';
// import MobilityLayerRes from '../overlays/GoogleMobilityLayerRes';

// import MapSlider from '../MapSlider';
import Spinner from '../../components/Spinner';

// check the data commons url to check if prod or qa environment
// pull data from qa for everything that is not prod
const occEnv = covid19DashboardConfig.dataUrl === 'https://opendata.datacommons.io/' ? 'prod' : 'qa';

// This allows the setMapLegendColors() function to be fully generalized
const dataLegends = {
  fullyVaccinated: fullyVaccinatedLegend,
  firstDose: firstDoseLegend,
  confirmedCases: confirmedCasesLegend,
  totalTested: totalTestedLegend,
  insured: insuredLegend,
  unemployed: unemployedLegend,
  population: populationLegend,
  medianIncome: incomeLegend,
};

class ChicagoMapChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapSize: {
        width: '100%',
        height: '100%',
      },
      viewport: {
        // start centered on Chicago
        longitude: -87.95, // -87.6 is longitude of Chicago, but so much lake...
        latitude: 41.9,
        zoom: 9.5,
        bearing: 0,
        pitch: 0,
      },
      hoverInfo: null,
      overlay_layers: {
        vaccination_layers: {
          title: 'Vaccine',
          layers: {
            firstDose: {
              title: 'First Dose',
            },
            fullyVaccinated: {
              title: 'Fully Vaccinated',
            },
          },
        },
        case_layers: {
          title: 'Cases & Testing',
          layers: {
            confirmedCases: {
              title: 'Confirmed Cases',
            },
            totalTested: {
              title: 'Tests Performed',
            },
          },
        },
        demographic_layers: {
          title: 'Demographics',
          layers: {
            population: { title: 'Population' },
            medianIncome: { title: 'Median Income' },
            insured: { title: 'Percent Insured' },
            unemployed: { title: 'Percent Unemployed' },
          },
        },
        /*
        mobility_layers: {
          title: 'Mobility',
          layers: {
            mobility_rnr: { title: 'Retail & Recreation' },
            mobility_gnp: { title: 'Grocery & Pharmacy' },
            mobility_prk: { title: 'Parks' },
            mobility_trn: { title: 'Transit Stations' },
            mobility_wrk: { title: 'Workplaces' },
            mobility_res: { title: 'Residential' },
          },
        },
      */
      },
      popup_data: {
        /*
        This data is used just for the popup on hover */
        strain_data: { title: 'SARS-CoV-2 Strain Data', visible: 'none' },
        vaccine_data: { title: 'COVID Vaccination Data', visible: 'none' },
        // mobility_data : {title: 'Mobility Data', visible: 'none'},
      },
      // sliderValue: null,
      // sliderDate: '2021-10-23',
      // sliderDataLastUpdated: null,
      // sliderDataStartDate: null,
      activeLayer: 'fullyVaccinated',
      vaccine_data: { data: null, fetchStatus: null },
      case_data: { data: null, fetchStatus: null, lastUpdated: null },
      // strainData: { data: null, fetchStatus: null },
      lastUpdated: null,
      // dataDateRange: {},
      mapColors: null,
    };
    this.mapData = {
      densityGeoJson: null,
      colors: {},
      colorsAsList: null,
    };
  }

  componentDidUpdate() {
    if (!(this.mapData.colorsAsList === null)) {
      return;
    }
    //
    // Load vaccination data
    //
    this.setState({ vaccine_data: { data: null, fetchStatus: 'fetching' } }); // eslint-disable-line react/no-did-update-set-state
    fetch(`https://covd-map-occ-prc-${occEnv}.s3.amazonaws.com/vaccination_by_zipcode_data.json`, {
      headers: {
        'Cache-Control': `max-age=${(1000 * 60 * 60 * 24)}`, // set cache to expire after one day
      },
    })
      .then((resp) => resp.json())
      .then((baseData) => {
        const geoJson = this.addDataToGeoJsonBase(
          baseData,
          'zipcode',
          (data, location) => {
            const date = Object.keys(data[location.properties.ZCTA5CE10])[0];
            return data[location.properties.ZCTA5CE10][date];
          });
        this.setState({ vaccine_data: { data: geoJson, fetchStatus: 'done' } });
      })
      .catch((error) => {
        console.warn('Data not retrieved. Unable to display vaccination overlays', error); // eslint-disable-line no-console
        this.setState({ vaccine_data: { fetchStatus: 'error' } });
      });
    //
    // Load total cases and testing data
    //
    this.setState({ case_data: { data: null, fetchStatus: 'fetching' } }); // eslint-disable-line react/no-did-update-set-state, max-len
    fetch(`https://covd-map-occ-prc-${occEnv}.s3.amazonaws.com/COVIDExport_data.json`, {
      headers: {
        'Cache-Control': `max-age=${(1000 * 60 * 60 * 24)}`, // set cache to expire after one day
      },
    })
      .then((resp) => resp.json())
      .then((baseData) => {
        const updateDate = Object.keys(baseData['60000'])[0];
        const geoJson = this.addDataToGeoJsonBase(
          baseData,
          'zipcode',
          (data, location) => {
            const date = Object.keys(data[location.properties.ZCTA5CE10])[0];
            return data[location.properties.ZCTA5CE10][date];
          });
        this.setState({ case_data: { data: geoJson, fetchStatus: 'done', lastUpdated: updateDate } });
      })
      .catch((error) => {
        console.warn('Data not retrieved. Unable to display COVID case & testing overlays', error); // eslint-disable-line no-console
        this.setState({ case_data: { fetchStatus: 'error' } });
      });
    // set colors based on activeLayer
    this.setMapLegendColors(this.state.activeLayer);

    this.mapData.colorsAsList = Object.entries(this.mapData.colors)
      .map((item) => [+item[0], item[1]]).flat();

    this.setState({ mapColors: this.mapData.colors }); // eslint-disable-line react/no-did-update-set-state, max-len

    // data fetch status added to prevent multiple requests
    // generally browers are smart enough to cache the requests
    // but this adds an extra layer of security
    //    if (!this.state.vaccination_data.fetchStatus) {
    //      this.addVaccinationDataToGeoJsonBase();
    //    }
  }

  onHover = (event) => {
    if (!event.features) { return; }
    let hoverInfo = null;
    // const formatNumberToDisplay = (rawNum) => {
    //  if (rawNum && rawNum !== 'null') {
    //    if (typeof rawNum === 'number') {
    //      return rawNum.toLocaleString();
    //    }
    //    return rawNum;
    //  }
    //  // Default if missing
    //  return 0;
    // };

    event.features.forEach((feature) => {
      if (!(feature.layer.id.startsWith('V_') || feature.layer.id.startsWith('C_') || feature.layer.id.startsWith('D_'))) {
        return;
      }
      let locationName = 'undefined';
      if ((feature.layer.id.startsWith('V_') || feature.layer.id.startsWith('C_'))) {
        locationName = feature.properties.ZCTA5CE10;
        if (!locationName || locationName === 'undefined') {
          // we don't have data for this location
          return;
        }
      }
      if (feature.layer.id.startsWith('V_')) {
        const firstRate = feature.properties.FirstDoseRateDisplay;
        const fullRate = feature.properties.FullyVaccinatedRateDisplay;
        hoverInfo = {
          lngLat: event.lngLat,
          locationName,
          values: {
            'First dose rate:': `${firstRate}%`,
            'Fully vaccinated rate:': `${fullRate}%`,
          },
        };
      }
      if (feature.layer.id.startsWith('C_')) {
        const { confirmedCases } = feature.properties;
        const { totalTested } = feature.properties;
        hoverInfo = {
          lngLat: event.lngLat,
          locationName,
          values: {
            'Total cases:': confirmedCases,
            'Total tests:': totalTested,
          },
        };
      }
      // This has to be FIPS for the POP data.
      locationName = feature.properties.FIPS;
      if (!locationName || locationName === 'undefined') {
        // we don't have data for this location
        return;
      }
      if (feature.layer.id.startsWith('D_')) {
        const populationCount = feature.properties['Total Population'];
        const medianIncome = feature.properties['Median Household Income'];
        const insuredRate = feature.properties['Percent Health Insurance'];
        const unemployedRate = feature.properties['Percent Unemployment'];
        hoverInfo = {
          lngLat: event.lngLat,
          locationName,
          values: {
            'Population:': populationCount,
            'Median income:': `$${medianIncome}`,
            'Percent insured:': `${insuredRate}%`,
            'Percent unemployed:': `${unemployedRate}%`,
          },
        };
      }
    });
    this.setState({
      hoverInfo,
    });
  };

  onClick = (event) => {
    if (!event.features) { return; }

    event.features.forEach((feature) => {
      if (feature.layer.id === 'time-data') {
        const title = `${feature.properties.COUNTYNAME}, ${feature.properties.STATE}`;
        this.props.fetchTimeSeriesData(
          'county',
          feature.properties.FIPS,
          title,
          this.props.modeledFipsList.includes(feature.properties.FIPS),
        );
      }
    });
  }

  onDataSelect = (event, id) => {
    const newState = { ...this.state.popup_data };
    newState[id].visible = event.target.checked ? 'visible' : 'none';
    this.setState(newState);
  }

  onLayerSelect = (event, id) => {
    this.setState({ activeLayer: id });
    this.setMapLegendColors(id);
  }

  setMapLegendColors(id) {
    const colors = [];
    const legend = dataLegends[id];
    if (typeof legend === 'undefined') {
      return null;
    }
    const mode = typeof legend.mode !== 'undefined' ? legend.mode : '';
    const { stops } = legend;
    for (let i = 0; i < stops.length; i += 1) {
      if (i === 0 && stops[i][0]) {
        colors[i] = [`< ${stops[i][0].toString()}${mode}`, stops[i][1]];
      } else if (i === stops.length - 1) {
        colors[i] = [`> ${stops[i][0].toString()}${mode}`, stops[i][1]];
      } else {
        colors[i] = [`${stops[i][0].toString() + mode} - ${stops[i + 1][0].toString()}${mode}`, stops[i][1]];
      }
    }
    this.mapData.colors = colors;
    this.setState({
      mapColors: colors, legendTitle: legend.title, legendDataSource: legend.source, lastUpdated: null,
    });
    return true;
  }

  addDataToGeoJsonBase = (data, dataLevel, assignValues) => {
    let base = zipData;
    if (dataLevel === 'county') {
      base = {
        ...countyData,
        features: countyData.features.filter((f) => {
          if (f.properties.FIPS === '17999') {
          // Chicago (FIPS 17999) is separate from Cook county in
          // `countyData`, but not in JHU data. So don't display
          // Chicago separately:
            return false;
          }
          return true;
        }),
      };
    }
    const geoJson = {
      ...base,
      features: base.features.map((loc) => {
        const location = loc;
        if (location.properties.ZCTA5CE10 && location.properties.ZCTA5CE10 in data) {
          location.properties = Object.assign(
            assignValues(data, location),
            location.properties,
          );
          return location;
        }
        // no data for this location
        return location;
      }),
    };
    return geoJson;
  }

  renderHoverPopup() {
    const { hoverInfo } = this.state;
    if (hoverInfo) {
      return (
        <ReactMapGL.Popup
          longitude={hoverInfo.lngLat[0]}
          latitude={hoverInfo.lngLat[1]}
          closeButton={false}
        >
          <div className='location-info'>
            <h4>
              {hoverInfo.locationName}
            </h4>
            {
              Object.entries(hoverInfo.values).map(
                (val, i) => <p key={i}>{`${val[0]} ${val[1]}`}</p>,
              )
            }
          </div>
        </ReactMapGL.Popup>
      );
    }
    return null;
  }

  render() {
    return (
      <div className='map-chart map-chart-chi'>
        {this.state.mapColors
        && (
          <ControlPanel
            showMapStyle={false}
            showLegend
            formattedColors={this.state.mapColors}
            lastUpdated={this.state.lastUpdated}
            layers={this.state.overlay_layers}
            dataPoints={this.state.popup_data}
            activeLayer={this.state.activeLayer}
            onLayerSelectChange={this.onLayerSelect}
            onDataSelectChange={this.onDataSelect}
            legendTitle={this.state.legendTitle}
            legendDataSource={this.state.legendDataSource}
          />
        )}
        <ReactMapGL.InteractiveMap
          className='.map-chart__mapgl-map'
          mapboxApiAccessToken={mapboxAPIToken}
          mapStyle='mapbox://styles/mapbox/streets-v11'
          minZoom={6}
          maxZoom={13.5}
          {...this.state.viewport}
          {...this.state.mapSize} // after viewport to avoid size overwrite
          onViewportChange={(viewport) => {
            this.setState({ viewport });
          }}
          onHover={this.onHover}
          // onClick={this.onClick}
          dragRotate={false}
          touchRotate={false}
        >
          {this.renderHoverPopup()}
          {this.state.activeLayer.includes('case_data') && this.state.case_data.fetchStatus === 'fetching' && <Spinner text={'Downloading case and testing data'} />}
          {this.state.activeLayer.includes('vaccine_data') && this.state.vaccine_data.fetchStatus === 'fetching' && <Spinner text={'Downloading vaccination data'} />}

          {this.state.vaccine_data.fetchStatus === 'done' && <VaccinatedFullLayer visibility={this.state.activeLayer === 'fullyVaccinated' ? 'visible' : 'none'} data={this.state.vaccine_data.data} item={this.state.activeLayer} />}
          {this.state.vaccine_data.fetchStatus === 'done' && <VaccinatedFirstLayer visibility={this.state.activeLayer === 'firstDose' ? 'visible' : 'none'} data={this.state.vaccine_data.data} item={this.state.activeLayer} />}
          {this.state.case_data.fetchStatus === 'done' && <CaseLayer visibility={this.state.activeLayer === 'confirmedCases' ? 'visible' : 'none'} data={this.state.case_data.data} />}
          {this.state.case_data.fetchStatus === 'done' && <TestLayer visibility={this.state.activeLayer === 'totalTested' ? 'visible' : 'none'} data={this.state.case_data.data} />}
          <PopulationIL visibility={this.state.activeLayer === 'population' ? 'visible' : 'none'} data={popData} />
          <InsuredLayer visibility={this.state.activeLayer === 'insured' ? 'visible' : 'none'} data={popData} />
          <UnemployedLayer visibility={this.state.activeLayer === 'unemployed' ? 'visible' : 'none'} data={popData} />
          <IncomeLayer visibility={this.state.activeLayer === 'medianIncome' ? 'visible' : 'none'} data={popData} />

          <ReactMapGL.Source type='geojson' data={communityData}>
            <ReactMapGL.Layer
              id='community-outline'
              type='line'
              beforeId='waterway-label'
              paint={{
                'line-color': '#002200',
                'line-width': 1.5,
              }}
            />
          </ReactMapGL.Source>
          <ReactMapGL.Source type='geojson' data={zipData}>
            <ReactMapGL.Layer
              id='zipcode-outline'
              type='line'
              beforeId='community-outline'
              paint={{
                'line-color': '#222258',
                'line-width': 0.5,
              }}
            />
          </ReactMapGL.Source>
        </ReactMapGL.InteractiveMap>

      </div>
    );
  }
}

ChicagoMapChart.propTypes = {
  modeledFipsList: PropTypes.array.isRequired,
  fetchTimeSeriesData: PropTypes.func.isRequired,
};

export default ChicagoMapChart;
