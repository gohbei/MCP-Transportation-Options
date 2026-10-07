/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * LTA DataMall Bus Arrival Proxy Endpoint
 * GET /api/bus-arrival?BusStopCode=04121&ServiceNo=7
 *
 * Upstream: https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival
 * Header: AccountKey: <KEY>
 */
export default async function busArrivalHandler(req, res) {
  try {
    const busStopCode = (req.query.BusStopCode || req.query.busStopCode || '04121').toString().trim();
    const serviceNo = req.query.ServiceNo || req.query.serviceNo;

    // Check account key from process.env or custom request header
    const accountKey = (
      process.env.LTA_ACCOUNT_KEY ||
      req.headers['x-account-key'] ||
      req.headers['accountkey'] ||
      ''
    ).toString().trim();

    const isKeyConfigured = accountKey && accountKey !== 'YOUR_LTA_DATAMALL_KEY';

    let targetUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    if (serviceNo) {
      targetUrl += `&ServiceNo=${encodeURIComponent(serviceNo.toString().trim())}`;
    }

    if (isKeyConfigured) {
      try {
        const response = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            AccountKey: accountKey,
            accept: 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Augment with metadata
          return res.status(200).json({
            ...data,
            _meta: {
              source: 'lta_datamall_live',
              refreshedAt: new Date().toISOString(),
              refreshIntervalSeconds: 20,
              query: { BusStopCode: busStopCode, ServiceNo: serviceNo || null },
            },
          });
        }

        // If upstream returned error (e.g. 401 Unauthorized or 403)
        const errorText = await response.text();
        console.warn(`[LTA API] Upstream error (${response.status}):`, errorText);

        return res.status(response.status).json({
          error: `LTA DataMall API responded with status ${response.status}`,
          details: errorText,
          BusStopCode: busStopCode,
          _meta: {
            source: 'upstream_error',
            help: 'Verify your LTA DataMall AccountKey in .env (LTA_ACCOUNT_KEY)',
          },
          ...getFallbackLtaData(busStopCode, serviceNo),
        });
      } catch (fetchErr) {
        console.error('[LTA API] Fetch network error:', fetchErr);
        // Fall back to preview data with warning
        return res.status(200).json({
          _warning: 'Network error connecting to LTA DataMall servers. Showing preview telemetry.',
          ...getFallbackLtaData(busStopCode, serviceNo),
        });
      }
    }

    // If key not configured yet, provide preview simulation with clear explanation
    return res.status(200).json({
      _warning: 'LTA_ACCOUNT_KEY is not configured in .env. Showing simulated Singapore LTA DataMall v3 telemetry.',
      _instructions: 'Add LTA_ACCOUNT_KEY to your environment variables or pass header x-account-key to fetch live data from datamall2.mytransport.sg.',
      ...getFallbackLtaData(busStopCode, serviceNo),
    });
  } catch (err) {
    console.error('[LTA API] Internal handler error:', err);
    return res.status(500).json({
      error: 'Internal server error processing bus arrival request',
      message: err.message,
    });
  }
}

/**
 * Realistic preview data modeled directly on LTA DataMall v3 schema
 */
function getFallbackLtaData(busStopCode, serviceNo) {
  const now = Date.now();

  const allServices = [
    {
      ServiceNo: '7',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '10009',
        DestinationCode: '04121',
        EstimatedArrival: new Date(now + 45 * 1000).toISOString(), // ~45s (Arriving!)
        Latitude: '1.2902',
        Longitude: '103.8519',
        VisitNumber: '1',
        Load: 'SEA', // Seats Available
        Feature: 'WAB', // Wheelchair Accessible
        Type: 'DD', // Double Deck
      },
      NextBus2: {
        OriginCode: '10009',
        DestinationCode: '04121',
        EstimatedArrival: new Date(now + 420 * 1000).toISOString(), // 7m
        Latitude: '1.2842',
        Longitude: '103.8440',
        VisitNumber: '1',
        Load: 'SDA', // Standing Available
        Feature: 'WAB',
        Type: 'SD',
      },
      NextBus3: {
        OriginCode: '10009',
        DestinationCode: '04121',
        EstimatedArrival: new Date(now + 880 * 1000).toISOString(), // 14m
        Latitude: '1.2750',
        Longitude: '103.8390',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
    },
    {
      ServiceNo: '195',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '10009',
        DestinationCode: '10009',
        EstimatedArrival: new Date(now + 160 * 1000).toISOString(), // ~2m 40s
        Latitude: '1.2934',
        Longitude: '103.8521',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD',
      },
      NextBus2: {
        OriginCode: '10009',
        DestinationCode: '10009',
        EstimatedArrival: new Date(now + 660 * 1000).toISOString(), // 11m
        Latitude: '1.2880',
        Longitude: '103.8480',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
      },
    },
    {
      ServiceNo: '961',
      Operator: 'SMRT',
      NextBus: {
        OriginCode: '46009',
        DestinationCode: '16009',
        EstimatedArrival: new Date(now + 310 * 1000).toISOString(), // ~5m
        Latitude: '1.2980',
        Longitude: '103.8550',
        VisitNumber: '1',
        Load: 'LSD', // Limited Standing (Crowded)
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '46009',
        DestinationCode: '16009',
        EstimatedArrival: new Date(now + 920 * 1000).toISOString(), // 15m
        Latitude: '1.3050',
        Longitude: '103.8610',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
      },
    },
    {
      ServiceNo: '100',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '10009',
        DestinationCode: '54009',
        EstimatedArrival: new Date(now + 510 * 1000).toISOString(), // 8m 30s
        Latitude: '1.2890',
        Longitude: '103.8490',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
    },
  ];

  const filtered = serviceNo
    ? allServices.filter((s) => s.ServiceNo.toLowerCase() === serviceNo.toLowerCase())
    : allServices;

  return {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/v3/$metadata#BusArrivalv3/@Element',
    BusStopCode: busStopCode,
    Services: filtered,
    _meta: {
      source: 'preview_telemetry',
      refreshedAt: new Date().toISOString(),
      refreshIntervalSeconds: 20,
      busStopName: busStopCode === '04121' ? 'Old Parliament Bldg (Supreme Court)' : `Bus Stop ${busStopCode}`,
      query: { BusStopCode: busStopCode, ServiceNo: serviceNo || null },
    },
  };
}
