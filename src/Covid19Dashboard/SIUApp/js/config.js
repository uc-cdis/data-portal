config = {
    server_local: "http://localhost:5000",
    server_remote: "<remote_server_address_here>",
    backend_remote: false,
}

config['server_ip'] = config.backend_remote ? config.server_remote : config.server_local;
config['standalone'] = '../data/geojson';
config['ccd'] = {
    GEO_ID: "ID",
    NAME: "N",
    confirmed_cases: "CC",
    deaths: "D",
    daysElapsed: "DE",
    count: "C",
    isPredicted : "IP",
    strain_data : "SD"
}

config['county_props']={
    "GEO_ID" : "GEO_ID",
    "CASES" : "confirmed_cases",
    "DEATHS" : "deaths",
    "STRAIN" : "strain_data",
    "MOBILTY" : "mobility_data"
}
var colorArray = ['#FEC4E9', '#F5B3D4', '#EDA2C0', '#E592AC', '#DC8095', '#D36E7F', '#C85964', '#BE454C', '#B6373A', '#B12B2C', '#A91C19'];
