import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { mapboxAPIToken, covid19DashboardConfig } from '../../localconf';
import ControlPanel from '../ControlPanel';
//import countyData from '../data/us_counties';
import countyData from '../data/chicago_communities';
//import zipData from '../data/il_illinois_zip_codes_geo.min';
import zipData from '../data/2015-2019-acs-il_zcta';
//import vacData from '../localdata/vaccine_zip';
import vacData from '../localdata/vaccination_with_area';
//import vacData from '../localdata/testvac';
//import vacData from '../localdata/vaccination_by_zip';
/*
// Additional layers used as examples enable here
import LayerTemplate from '../overlays/LayerTemplate'; */
import PopulationIL from '../overlays/PopulationIL';

//import TimeCaseLayer from '../overlays/TimeCaseLayer';
//import MobilityLayer from '../overlays/GoogleMobilityLayer';
//import MobilityLayerGnp from '../overlays/GoogleMobilityLayerGnp';
//import MobilityLayerPrk from '../overlays/GoogleMobilityLayerPrk';
//import MobilityLayerWrk from '../overlays/GoogleMobilityLayerWrk';
//import MobilityLayerTrn from '../overlays/GoogleMobilityLayerTrn';
//import MobilityLayerRes from '../overlays/GoogleMobilityLayerRes';

//import MapSlider from '../MapSlider';
import Spinner from '../../components/Spinner';

//const GeoJsonGeometriesLookup = require('geojson-geometries-lookup');
//const glookup = new GeoJsonGeometriesLookup(zipData);

// check the data commons url to check if prod or qa environment
// pull data from qa for everything that is not prod
const occEnv = covid19DashboardConfig.dataUrl === 'https://opendata.datacommons.io/' ? 'prod' : 'qa';

function addDataToGeoJsonBase(data) {
  // We start with zipcodes in Illinois
  let base = zipData;
  const geoJson = {
    ...base,
    features: base.features.map((loc) => {
      const location = loc;
//      if (location.properties.ZCTA5CE10 && location.properties.ZCTA5CE10 in data) {
//          location.properties = Object.assign(
//            data[location.properties.ZCTA5CE10],
      if (location.properties.FIPS && location.properties.FIPS in data) {
          location.properties = Object.assign(
            data[location.properties.FIPS],
            location.properties,
          );
          return location;
        }
      // no data for this location
      location.properties.firstDoseCount = 0;
      location.properties.firstDoseCountDisplay = 0;
      location.properties.firstDoseRateDisplay = 0;
      location.properties.fullyVaccinatedCount = 0;
      location.properties.fullyVaccinatedCountDisplay = 0;
      location.properties.fullyVaccinatedRate = 0;
      location.properties.fullyVaccinatedRateDisplay = 0;
      location.properties.Report_Date = "";
      return location;
    }),
  };

  return geoJson;
}

function filterCommunityGeoJson(selectedNames) {
  return {
    ...countyData,
    features: countyData.features.filter((f) => selectedNames.includes(f.properties.community)),
  };
}

function filterCountyGeoJson(selectedFips) {
  return {
    ...countyData,
    features: countyData.features.filter((f) => f.properties.STATE === 'IL' && f.properties.FIPS !== '17999' && selectedFips.includes(f.properties.FIPS)),
  };
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

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
        longitude: -87.95, //-87.6 is longitude of Chicago, but so much lake...
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
	    vaccine_data: { title: 'Vaccine Data' },
	  },
	},
        demographic_layers: {
	  title: 'Demographics',
	  layers: {
	    il_population: { title: 'Population', visible: 'visible' },
	  },
	},
      },
      popup_data: {
        /*
        This data is used just for the popup on hover */
        strain_data: { title: 'SARS-CoV-2 Strain Data', visible: 'none' },
        vaccination_data: { title: 'COVID Vaccination Data', visible: 'none' },
        // mobility_data : {title: 'Mobility Data', visible: 'none'},
      },
//      sliderValue: null,
//      sliderDate: null,
//      sliderDataLastUpdated: null,
//      sliderDataStartDate: null,
      activeLayer: 'vaccination_data',
      legendTitle: 'Fully Vaccinated Rate',
      legendDataSource: { title: 'IDPH', link: 'https://www.dph.illinois.gov/covid19/data-portal' },
      vaccination_data: { data: null, fetchStatus: null },
      strainData: { data: null, fetchStatus: null },
      lastUpdated: null,
      dataDateRange: {},
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
    this.mapData.densityGeoJson = this.props.geoJson;
    if (!this.choroGeoJson) {
      this.choroGeoJson = addDataToGeoJsonBase(vacData);
    }

    const maxVal = 100
    const maxValExponent = Math.log10(maxVal);
    // Math to calculate Index range for map
    const colorRangeMath = (base) => {
      // applies maxValExponent to base then rounds down to greatest place
      const tempNum = Math.ceil(base ** maxValExponent);
      const roundingDigits = 10 ** (tempNum.toString().length - 1);

      return Math.floor(tempNum / roundingDigits) * roundingDigits;
    };

 // config for choropleth map
//    this.mapData.colors = {
//                0.:            'rgb(165,165,165)',
//                1.0:           'rgb(238,48,39)',
//                11.1111111111: 'rgb(215,48,39)',
//                22.2222222222: 'rgb(244,109,67)',
//                33.3333333333: 'rgb(253,174,97)',
//                44.4444444444: 'rgb(254,224,144)',
//                55.5555555556: 'rgb(224,243,248)',
//                66.6666666667: 'rgb(171,217,233)',
//                77.7777777778: 'rgb(116,173,209)',
//                88.8888888889: 'rgb(69,117,180)',
//                100.0:         'rgb(49,54,149)',
//    }
//    this.mapData.colors = {
//      0: '#FFF',
//      [colorRangeMath(2)]: '#F7F787',
//      [colorRangeMath(3)]: '#EED322',
//      [colorRangeMath(4)]: '#E6B71E',
//      [colorRangeMath(5)]: '#DA9C20',
//      [colorRangeMath(6)]: '#CA8323',
//      [colorRangeMath(7)]: '#B86B25',
//      [colorRangeMath(8)]: '#A25626',
//      [colorRangeMath(9)]: '#8B4225',
//      [colorRangeMath(10)]: '#850001',
//    };
//    this.mapData.colors = [
//      [0, '#FFF'],
//      [30, '#a8dab5'],
//      [40, '#81c995'],
//      [45, '#5bb974'],
//      [50, '#34a853'],
//      [55, '#1e8e3e'],
//      [60, '#188038'],
//      [65, '#0d652d'],
//      [70, '#8B4225'],
//      [75, '#850001'],
//    ];
      this.mapData.colors = [
        [' 0% - 30%', '#FFF'],
        ['30% - 40%', '#a8dab5'],
        ['40% - 45%','#81c995'],
        ['45% - 50%', '#5bb974'],
        ['50% - 55%','#34a853'],
        ['55% - 60%','#1e8e3e'],
        ['60% - 65%','#188038'],
        ['65% - 70%', '#0d652d'],
        ['70% - 75%', '#8B4225'],
        ['75% + ', '#850001'],
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
      if (!feature.layer.id.startsWith('zipcode-')) {
        return;
      }
      const locationName = feature.properties.ZCTA5CE10;
      if (!locationName || locationName === 'undefined') {
        // we don't have data for this location
        return;
      }
      //const firstRate = formatNumberToDisplay(feature.properties.FirstDoseRate);
      //const fullRate  = formatNumberToDisplay(feature.properties.FullyVaccinatedRate);
      const firstRate = feature.properties.FirstDoseRate;
      const fullRate  = feature.properties.FullyVaccinatedRate;
      hoverInfo = {
        lngLat: event.lngLat,
        locationName,
        values: {
          'First dose rate': firstRate,
          'Fully vaccinated rate': fullRate,
        },
      };
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
    // TODO make ID usable
    this.setState({ activeLayer: id });
//    this.setSliderDates(id.split('_')[0]);
    this.setMapLegendColors(id);
  }

  setMapLegendColors(id) {
    if (id === 'time_data') {
      this.setState({
        mapColors: this.mapData.colors, legendTitle: 'Confirmed Cases', legendDataSource: { title: 'Johns Hopkins University CSSE', link: 'https://systems.jhu.edu' }, lastUpdated: this.props.jsonByTime.last_updated,
      });
    }
    if (id.includes('mobility_data')) {
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

  addVaccinationDataToGeoJsonBase = () => {
             console.warn('Got this far');
//    this.setState({ vaccination_data: { data: null, fetchStatus: 'fetching' } });
//    fetch(`https://idph.illinois.gov/DPHPublicInformation/api/COVIDVaccine/getCOVIDVaccineAdministrationZIP`, {
//      header: {
//        'Cache-Control': `max-age=${(1000 * 60 * 60 * 24)}`, // set cache to     expire after one day
//      },
//    })
//      .then((resp) => resp.json())
//      .then((data) => {
        const base = zipData;
        const geoJson = {
          ...base,
          features: base.features.map((loc) => {
            const location = loc;
            if (location.properties.ZCTA5CE10) {
             // const result = vacData.find(zip => zip.ZipCode === Number(location.properties.ZCTA5CE10));
            }
            const result = false;
            if (result) {
            console.warn('here');
            console.warn(result);
              location.properties = Object.assign(
                result,
                location.properties,
              );
            return location;
          }
          // no data for this location
          return location;
        }),
      };
//    })
//    .catch(() => { console.warn('Data not retrieved. Unable to display vaccination overlay'); }); // eslint-disable-line no-console
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
          {...this.state.viewport}
          {...this.state.mapSize} // after viewport to avoid size overwrite
          onViewportChange={(viewport) => {
            this.setState({ viewport });
          }}
          //onHover={this.onHover}
          //onClick={this.onClick}
          dragRotate={false}
          touchRotate={false}
        >
         //{this.renderHoverPopup()}
	   <PopulationIL visibility={this.state.activeLayer == 'il_population' ? 'visible' : 'none'} />

           <ReactMapGL.Source type='geojson' data={countyData}>
            <ReactMapGL.Layer
              id='zipcode-outline'
              type='line'
              beforeId='waterway-label'
              paint={{
                'line-color': '#002200',
                'line-width': 1.5,
              }}
            />
           </ReactMapGL.Source>
           <ReactMapGL.Source type='geojson' data={vacData}>
             <ReactMapGL.Layer
               id='choro-zip'
               type='fill'
               beforeID='waterway-label'
               paint={this.mapData.colorsAsList === null ? {} : {
                 'fill-color': [
                   'interpolate',
                   ['linear'],
                   ['number', ['get', 'FullyVaccinatedRate'], 0],
                   0, '#FFF',
                   30, '#a8dab5',
                   40, '#81c995',
                   45, '#5bb974',
                   50, '#34a853',
                   55, '#1e8e3e',
                   60, '#188038',
                   65, '#0d652d',
                   70, '#8B4225',
                   75, '#850001',
                 ],
                 'fill-opacity': 0.6,
               }}
             />
           </ReactMapGL.Source>
         </ReactMapGL.InteractiveMap>

      </div>
    );
  }
}

ChicagoMapChart.propTypes = {
  jsonByTime: PropTypes.object,
  modeledFipsList: PropTypes.array,
  fetchTimeSeriesData: PropTypes.func.isRequired,
};

export default ChicagoMapChart;
