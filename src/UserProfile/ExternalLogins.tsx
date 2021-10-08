import React, { useState, useEffect } from 'react';
import { wtsPath, externalLoginOptionsUrl } from '../localconf'
import { fetchWithCreds } from '../actions'
import { json } from 'stream/consumers';



interface ExternalProvider {
    "base_url": String,
    "idp": String,
    "name": String,
    "refresh_token_expiration": String,
    "urls": {
        "name": String,
        "url": String,
    }[]
};

//   {
//     "providers": [
//       {
//         "base_url": "string",
//         "idp": "string",
//         "name": "string",
//         "refresh_token_expiration": "string",
//         "urls": [
//           {
//             "name": "string",
//             "url": "string"
//           }
//         ]
//       }
//     ]
//   }

const externalProviderElement = (provider: ExternalProvider) => <div>
    {

    }
</div>


const externalLogins: React.FunctionComponent = () => {

    const [externalLoginOptions, setExternalLoginOptions] = useState([]);
    useEffect(() => {
        fetchWithCreds({
            path: `${externalLoginOptionsUrl}`,
            method: 'GET',
        }).then(
            ({ data }) => {
              setExternalLoginOptions(data.providers);
            },
        );
    });

    return <div>
        { externalLoginOptions.map(externalProviderElement) }
    </div>
}

export default externalLogins;
