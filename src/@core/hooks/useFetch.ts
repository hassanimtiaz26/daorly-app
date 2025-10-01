import { useCallback, useEffect, useState } from 'react';
import { Subject, from, takeUntil, catchError, finalize, map, of } from 'rxjs';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Config } from '@core/constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getResponseError } from '@core/utils/helpers.util';

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

        if (token) {
          console.log('AuthorizationToken', token);
          config.headers.Authorization = `Bearer ${token}`;
        }
        // console.log('Request Config', JSON.stringify(config, null, 2));
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

  const request = useCallback((method: string, url: string, payload?: any) => {
    setLoading(true);
    setError(null);
    setData(null);
    setStatusCode(null);

    return from(axiosInstance.request({ method, url, data: payload }))
      .pipe(
        takeUntil(unmount$),
        map((response) => {
          // console.log(JSON.stringify(response, null, 2));
          setStatusCode(response.status);
          return response.data;
        }),
        catchError((err: AxiosError) => {
          console.log('Request Error', err);
          console.log('Code', err.code);
          console.log('Status', err.status);
          setStatusCode(err.status || null);
          setError(getResponseError(err));
          return of(null);
        }),
        finalize(() => {
          setLoading(false);
        }),
      )
      // .subscribe({
      //   next: (response) => {
      //     setData(response.data);
      //   },
      //   error: (error) => {
      //     setError(error);
      //   },
      //   complete: () => {
      //     setLoading(false);
      //   },
      // });
  }, [axiosInstance, setLoading, setError, setData]);

  const get = useCallback((url: string) => request('GET', url), [request]);
  const post = useCallback((url: string, payload: any) => request('POST', url, payload), [request]);
  const put = useCallback((url: string, payload: any) => request('PUT', url, payload), [request]);
  const del = useCallback((url: string) => request('DELETE', url), [request]);

  return { data, loading, error, get, post, put, delete: del, statusCode };
}
