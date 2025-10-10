import { useCallback, useEffect, useState } from 'react';
import { Subject, from, takeUntil, catchError, finalize, map, of } from 'rxjs';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Config } from '@core/constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getResponseError } from '@core/utils/helpers.util';
import * as Device from 'expo-device';

export const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const unmount$ = new Subject();

  const axiosInstance: AxiosInstance = axios.create({
    baseURL: new URL(Config.baseUrlContext, Config.baseUrl).toString(),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  useEffect(() => {
    return () => {
      unmount$.next(false);
      unmount$.complete();
    }
  }, []);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(Config.tokenStoreKey);
        const device = {
          operatingSystem: Device.osName,
          version: Device.osVersion,
          brand: Device.brand,
          type: Device.deviceType?.toString(),
          model: Device.modelName,
          appVersion: Config.appVersion,
        };

        config.headers['x-device'] = JSON.stringify(device);

        if (token) {
          console.log('AuthorizationToken', token);
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        console.error('Request Interceptor Error', error);
        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    }
  }, [axiosInstance]);

  const request = (method: string, url: string, payload?: any, headers?: any, options?: any) => {
    setLoading(true);
    setError(null);
    setData(null);
    setStatusCode(null);

    console.log(JSON.stringify({ method, url, data: payload, headers, ...options }, null, 2))

    return from(axiosInstance.request({ method, url, data: payload, headers, ...options }))
      .pipe(
        takeUntil(unmount$),
        map((response) => {
          // console.log(JSON.stringify(response, null, 2));
          setStatusCode(response.status);
          return response.data;
        }),
        catchError((err: AxiosError) => {
          console.log('Request Error', JSON.stringify(err, null, 2));
          console.log('Code', err.code);
          console.log('Status', err.status);
          setStatusCode(err.status || null);
          setError(getResponseError(err));
          return of(null);
        }),
        finalize(() => {
          setLoading(false);
        }),
      );
  };

  const get = (url: string) => request('GET', url);
  const post = (url: string, payload: any, headers?: any, options?: any) => request('POST', url, payload, headers, options);
  const patch = (url: string, payload: any) => request('PATCH', url, payload);
  const put = (url: string, payload: any) => request('PUT', url, payload);
  const del = (url: string) => request('DELETE', url);

  return { data, loading, error, get, post, patch, put, delete: del, statusCode };
}
