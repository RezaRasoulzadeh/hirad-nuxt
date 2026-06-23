interface Subscriber {
  id: string;
  email: string;
  confirmed: boolean;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  data: Subscriber[];
}

export function useSubscribers() {
  const { data: subscribersData, status, error, refresh } = useFetch<ApiResponse>(
    '/api/dashboard/subscribers',
    { lazy: true }
  );

  const subscribers = computed<Subscriber[]>(() => subscribersData.value?.data || []);

  return {
    subscribers,
    status,
    error,
    refresh,
  };
}