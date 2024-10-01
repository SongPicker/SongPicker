import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import useAuthStore from '../stores/useAuthStore';

interface ApiErrorResponse {
  code: string;
  message: string;
  data: unknown;
}

interface ApiSuccessResponse<T = unknown> {
  code: string;
  message: string;
  data: T;
}

type ApiResponse<T = unknown> = ApiErrorResponse | ApiSuccessResponse<T>;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

const refreshAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post<ApiResponse>(
      '/api/auths/refresh',
      {},
      {
        baseURL: '/',
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    if ('code' in response.data && response.data.code === 'AU104') {
      const newAccessToken: string | undefined = response.headers['authorization'];
      if (newAccessToken) {
        const formattedToken = newAccessToken.startsWith('Bearer ')
          ? newAccessToken
          : `Bearer ${newAccessToken}`;
        useAuthStore.getState().setAccessToken(formattedToken);
        return formattedToken;
      }
    }
    throw new Error('Failed to refresh token');
  } catch (error) {
    useAuthStore.getState().setAccessToken('');
    throw error;
  }
};

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse<ApiResponse>) => {
    if ('code' in response.data && response.data.code === 'AU005') {
      const originalRequest = response.config;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onRefreshed(newToken);
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = newToken;
          }
          return axiosInstance(originalRequest);
        } catch (error) {
          isRefreshing = false;
          return Promise.reject(error);
        }
      } else {
        return new Promise(resolve => {
          refreshSubscribers.push((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = token;
            }
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = useAuthStore.getState().getAccessToken();
    if (token && config.url !== '/api/auths/refresh') {
      config.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
