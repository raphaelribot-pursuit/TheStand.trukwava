import { useState, useEffect } from 'react';

const NYC_OPEN_DATA_BASE = 'https://data.cityofnewyork.us/resource';

// NYC 311 Social Service locations (Socrata)
const SOCIAL_SERVICES_ENDPOINT = `${NYC_OPEN_DATA_BASE}/kvhd-5fmu.json`;
// NYC Health + Hospitals facilities
const HEALTH_FACILITIES_ENDPOINT = `${NYC_OPEN_DATA_BASE}/f7b6-v6v3.json`;
// NYC DYCD afterschool programs (youth-relevant)
const YOUTH_PROGRAMS_ENDPOINT = `${NYC_OPEN_DATA_BASE}/mbd7-jfnc.json`;

export function useNYCSocialServices(query = '') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const searchTerm = query || 'LGBTQ';
        const url = `${SOCIAL_SERVICES_ENDPOINT}?$where=upper(agency_name) like '%25${searchTerm.toUpperCase()}%25' OR upper(program_name) like '%25${searchTerm.toUpperCase()}%25'&$limit=50`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch NYC data');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  return { data, loading, error };
}

export function useNYCHealthFacilities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${HEALTH_FACILITIES_ENDPOINT}?$limit=100&$where=borough IS NOT NULL`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch health facilities');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}

export function useNYCYouthPrograms() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${YOUTH_PROGRAMS_ENDPOINT}?$limit=50&$where=borough IS NOT NULL`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch youth programs');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}
