from collections import deque
from threading import Lock
from time import monotonic


class InMemoryRateLimiter:
    def __init__(
        self,
        requests_per_window: int,
        window_seconds: int,
        max_clients: int = 10000,
    ):
        self._requests_per_window = requests_per_window
        self._window_seconds = window_seconds
        self._max_clients = max_clients
        self._requests_by_client: dict[str, deque[float]] = {}
        self._last_cleanup = 0.0
        self._lock = Lock()

    def is_allowed(self, client_id: str, now: float | None = None) -> bool:
        current_time = monotonic() if now is None else now
        with self._lock:
            if current_time - self._last_cleanup >= self._window_seconds:
                expired_clients = [
                    client
                    for client, requests in self._requests_by_client.items()
                    if not requests
                    or current_time - requests[-1] >= self._window_seconds
                ]
                for client in expired_clients:
                    del self._requests_by_client[client]
                self._last_cleanup = current_time

            requests = self._requests_by_client.get(client_id)
            if requests is None:
                if len(self._requests_by_client) >= self._max_clients:
                    return False
                requests = deque()
                self._requests_by_client[client_id] = requests

            while (
                requests
                and current_time - requests[0] >= self._window_seconds
            ):
                requests.popleft()

            if len(requests) >= self._requests_per_window:
                return False

            requests.append(current_time)
            return True
