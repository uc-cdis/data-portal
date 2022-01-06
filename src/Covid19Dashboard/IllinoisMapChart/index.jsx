import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { mapboxAPIToken, covid19DashboardConfig } from '../../localconf';
import ControlPanel from '../ControlPanel';
import countyData from '../data/us_counties';
/*
// Additional layers used as examples enable here
import LayerTemplate from '../overlays/LayerTemplate';
import PopulationIL from '../overlays/PopulationIL'; */

import TimeCaseLayer from '../overlays/TimeCaseLayer';
import VaccinatedCaseLayer from '../overlays/TimeVaccinatedLayer';
import MobilityLayer from '../overlays/GoogleMobilityLayer';
import MobilityLayerGnp from '../overlays/GoogleMobilityLayerGnp';
import MobilityLayerPrk from '../overlays/GoogleMobilityLayerPrk';
import MobilityLayerWrk from '../overlays/GoogleMobilityLayerWrk';
import MobilityLayerTrn from '../overlays/GoogleMobilityLayerTrn';
import MobilityLayerRes from '../overlays/GoogleMobilityLayerRes';

import MapSlider from '../MapSlider';
import Spinner from '../../components/Spinner';

// check the data commons url to check if prod or qa environment
// pull data from qa for everything that is not prod
const occEnv = covid19DashboardConfig.dataUrl === 'https://opendata.datacommons.io/' ? 'prod' : 'qa';

function filterIllinoisCountiesGeoJson() {
  return {
    ...countyData,
    features: countyData.features.filter((f) => f.properties.STATE === 'IL' && f.properties.FIPS !== '17999'),
  };
}

function filterModeledCountiesGeoJson(illinoisCountiesGeoJson, selectedFips) {
  return {
    ...illinoisCountiesGeoJson,
    features: illinoisCountiesGeoJson.features.filter((f) => selectedFips.includes(f.properties.FIPS)),
  };
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

class IllinoisMapChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapSize: {
        width: '100%',
        height: '100%',
      },
      viewport: {
        // start centered on Chicago
        longitude: -90,
        latitude: 40,
        zoom: 6,
        bearing: 0,
        pitch: 0,
      },
      hoverInfo: null,
      overlay_layers: {
        /*
        // Additional layers used as examples enable here
        us_counties: { title: 'US Counties', visible: 'visible' },
        il_population: { title: 'IL Population', visible: 'visible' }, */
        vaccination_layers: {
          title: 'Vaccinations',
          layers: {
            V_time_data: { title: 'Vaccination Counts' },
          },
        },
        case_layers: {
          title: 'Cases & Deaths',
          layers: {
            C_time_data: { title: 'Case Counts' },
          },
        },
        mobility_layers: {
          title: 'Mobility',
          layers: {
            rnr_mobility_data: { title: 'Retail & Recreation' },
            gnp_mobility_data: { title: 'Grocery & Pharmacy' },
            prk_mobility_data: { title: 'Parks' },
            trn_mobility_data: { title: 'Transit Stations' },
            wrk_mobility_data: { title: 'Workplaces' },
            res_mobility_data: { title: 'Residential' },
          },
        },
      },
      popup_data: {
        /*
        This data is used just for the popup on hover */
        strain_data: { title: 'SARS-CoV-2 Strain Data', visible: 'none' },
        // mobility_data : {title: 'Mobility Data', visible: 'none'},
      },
      sliderValue: null,
      sliderDate: null,
      sliderDataLastUpdated: null,
      sliderDataStartDate: null,
      activeLayer: 'V_time_data',
      legendTitle: 'Vaccines Administered',
      legendDataSource: { title: 'Illinois Department of Public Health', link: 'http://www.dph.illinois.gov/' },

      mobility_data: { data: null, fetchStatus: null },
      time_data: { data: null, fetchStatus: null, lastUpdated: null },
      vaccine_data: { data: null, fetchStatus: null, lastUpdated: null },
      strainData: { data: null, fetchStatus: null },
      lastUpdated: null,
      dataDateRange: {},
      mapColors: null,
    };
    this.mapData = {
      illinoisCountiesGeoJson: null,
      modeledCountiesGeoJson: null,
      colors: {},
      colorsAsList: null,
    };
  }

  componentDidUpdate() {
    if (!this.state.time_data.fetchStatus && Object.entries(this.props.jsonByTime.il_county_list).length > 0) {
      const geoJson = this.addDataToGeoJsonBase(
        this.props.jsonByTime.il_county_list,
        (data, location) => {
          const dateProps = {};
          Object.entries(data[location.properties.FIPS].by_date).forEach((x) => {
            const [date, caseDeath] = x;

            dateProps[`C_${date}`] = typeof caseDeath.C === 'string' ? 0 : caseDeath.C;
            dateProps[`D_${date}`] = typeof caseDeath.D === 'string' ? 0 : caseDeath.D;
          });
          return dateProps;
        });

      this.setState({ // eslint-disable-line react/no-did-update-set-state, max-len
        time_data: {
          data: geoJson,
          lastUpdated: this.props.jsonByTime.last_updated,
          fetchStatus: 'done',
        },
        lastUpdated: this.props.jsonByTime.last_updated,
      });

      this.mapData.illinoisCountiesGeoJson = filterIllinoisCountiesGeoJson();
      this.mapData.modeledCountiesGeoJson = filterModeledCountiesGeoJson(
        this.mapData.illinoisCountiesGeoJson,
        this.props.modeledFipsList,
      );

      // Finds second highest value in data set
      // Second highest value is used to better balance distribution
      // Due to cook county being an extreme outlier
      const maxVal = geoJson.features
        .map((obj) => {
          const confirmedCases = obj.properties[`C_${this.props.jsonByTime.last_updated}`];
          // this is to handle <5 strings in dataset, makes it 0
          if (typeof confirmedCases === 'string') {
            return 0;
          }
          return confirmedCases;
        })
        .sort((a, b) => b - a)[1];// returning second highest value
        // check if maxVal is a number
      if (typeof maxVal !== 'number') {
        return;
      }
      const maxValExponent = Math.log10(maxVal);
      // Math to calculate Index range for map
      const colorRangeMath = (base) => {
        // applies maxValExponent to base then rounds down to greatest place
        const tempNum = Math.ceil(base ** maxValExponent);
        const roundingDigits = 10 ** (tempNum.toString().length - 1);

        return Math.floor(tempNum / roundingDigits) * roundingDigits;
      };

      this.mapData.colors = [
        [`0 - ${colorRangeMath(2)}`, '#FFF'],
        [`${colorRangeMath(2)} - ${colorRangeMath(3)}`, '#F7F787'],
        [`${colorRangeMath(3)} - ${colorRangeMath(4)}`, '#EED322'],
        [`${colorRangeMath(4)} - ${colorRangeMath(5)}`, '#E6B71E'],
        [`${colorRangeMath(5)} - ${colorRangeMath(6)}`, '#DA9C20'],
        [`${colorRangeMath(6)} - ${colorRangeMath(7)}`, '#CA8323'],
        [`${colorRangeMath(7)} - ${colorRangeMath(8)}`, '#B86B25'],
        [`${colorRangeMath(8)} - ${colorRangeMath(9)}`, '#A25626'],
        [`${colorRangeMath(9)} - ${colorRangeMath(10)}`, '#8B4225'],
        [`${colorRangeMath(10)} +`, '#850001'],
      ];
      this.mapData.colorsAsList = Object.entries(this.mapData.colors)
        .map((item) => [+item[0], item[1]]).flat();
    }

    if (!this.state.vaccine_data.fetchStatus && Object.entries(this.props.jsonVaccinated.il_county_list).length > 0) {
      const vaccineGeoJson = this.addDataToGeoJsonBase(
        this.props.jsonVaccinated.il_county_list,
        (data, location) => {
          const dateProps = {};
          const curentDatesObj = data[location.properties.FIPS].by_date;
          const datesKeyArr = Object.keys(curentDatesObj).sort();
          const endDate = new Date(datesKeyArr[datesKeyArr.length - 1]);
          let currentDateString = datesKeyArr[0];
          const currentDate = new Date(currentDateString);
          let yesterdaysData = 0;
          // data may not exist for every day but because it is cumulative we can fill in missing days
          while (currentDate <= endDate) {
            const tempCurentVacCount = curentDatesObj[currentDateString];
            // check if exists first and store value for future use if does not exist
            if (tempCurentVacCount) {
              dateProps[`V_${currentDateString}`] = typeof tempCurentVacCount === 'string' ? 0 : tempCurentVacCount;
              yesterdaysData = tempCurentVacCount;
            } else {
              // use old data
              dateProps[`V_${currentDateString}`] = yesterdaysData;
            }
            // increase to next day
            currentDate.setDate(currentDate.getDate() + 1);
            currentDateString = formatDate(currentDate);
          }
          return dateProps;
        });

      this.setState({ // eslint-disable-line react/no-did-update-set-state, max-len
        vaccine_data: {
          data: vaccineGeoJson,
          lastUpdated: this.props.jsonVaccinated.last_updated,
          fetchStatus: 'done',
        },
      });

      this.setSliderDates(this.state.activeLayer.split('_')[0]); this.setMapLegendColors(this.state.activeLayer);
    }

    // data fetch status added to prevent multiple requests
    // generally browers are smart enough to cache the requests
    // but this adds an extra layer of security
    if (!this.state.mobility_data.fetchStatus) {
      this.addMobilityDataToGeoJsonBase();
    }

    if (!this.state.strainData.fetchStatus) {
      this.addStrainDataToState();
    }
  }

  setSliderDates = (id) => {
    function msToDays(ms) {
      return Math.floor(ms / (1000 * 60 * 60 * 24));
    }
    if (!this.state.dataDateRange[id]) {
      return;
    }
    const currentDateRange = this.state.dataDateRange[id];
    const startDate = new Date(currentDateRange.min);
    const endDate = new Date(currentDateRange.max);

    const dateDiff = msToDays(endDate - startDate);
    let sliderValue;
    let { sliderDate } = this.state;
    if (sliderDate) {
      // match date when switching between data sets

      // calculate old dates position on new slider
      sliderValue = msToDays(new Date(sliderDate) - startDate);
      // if date does not exist in set, set to min date
      if (sliderValue < 0) {
        sliderValue = 0;
        sliderDate = formatDate(startDate);
      // else if date is too big
      } else if (sliderValue > dateDiff) {
        sliderValue = dateDiff;
        sliderDate = formatDate(endDate);
      }
    } else {
      sliderValue = dateDiff;
      sliderDate = formatDate(endDate);
    }
    this.setState({
      sliderValue,
      sliderDate,
      sliderDataLastUpdated: dateDiff,
      sliderDataStartDate: startDate,
    });
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
      if (!feature.layer.id.includes('mobility_data') && feature.layer.id !== 'time_data' && feature.layer.id !== 'V_time_data') {
        return;
      }

      const state = feature.properties.STATE;
      const county = feature.properties.COUNTYNAME;
      let locationName = 'US';
      locationName = (state && state !== 'null' ? `${state}, ` : '') + locationName;
      locationName = (county && county !== 'null' ? `${county}, ` : '') + locationName;

      hoverInfo = {
        lngLat: event.lngLat,
        locationName,
        FIPS: feature.properties.FIPS,
      };

      if (feature.layer.id === 'time_data') {
        const cases = formatNumberToDisplay(feature.properties[`C_${this.state.sliderDate}`]);
        const deaths = formatNumberToDisplay(feature.properties[`D_${this.state.sliderDate}`]);

        hoverInfo.case_values = {
          'confirmed cases': cases,
          deaths,
        };
      }

      if (feature.layer.id === 'V_time_data') {
        const vac = formatNumberToDisplay(feature.properties[`V_${this.state.sliderDate}`]);

        hoverInfo.vac_values = {
          'Vaccines Administered': vac,
        };
      }

      if (feature.layer.id.indexOf('mobility_data') > -1) {
        const idString = feature.layer.id.split('_')[0];
        hoverInfo.mobility_values = {};
        hoverInfo.mobility_values[this.state.overlay_layers.mobility_layers.layers[`${idString}_mobility_data`].title] = formatNumberToDisplay(feature.properties[`${idString}_${this.state.sliderDate}`]);
      }

      if (this.state.popup_data.strain_data.visible === 'visible') {
        hoverInfo.strain_values = this.state.strainData.data[feature.properties.FIPS][`${this.state.sliderDate}`];
      }
    });

    this.setState({
      hoverInfo,
    });
  };

  onClick = (event) => {
    if (!event.features) { return; }

    event.features.forEach((feature) => {
      if (feature.layer.id === 'time_data') {
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

  onLayerSelect = (event, id) => {
    // TODO make ID usable
    this.setState({ activeLayer: id });
    this.setSliderDates(id.split('_')[0]);
    this.setMapLegendColors(id);
  }

  setMapLegendColors(id) {
    if (id === 'C_time_data') {
      this.setState({
        mapColors: this.mapData.colors, legendTitle: 'Confirmed Cases', legendDataSource: { title: 'Johns Hopkins University CSSE', link: 'https://systems.jhu.edu' }, lastUpdated: this.props.jsonByTime.last_updated,
      });
    }
    if (id === 'V_time_data') {
      const colors = [
        ['0 - 1000', '#FFF'],
        ['1001 - 5000', '#a8dab5'],
        ['5001 - 10000', '#81c995'],
        ['10001 - 50000', '#5bb974'],
        ['50001 - 100000', '#34a853'],
        ['100001 - 150000', '#1e8e3e'],
        ['150001 - 300000', '#188038'],
        ['300001 - 500000', '#0d652d'],
        ['No Data Available', '#5f5d59'],
      ];
      this.setState({
        mapColors: colors, legendTitle: 'Vaccines Administered', legendDataSource: { title: 'Illinois Department of Public Health', link: 'http://www.dph.illinois.gov/' }, lastUpdated: this.props.jsonVaccinated.last_updated,
      });
    }
    if (id.includes('mobility_data')) {
      const colors = [
        ['-100% to -80%', '#0d652d'],
        ['-80% to -60%', '#188038'],
        ['-60% to -40%', '#1e8e3e'],
        ['-40% to -20%', '#34a853'],
        ['-20% to 0%', '#81c995'],
        ['0%', '#FFF'],
        ['1% to 20%', '#EED322'],
        ['20% to 40%', '#DA9C20'],
        ['40% to 60%', '#B86B25'],
        ['60% to 80%', '#8B4225'],
        ['80% to 100% +', '#850001'],
        ['No Data Available', '#5f5d59'],
      ];
      this.setState({
        mapColors: colors, legendTitle: 'Mobility Data', legendDataSource: { title: 'Google Mobility Data', link: 'https://www.google.com/covid19/mobility/' }, lastUpdated: null,
      });
    }
  }

  findStartAndEndDates = (geoJson) => {
    // find first and last date
    const { dataDateRange } = this.state;
    geoJson.features.forEach((counties) => {
      Object.keys(counties.properties).forEach((currentValue) => {
        // sample data in [C_2020-01-22, D_2020-02-05,gnp_2020-02-15, prk_2020-02-15, res_2020-02-15, rnr_2020-02-15, trn_2020-02-15, wrk_2020-02-15]
        // dont include
        // [COUNTYNAME, CWA, FE_AREA, FIPS, LAT, LON, STATE,TIME_ZONE]

        // exit if no date hyphen
        if (currentValue.indexOf('-') === -1) {
          return;
        }
        // break id into data set and date
        const [setName, dateString] = currentValue.split('_');
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

  addMobilityDataToGeoJsonBase = () => {
    // Only select Illinois data.
    // Chicago (FIPS 17999) is separate from Cook county in `countyData`,
    // but not in JHU data. So don't display Chicago separately.
    this.setState({ mobility_data: { data: null, fetchStatus: 'fetching' } });
    fetch(`https://covd-map-occ-prc-${occEnv}.s3.amazonaws.com/google_mobility_data.json`, {
      headers: {
        'Cache-Control': `max-age=${(1000 * 60 * 60 * 24)}`, // set cache to expire after one day
      },
    })
      .then((resp) => resp.json())
      .then((baseData) => {
        const geoJson = this.addDataToGeoJsonBase(
          baseData,
          (data, location) => data[location.properties.FIPS]);

        this.setState({ mobility_data: { data: geoJson, fetchStatus: 'done' } });
      })
      .then(() => {
        this.setSliderDates(this.state.activeLayer.split('_')[0]);
      })
      .catch((error) => {
        console.warn('Data not retrieved. Unable to display mobility overlays', error); // eslint-disable-line no-console
        this.setState({ mobility_data: { fetchStatus: 'error' } });
      });
  }

  addDataToGeoJsonBase = (data, assignValues) => {
    // Only select Illinois data.
    // Chicago (FIPS 17999) is separate from Cook county in `countyData`,
    // but not in JHU data. So don't display Chicago separately.
    const base = {
      ...countyData,
      features: countyData.features.filter((f) => f.properties.STATE === 'IL' && f.properties.FIPS !== '17999'),
    };

    const geoJson = {
      ...base,
      features: base.features.map((loc) => {
        const location = loc;
        if (location.properties.FIPS && !(location.properties.FIPS in data)) {
          // `countyData` stores FIPS with trailing zeros, JHU data doesn't
          location.properties.FIPS = Number(location.properties.FIPS).toString();
        }
        if (location.properties.FIPS && location.properties.FIPS in data) {
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
    this.findStartAndEndDates(geoJson);
    return geoJson;
  }

  addStrainDataToState = () => {
    this.setState({ strainData: { data: null, fetchStatus: 'fetching' } });
    fetch(`https://covd-map-occ-prc-${occEnv}.s3.amazonaws.com/gagnon_lab_strain_data.json`, {
      headers: {
        'Cache-Control': `max-age=${(1000 * 60 * 60 * 24)}`, // set cache to expire after one day
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        this.setState({ strainData: { data, fetchStatus: 'done' } });
      })
      .catch(() => { console.warn('Data not retrieved. Unable to display mobility overlays'); }); // eslint-disable-line no-console
  }

  onDataSelect = (event, id) => {
    const newState = { ...this.state.popup_data };
    newState[id].visible = event.target.checked ? 'visible' : 'none';
    this.setState(newState);
  }

  sliderOnChange = (value) => {
    const startDate = new Date(this.state.sliderDataStartDate);
    startDate.setDate(startDate.getDate() + parseInt(value, 10));

    const someFormattedDate = formatDate(startDate);
    this.setState({ sliderDate: someFormattedDate, sliderValue: value });
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
              hoverInfo.case_values
              && Object.entries(hoverInfo.case_values).map(
                (val, i) => <p key={i}>{`${val[1]} ${val[0]}`}</p>,
              )
            }
            {
              hoverInfo.vac_values
              && Object.entries(hoverInfo.vac_values).map(
                (val, i) => <p key={i}>{`${val[1]} ${val[0]}`}</p>,
              )
            }
            {
              hoverInfo.mobility_values
              && Object.entries(hoverInfo.mobility_values).map(
                (val, i) => <p key={i}>{`${val[1]}% ${val[0]}`}</p>,
              )
            }
            {
              hoverInfo.strain_values
              && (
                <table>
                  <thead>
                    <tr>
                      <th colSpan='2'>SARS-CoV-2 Strain Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(hoverInfo.strain_values).map((val, i) => {
                      const secondCol = Object.entries(hoverInfo.strain_values)[i + 1] || ['', ''];
                      if (i % 2 !== 0) {
                        return (<tr key={i}><td>{`${val[0]} ${val[1]}`}</td><td>{`${secondCol[0]} ${secondCol[1]}`}</td></tr>);
                      }
                      return null;
                    },
                    )}
                  </tbody>
                  <caption>Strain Data is cumulative</caption>
                </table>
              )
            }
            {
              hoverInfo.case_values
              && (
                <p className='covid19-dashboard__location-info__click'>
                Click for real time plotting {this.props.modeledFipsList.includes(hoverInfo.FIPS) ? '\nand simulations' : ''}
                </p>
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
      <div className='map-chart map-chart-il'>
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
          {...this.state.viewport}
          {...this.state.mapSize} // after viewport to avoid size overwrite
          onViewportChange={(viewport) => {
            this.setState({ viewport });
          }}
          onHover={this.onHover}
          onClick={this.onClick}
          dragRotate={false}
          touchRotate={false}
        >
          {this.renderHoverPopup()}
          {/* Line below ensures that if a user selects the mobility layers before it is
           finished retrieving then the spinner indicates that the data is being downloaded */}
          {this.state.activeLayer.includes('mobility_data') && this.state.mobility_data.fetchStatus === 'fetching' && <Spinner text={'Downloading mobility data'} />}
          {this.state.activeLayer.includes('mobility_data') && this.state.mobility_data.fetchStatus === 'error' && <Spinner text={'Something went wrong. Please refresh the page and try again.'} />}
          {this.state.time_data.fetchStatus === 'done' && <TimeCaseLayer visibility={this.state.activeLayer === 'C_time_data' ? 'visible' : 'none'} data={this.state.time_data.data} date={this.state.sliderDate} />}
          {this.state.vaccine_data.fetchStatus === 'done' && <VaccinatedCaseLayer visibility={this.state.activeLayer === 'V_time_data' ? 'visible' : 'none'} data={this.state.vaccine_data.data} date={this.state.sliderDate} />}
          {this.state.mobility_data.fetchStatus === 'done' && <MobilityLayer visibility={this.state.activeLayer === 'rnr_mobility_data' ? 'visible' : 'none'} data={this.state.mobility_data.data} date={this.state.sliderDate} />}
          {this.state.mobility_data.fetchStatus === 'done' && <MobilityLayerGnp visibility={this.state.activeLayer === 'gnp_mobility_data' ? 'visible' : 'none'} data={this.state.mobility_data.data} date={this.state.sliderDate} />}
          {this.state.mobility_data.fetchStatus === 'done' && <MobilityLayerPrk visibility={this.state.activeLayer === 'prk_mobility_data' ? 'visible' : 'none'} data={this.state.mobility_data.data} date={this.state.sliderDate} />}
          {this.state.mobility_data.fetchStatus === 'done' && <MobilityLayerTrn visibility={this.state.activeLayer === 'trn_mobility_data' ? 'visible' : 'none'} data={this.state.mobility_data.data} date={this.state.sliderDate} />}
          {this.state.mobility_data.fetchStatus === 'done' && <MobilityLayerWrk visibility={this.state.activeLayer === 'wrk_mobility_data' ? 'visible' : 'none'} data={this.state.mobility_data.data} date={this.state.sliderDate} />}
          {this.state.mobility_data.fetchStatus === 'done' && <MobilityLayerRes visibility={this.state.activeLayer === 'res_mobility_data' ? 'visible' : 'none'} data={this.state.mobility_data.data} date={this.state.sliderDate} />}
          {/*
          // Additional layers used as examples enable here
          <LayerTemplate visibility={this.state.overlay_layers.us_counties.visible} />
          <PopulationIL visibility={this.state.overlay_layers.il_population.visible} /> */}
          {/* Outline a set of counties from IL */}
          {this.state.activeLayer === 'C_time_data'
            && (
              <ReactMapGL.Source type='geojson' data={this.mapData.modeledCountiesGeoJson}>
                <ReactMapGL.Layer
                  id='county-highlight'
                  type='line'
                  beforeId='waterway-label'
                  paint={{
                    'line-color': '#421C52',
                    'line-width': 3,
                  }}
                />
              </ReactMapGL.Source>
            )}
          <ReactMapGL.Source type='geojson' data={this.mapData.illinoisCountiesGeoJson}>
            <ReactMapGL.Layer
              id='county-outline'
              type='line'
              beforeId='waterway-label'
              paint={{
                'line-color': '#421C52',
                'line-width': 1,
              }}
            />
          </ReactMapGL.Source>
        </ReactMapGL.InteractiveMap>
        {this.state.sliderDate
        && <MapSlider title={`View data by date: ${this.state.sliderDate}`} value={this.state.sliderValue} maxValue={this.state.sliderDataLastUpdated} onChange={this.sliderOnChange} />}
      </div>
    );
  }
}

IllinoisMapChart.propTypes = {
  jsonByTime: PropTypes.object.isRequired,
  modeledFipsList: PropTypes.array.isRequired,
  fetchTimeSeriesData: PropTypes.func.isRequired,
  jsonVaccinated: PropTypes.object.isRequired,
};

export default IllinoisMapChart;
