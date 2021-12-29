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
import popData from '../data/2015-2019-acs-il_zcta';
import PopulationIL from '../overlays/PopulationIL';

import VaccinatedFirstLayer, { dataLegend as vaccinatedFirstLegend } from '../overlays/VaccinatedFirstLayer';
import VaccinatedFullLayer, { dataLegend as vaccinatedFullLegend } from '../overlays/VaccinatedFullLayer';
import CaseLayer, { dataLegend as caseLegend } from '../overlays/CaseLayer';
import TestLayer, { dataLegend as testLegend } from '../overlays/TestLayer';
import InsuredLayer, { dataLegend as insuredLegend } from '../overlays/InsuredLayer';
import UnemployedLayer, { dataLegend as unemployedLegend } from '../overlays/UnemployedLayer';
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
            first_dose_rate: {
              title: 'First Dose',
            },
            fully_vaccinated_rate: {
              title: 'Fully Vaccinated',
            },
          },
        },
        case_layers: {
          title: 'Cases & Testing',
          layers: {
            confirmed_cases_count: {
              title: 'Confirmed Cases',
            },
            total_tested_count: {
              title: 'Tests Performed',
            },
          },
        },
        demographic_layers: {
          title: 'Demographics',
          layers: {
            total_population_count: { title: 'Population' },
            median_income: { title: 'Median Income' },
            insured_rate: { title: 'Percent Insured' },
            unemployed_rate: { title: 'Percent Unemployed' },
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
      activeLayer: 'fully_vaccinated_rate',
      activeLegend: VaccinatedFullLegend,
      legendTitle: vaccinatedFullLegend.title,
      legendDataSource: vaccinatedFullLegend.source,
      vaccine_data: { data: null, fetchStatus: null },
      case_data: { data: null, fetchStatus: null, lastUpdated: null },
      strainData: { data: null, fetchStatus: null },
      lastUpdated: null,
      dataDateRange: {},
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
    this.setState({ case_data: { data: null, fetchStatus: 'fetching' } });
    fetch(`https://covd-map-occ-prc-${occEnv}.s3.amazonaws.com/COVIDExport_data.json`, {
      headers: {
        'Cache-Control': `max-age=${(1000 * 60 * 60 * 24)}`, // set cache to expire after one day
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        const updateDate = Object.keys(data['60000'])[0];
        const geoJson = this.addDataToGeoJsonBase(
          data,
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
    this.mapData.colors = [
      [' 0% - 50%', '#FFF'],
      ['50% - 60%', '#a8dab5'],
      ['60% - 70%', '#81c995'],
      ['70% - 80%', '#5bb974'],
      ['80% - 85%', '#34a853'],
      ['85% - 90%', '#1e8e3e'],
      ['90% - 95%', '#0d652d'],
      ['95% +', '#0b4225'],
    ];

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

  findStartAndEndDates = (geoJson) => {
    // find first and last date
    const { dataDateRange } = this.state;
    geoJson.features.forEach((zipcode) => {
      Object.keys(zipcode.properties).forEach((currentValue) => {
        // sample data in [2021-10-22, 2021-10-23, 2021-10-24]
        // don't include any of the SDOH data

        // exit if no date hyphen
        if (currentValue.indexOf('-') === -1) {
          return;
        }
        // break id into data set and date
        // const [setName, dateString] = currentValue.split('_');
        const setName = 'vaccination';
        const dateString = currentValue;
        // if already set a max compare to that if not set
        if (Object.keys(dataDateRange).indexOf(setName) === -1) {
          dataDateRange[setName] = {
            min: dateString,
            max: dateString,
          };
        } else if (dataDateRange[setName].max < dateString) {
          dataDateRange[setName].max = dateString;
        } else if (dataDateRange[setName].min > dateString) {
          dataDateRange[setName].min = dateString;
        }
      });
    });
    this.setState({ dataDateRange });
  }

  onHover = (event) => {
    if (!event.features) { return; }
    let hoverInfo = null;
    const formatNumberToDisplay = (rawNum) => {
      if (rawNum && rawNum !== 'null') {
        if (typeof rawNum === 'number') {
          return rawNum.toLocaleString();
        }
        return rawNum;
      }
      // Default if missing
      return 0;
    };

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
        const { confirmed_cases } = feature.properties;
        const { total_tested } = feature.properties;
        hoverInfo = {
          lngLat: event.lngLat,
          locationName,
          values: {
            'Total cases:': confirmed_cases,
            'Total tests:': total_tested,
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
        const population_count = feature.properties['Total Population'];
        const median_income = feature.properties['Median Household Income'];
        const insured_rate = feature.properties['Percent Health Insurance'];
        const unemployed_rate = feature.properties['Percent Unemployment'];
        hoverInfo = {
          lngLat: event.lngLat,
          locationName,
          values: {
            'Population:': population_count,
            'Median income:': `$${median_income}`,
            'Percent insured:': `${insured_rate}%`,
            'Percent unemployed:': `${unemployed_rate}%`,
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

  legendColors(legend) {
    const colors = [];
    for (var i = 0; i < legend.steps.length; i++) {
      if (i == 0) {
        colors[i] = ["< " + steps[i][0].toString() + legend.mode, steps[i][1]];
      } else if (i == steps.length - 1) {
        colors[i] = ["> " + steps[i][0].toString() + legend.mode, steps[i][1]];
      } else {
        colors[i] = [steps[i][0].toString() + legend.mode + " - " + steps[i+1][0].toString() + legend.mode, steps[i][1]];
      }
    }
  }

  setMapLegendColors(id) {
    if (id.includes('Rate')) {
      this.setState({
        mapColors: this.mapData.colors, legendTitle: 'Vaccination Rate', legendDataSource: { title: 'IDPH Vaccination Data', link: 'https://idph.illinois.gov/DPHPublicInformation/api/COVIDVaccine/getCOVIDVaccineAdministrationZIP' }, lastUpdated: null,
      });
    }
    if (id.includes('insured')) {
      const colors = insuredLegend.stops.map((x) => [`${x[0].toString()}%`, x[1]]);
      this.setState({
        mapColors: colors, legendTitle: insuredLegend.title,
        legendDataSource: { title: insuredLegend.legend_title,
        link: insuredLegend.legend_url }, lastUpdated: null,
      });
    }
    if (id.includes('confirmed')) {
      const colors = [
        ['0', '#FFF'],
        ['5', '#F7F787'],
        ['10', '#EED322'],
        ['50', '#E6B71E'],
        ['100', '#DA9C20'],
        ['150', '#CA8323'],
        ['200', '#B86B25'],
        ['250', '#A25626'],
        ['300', '#8B4225'],
        ['350+', '#850001'],
      ];
      this.setState({
        mapColors: colors, legendTitle: 'Cases & Testing', legendDataSource: { title: 'IDPH Daily Data', link: 'https://idph.illinois.gov/DPHPublicInformation/api/COVIDExport/GetZip' }, lastUpdated: null,
      });
    }
    if (id.includes('tested')) {
      const colors = [
        ['0', '#FFF'],
        ['1000', '#F7F787'],
        ['2000', '#EED322'],
        ['5000', '#E6B71E'],
        ['10000', '#DA9C20'],
        ['20000', '#CA8323'],
        ['50000', '#B86B25'],
        ['100000', '#A25626'],
        ['200000', '#8B4225'],
        ['500000+', '#850001'],
      ];
      this.setState({
        mapColors: colors, legendTitle: 'Cases & Testing', legendDataSource: { title: 'IDPH Daily Data', link: 'https://idph.illinois.gov/DPHPublicInformation/api/COVIDExport/GetZip' }, lastUpdated: null,
      });
    }
    if (id.includes('mobility_')) {
      const colors = [
        ['-100% to -80%', '#FFF'],
        ['-80% to -60%', '#F7F787'],
        ['-60% to -40%', '#EED322'],
        ['-40% to -20%', '#E6B71E'],
        ['-20% to 0%', '#DA9C20'],
        ['0% to 20%', '#CA8323'],
        ['20% to 40%', '#B86B25'],
        ['40% to 60%', '#A25626'],
        ['60% to 80%', '#8B4225'],
        ['80% to 100% +', '#850001'],
        ['No Data Available', '#5f5d59'],
      ];
      this.setState({
        mapColors: colors, legendTitle: 'Vaccination Data', legendDataSource: { title: 'IDPH Vaccination Data', link: 'https://idph' }, lastUpdated: null,
      });
    }
  }

  addDataToGeoJsonBase(data, dataLevel, assignValues) {
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
          {this.state.vaccine_data.fetchStatus === 'done' && <VaccinatedFullLayer visibility={this.state.activeLayer === 'fully_vaccinated_rate' ? 'visible' : 'none'} data={this.state.vaccine_data.data} item={this.state.activeLayer} />}
          {this.state.vaccine_data.fetchStatus === 'done' && <VaccinatedFirstLayer visibility={this.state.activeLayer === 'first_dose_rate' ? 'visible' : 'none'} data={this.state.vaccine_data.data} item={this.state.activeLayer} />}
          {this.state.case_data.fetchStatus === 'done' && <CaseLayer visibility={this.state.activeLayer === 'confirmed_cases_count' ? 'visible' : 'none'} data={this.state.case_data.data} />}
          {this.state.case_data.fetchStatus === 'done' && <TestLayer visibility={this.state.activeLayer === 'total_tested_count' ? 'visible' : 'none'} data={this.state.case_data.data} />}
          <PopulationIL visibility={this.state.activeLayer === 'total_population_count' ? 'visible' : 'none'} data={popData} />
          <InsuredLayer visibility={this.state.activeLayer === 'insured_rate' ? 'visible' : 'none'} data={popData} />
          <UnemployedLayer visibility={this.state.activeLayer === 'unemployed_rate' ? 'visible' : 'none'} data={popData} />

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
  modeledFipsList: PropTypes.array,
  fetchTimeSeriesData: PropTypes.func.isRequired,
};

export default ChicagoMapChart;
