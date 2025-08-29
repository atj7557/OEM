// lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/** =========================
 *  Config
 *  ========================= */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://joulepoint.platform-api-test.joulepoint.com";

const AUTH_SCHEME = process.env.NEXT_PUBLIC_AUTH_SCHEME || "Bearer";
const DEV_DEBUG_AUTH = process.env.NODE_ENV !== "production";

/** =========================
 *  Axios instance + interceptors
 *  ========================= */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const hasWindow = () => typeof window !== "undefined";
const getItem = (k: string) => (hasWindow() ? localStorage.getItem(k) : null);
const setItem = (k: string, v: string | null) => {
  if (!hasWindow()) return;
  if (v == null) localStorage.removeItem(k);
  else localStorage.setItem(k, v);
};

export const getAccessToken = () => getItem("access_token");
export const setAccessToken = (t: string | null) => setItem("access_token", t);
export const getRefreshToken = () => getItem("refresh_token");
export const setRefreshToken = (t: string | null) => setItem("refresh_token", t);

export const logout = () => {
  setAccessToken(null);
  setRefreshToken(null);
};

function pickAccess(data: any): string | null {
  return data?.access ?? data?.access_token ?? data?.token ?? null;
}
function pickRefresh(data: any): string | null {
  return data?.refresh ?? data?.refresh_token ?? null;
}
function looksLikeJWT(t?: string | null) {
  return !!t && /^eyJ/.test(t);
}

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    (config.headers as any).Authorization = `${AUTH_SCHEME} ${token}`;
    if (DEV_DEBUG_AUTH) {
      const mask = token.length > 12 ? token.slice(0, 8) + "..." + token.slice(-4) : token;
      // @ts-ignore
      console.debug("[auth] →", config.method?.toUpperCase(), config.url, `${AUTH_SCHEME} ${mask}`);
    }
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original: any = error.config;
    const status = error?.response?.status;
    if (status === 401 && !original?._retry) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers = original.headers || {};
        original.headers.Authorization = `${AUTH_SCHEME} ${newToken}`;
        return api(original);
      }
      logout();
      if (hasWindow()) window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/** =========================
 *  Auth (Users API)
 *  ========================= */
export async function login(username: string, password: string) {
  const r = await api.post("/api/users/login_with_password/", { username, password });
  const data = r.data || {};
  const access = pickAccess(data);
  const refresh = pickRefresh(data);
  if (access) setAccessToken(access);
  if (refresh) setRefreshToken(refresh);
  return data;
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refresh = getRefreshToken();
    if (!refresh) return null;
    const r = await axios.post(
      `${API_BASE_URL}/api/users/refresh_token/`,
      { refresh },
      { headers: { "Content-Type": "application/json" } }
    );
    const newAccess = pickAccess(r.data);
    if (newAccess) {
      setAccessToken(newAccess);
      return newAccess;
    }
    return null;
  } catch {
    return null;
  }
}

export const forgotPassword = async (email_or_phone: string) =>
  (await api.post("/api/users/forgot_password/", { email_or_phone })).data;

export const setPassword = async (payload: { new_password: string; reset_token: string }) =>
  (await api.post("/api/users/set_password/", payload)).data;

/** =========================
 *  Users / Groups / Permissions
 *  ========================= */
export const getMyProfile = async () => (await api.get("/api/users/users/me/")).data;
export const listUsers = async (params: Record<string, any> = {}) =>
  (await api.get("/api/users/users/", { params })).data;
export const createUser = async (payload: any) =>
  (await api.post("/api/users/users/", payload)).data;
export const updateUser = async (id: number | string, payload: any) =>
  (await api.patch(`/api/users/users/${id}/`, payload, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })).data;
export const deleteUser = async (id: number | string) =>
  (await api.delete(`/api/users/users/${id}/`)).data;
export const getUserPermissions = async (id: number | string) =>
  (await api.get(`/api/users/users/${id}/permissions/`)).data;
export const listGroups = async (params: Record<string, any> = {}) =>
  (await api.get("/api/users/groups/", { params })).data;
export const getGroupUsers = async (id: number | string) =>
  (await api.get(`/api/users/groups/${id}/users/`)).data;
export const getGroupPermissions = async (id: number | string) =>
  (await api.get(`/api/users/groups/${id}/permissions/`)).data;
export const listPermissions = async (params: Record<string, any> = {}) =>
  (await api.get("/api/users/permissions/", { params })).data;
export const hasPermission = async (codename: string) =>
  (await api.get(`/api/users/has-permission/${encodeURIComponent(codename)}/`)).data;
export const getMyPermissions = async () =>
  (await api.get("/api/users/my-permissions/")).data;

/** =========================
 *  Tenant
 *  ========================= */
export const validateDomain = async (domain: string, override_domain?: string) =>
  (await api.get("/api/tenant/validate-domain/", {
    params: { domain, ...(override_domain ? { override_domain } : {}) },
  })).data;

/** =========================
 *  Fleet — OBD Devices
 *  ========================= */
export const listOBDDevices = async (params: Record<string, any> = {}) =>
  (await api.get("/api/fleet/obd-devices/", { params })).data;
export const getOBDDevice = async (id: number | string) =>
  (await api.get(`/api/fleet/obd-devices/${id}/`)).data;
export const createOBDDevice = async (payload: {
  device_id: string;
  model?: string | null;
  firmware_version?: string | null;
  serial_number?: string | null;
  can_baud_rate?: number | null;
  report_interval_sec?: number | null;
  vehicle?: number | string | null;           // prefer numeric PK
  sim_card?: number | { id?: number } | null; // prefer numeric PK
}) => (await api.post("/api/fleet/obd-devices/", payload)).data;
export const updateOBDDevice = async (id: number | string, payload: any) =>
  (await api.patch(`/api/fleet/obd-devices/${id}/`, payload, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })).data;
export const deleteOBDDevice = async (id: number | string) =>
  (await api.delete(`/api/fleet/obd-devices/${id}/`)).data;
export const updateOBDCommunicationTime = async (id: number | string) =>
  (await api.post(`/api/fleet/obd-devices/${id}/update-communication/`)).data;

/** =========================
 *  Fleet — Telemetry
 *  ========================= */
export const listOBDTelemetry = async (params: Record<string, any> = {}) =>
  (await api.get("/api/fleet/obd-telemetry/", { params })).data;
export const getOBDTelemetry = async (id: number | string) =>
  (await api.get(`/api/fleet/obd-telemetry/${id}/`)).data;
// optional convenience if your backend supports them:
export const getDeviceMetrics = async (id: number | string) => {
  try { return (await api.get(`/api/fleet/obd-devices/${id}/metrics/`)).data; } catch { return null; }
};
export const getDeviceLocation = async (id: number | string) => {
  try { return (await api.get(`/api/fleet/obd-devices/${id}/location/`)).data; } catch { return null; }
};

/** =========================
 *  Fleet — Alerts & Rules
 *  ========================= */
export const listAlerts = async (params: Record<string, any> = {}) =>
  (await api.get("/api/fleet/alerts/", { params })).data;
export const getAlert = async (id: number | string) =>
  (await api.get(`/api/fleet/alerts/${id}/`)).data;
export const listAlertRules = async (params: Record<string, any> = {}) =>
  (await api.get("/api/fleet/alert-rules/", { params })).data;
export const getAlertRule = async (id: number | string) =>
  (await api.get(`/api/fleet/alert-rules/${id}/`)).data;
export const createAlertRule = async (payload: any) =>
  (await api.post("/api/fleet/alert-rules/", payload)).data;
export const updateAlertRule = async (id: number | string, payload: any) =>
  (await api.patch(`/api/fleet/alert-rules/${id}/`, payload, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })).data;
export const deleteAlertRule = async (id: number | string) =>
  (await api.delete(`/api/fleet/alert-rules/${id}/`)).data;
export const enableAlertRule = async (id: number | string) =>
  (await api.post(`/api/fleet/alert-rules/${id}/enable/`)).data;
export const disableAlertRule = async (id: number | string) =>
  (await api.post(`/api/fleet/alert-rules/${id}/disable/`)).data;
export const getVehicleTypeAlertRules = async (vehicleTypeId: number | string) =>
  (await api.get(`/api/fleet/vehicle-types/${vehicleTypeId}/alert-rules/`)).data;

/** =========================
 *  Fleet — Dashboard / Analytics / History
 *  ========================= */
export const getFleetSummary = async () =>
  (await api.get("/api/fleet/dashboard/summary/")).data;
export const getDashboardSummary = async () =>
  (await api.get("/api/fleet/dashboard/summary/")).data;
export const getFleetAnalytics = async (params: Record<string, any> = {}) =>
  (await api.get("/api/fleet/analytics/", { params })).data;
export const getVehicleTelemetryTrends = async (
  vehiclePk: number | string, params: Record<string, any> = {}
) => (await api.get(`/api/fleet/history/vehicle/${vehiclePk}/`, { params })).data;

// optional helper your Analytics page uses (safe fallbacks)
export const getAnalytics = async () => {
  const [summaryRes, obdRes] = await Promise.all([
    api.get("/api/fleet/dashboard/summary/"),
    api.get("/api/fleet/obd-devices/"),
  ]);
  const d = summaryRes.data || {};
  const obd = obdRes.data?.results || [];
  const socTrend = obd.map((dev: any, i: number) => ({
    time: dev?.last_communication_at
      ? new Date(dev.last_communication_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : `T${i}`,
    soc: d?.average_battery_level ?? 0,
  }));
  const efficiencyByVehicle = obd.map((dev: any) => ({
    vehicle: dev?.device_id || `Vehicle-${dev?.id ?? "?"}`,
    efficiency: d?.obd_metrics?.average_estimated_range_km ?? 0,
  }));
  return {
    totalDistance: d?.total_distance_travelled_km ?? 0,
    energyConsumed: 0,
    avgEfficiency: 0,
    uptime: d?.online_vehicles ?? 0,
    socTrend,
    efficiencyByVehicle,
    alerts: [
      { name: "Critical Alerts", value: d?.critical_alerts ?? 0, color: "#ef4444" },
      { name: "Maintenance", value: d?.open_maintenance ?? 0, color: "#f97316" },
      { name: "Device Critical", value: d?.diagnostics?.device_health?.critical ?? 0, color: "#eab308" },
      { name: "Other", value: d?.diagnostics?.device_health?.normal ?? 0, color: "#6b7280" },
    ],
    metrics: {
      avgSpeed: d?.obd_metrics?.average_speed_kph ?? 0,
      maxSpeed: 0,
      totalChargingSessions: d?.obd_metrics?.vehicles_reporting_errors ?? 0,
      regenEnergy: 0,
    },
  };
};

/** ===========================================================
 *  Vehicle Types — rock-solid create & update (fixes 415 & 400)
 *  =========================================================== */

/* Encoders */
function encFormUrl(payload: Record<string, any>): URLSearchParams {
  const p = new URLSearchParams();
  Object.entries(payload || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null) p.append(k, String(v));
  });
  return p;
}
function encFormData(payload: Record<string, any>): FormData {
  const fd = new FormData();
  Object.entries(payload || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v as any);
  });
  return fd;
}

/** Keep only likely server fields to avoid 400 from unknown keys */
function normalizeVehicleTypePayload(input: any) {
  const out: any = {};
  if (input?.name != null) out.name = String(input.name).trim();
  if (input?.description != null) out.description = String(input.description);
  // Many DRF setups require one of these codes/slug fields — include if present
  if (input?.slug != null) out.slug = String(input.slug).trim();
  if (input?.code != null) out.code = String(input.code).trim();
  return out;
}

/** low-level multi-try writer */
async function tryWriteVehicleType(
  mode: "create" | "update",
  idOrNull: number | string | null,
  rawPayload: any
) {
  const urlBase = "/api/fleet/vehicle-types/";
  const url = mode === "create" ? urlBase : `${urlBase}${idOrNull}/`;
  const payload = normalizeVehicleTypePayload(rawPayload);
  const nonEmpty = Object.keys(payload).length ? payload : { name: "Untitled" };

  const doPOST = (data: any, headers: any, target = url) =>
    api.post(target, data, { headers });
  const doPATCH = (data: any, headers: any, target = url) =>
    api.patch(target, data, { headers });
  const doPUT = (data: any, headers: any, target = url) =>
    api.put(target, data, { headers });

  // 1) JSON (PATCH for update, POST for create)
  try {
    const fn = mode === "create" ? doPOST : doPATCH;
    return (await fn(nonEmpty, { "Content-Type": "application/json", Accept: "application/json" })).data;
  } catch (e: any) {
    const s = e?.response?.status;
    if (s && s !== 415 && s !== 405) throw prettyApiError(e); // 400s bubble with details
    // 405 → method not allowed: some backends only accept PUT
  }

  // 2) JSON with PUT (for update paths that disallow PATCH)
  if (mode === "update") {
    try {
      return (await doPUT(nonEmpty, { "Content-Type": "application/json", Accept: "application/json" })).data;
    } catch (e: any) {
      const s = e?.response?.status;
      if (s && s !== 415) throw prettyApiError(e);
    }
  }

  // 3) x-www-form-urlencoded
  try {
    const fn = mode === "create" ? doPOST : doPATCH;
    return (await fn(encFormUrl(nonEmpty), {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    })).data;
  } catch (e: any) {
    const s = e?.response?.status;
    if (s && s !== 415 && s !== 405) throw prettyApiError(e);
  }

  // 4) JSON at ".json" URL (DRF format suffix)
  try {
    const target = url.endsWith("/") ? url.slice(0, -1) + ".json" : url + ".json";
    const fn = mode === "create" ? doPOST : doPATCH;
    return (await fn(nonEmpty, { "Content-Type": "application/json", Accept: "application/json" }, target)).data;
  } catch (e: any) {
    const s = e?.response?.status;
    if (s && s !== 415 && s !== 405) throw prettyApiError(e);
  }

  // 5) multipart/form-data
  const fd = encFormData(nonEmpty);
  const fn = mode === "create" ? doPOST : doPATCH;
  return (await fn(fd, { "Content-Type": "multipart/form-data", Accept: "application/json" })).data;
}

function prettyApiError(e: any): Error {
  const detail =
    e?.response?.data?.message ||
    e?.response?.data?.detail ||
    (typeof e?.response?.data === "string" ? e.response.data : "") ||
    JSON.stringify(e?.response?.data || {}, null, 2) ||
    e?.message ||
    "Request failed";
  return new Error(detail);
}

/** Public Vehicle Type API */
export const listVehicleTypes = async (params: Record<string, any> = {}) =>
  (await api.get("/api/fleet/vehicle-types/", { params })).data;

export const getVehicleType = async (id: number | string) =>
  (await api.get(`/api/fleet/vehicle-types/${id}/`)).data;

export const createVehicleType = async (payload: any) =>
  tryWriteVehicleType("create", null, payload);

export const updateVehicleType = async (id: number | string, payload: any) =>
  tryWriteVehicleType("update", id, payload);

export const deleteVehicleType = async (id: number | string) =>
  (await api.delete(`/api/fleet/vehicle-types/${id}/`)).data;

/** =========================
 *  Fleet — Vehicles
 *  ========================= */
export const listVehicles = async (params: Record<string, any> = {}) =>
  (await api.get("/api/fleet/vehicles/", { params })).data;
export const getVehicle = async (id: number | string) =>
  (await api.get(`/api/fleet/vehicles/${id}/`)).data;
export const createVehicle = async (payload: any) =>
  (await api.post("/api/fleet/vehicles/", payload)).data;
export const updateVehicle = async (id: number | string, payload: any) =>
  (await api.patch(`/api/fleet/vehicles/${id}/`, payload, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })).data;
export const deleteVehicle = async (id: number | string) =>
  (await api.delete(`/api/fleet/vehicles/${id}/`)).data;

/** =========================
 *  Connectivity — SIMs
 *  ========================= */
export const listSIMCards = async (params: Record<string, any> = {}) =>
  (await api.get("/api/fleet/sims/", { params })).data;
export const createSIM = async (payload: {
  iccid: string;
  plan_name: string;
  plan_data_limit_gb: number;
  plan_cost: string;              // change to number if your API expects numeric
  current_cycle_start: string;    // "YYYY-MM-DD"
  status?: string;
}) => (await api.post("/api/fleet/sims/", payload)).data;

/** =========================
 *  Firmware Updates
 *  ========================= */
export const listFirmwareUpdates = async (params: Record<string, any> = {}) =>
  (await api.get("/api/fleet/firmware-updates/", { params })).data;
export const getFirmwareUpdate = async (pk: number | string) =>
  (await api.get(`/api/fleet/firmware-updates/${pk}/`)).data;
export const createFirmwareUpdate = async (payload: any) =>
  (await api.post("/api/fleet/firmware-updates/", payload)).data;
export const updateFirmwareUpdate = async (pk: number | string, payload: any) =>
  (await api.patch(`/api/fleet/firmware-updates/${pk}/`, payload, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })).data;
export const deleteFirmwareUpdate = async (pk: number | string) =>
  (await api.delete(`/api/fleet/firmware-updates/${pk}/`)).data;
export const pauseFirmwareUpdate = async (pk: number | string) =>
  (await api.post(`/api/fleet/firmware-updates/${pk}/pause/`)).data;
export const resumeFirmwareUpdate = async (pk: number | string) =>
  (await api.post(`/api/fleet/firmware-updates/${pk}/resume/`)).data;
export const getFirmwareUpdateSummary = async (pk: number | string) =>
  (await api.get(`/api/fleet/firmware-updates/${pk}/summary/`)).data;

/** =========================
 *  Fleet Settings
 *  ========================= */
export const getFleetSettings = async () =>
  (await api.get("/api/fleet/fleet-settings/")).data;
export const patchFleetSettings = async (payload: any) =>
  (await api.patch(`/api/fleet/fleet-settings/`, payload, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })).data;

/** =========================
 *  Upload Video (Cloud Dashcam)
 *  ========================= */
export const uploadFleetVideo = async (file: File, extra: Record<string, any> = {}) => {
  const form = new FormData();
  form.append("file", file);
  Object.entries(extra).forEach(([k, v]) => form.append(k, String(v)));
  const r = await api.post("/api/fleet/upload-video/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return r.data;
};

/** =========================
 *  Fleet Operators
 *  ========================= */
export const listFleetOperators = async (params: Record<string, any> = {}) =>
  (await api.get("/api/fleet/fleet-operators/", { params })).data;
export const getFleetOperator = async (pk: number | string) =>
  (await api.get(`/api/fleet/fleet-operators/${pk}/`)).data;
export const createFleetOperator = async (payload: any) =>
  (await api.post("/api/fleet/fleet-operators/", payload)).data;
export const updateFleetOperator = async (pk: number | string, payload: any) =>
  (await api.patch(`/api/fleet/fleet-operators/${pk}/`, payload, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })).data;
export const deleteFleetOperator = async (pk: number | string) =>
  (await api.delete(`/api/fleet/fleet-operators/${pk}/`)).data;

/** =========================
 *  Drivers
 *  ========================= */
export const listDrivers = async (params: Record<string, any> = {}) =>
  (await api.get("/api/fleet/drivers/", { params })).data;
export const getDriver = async (pk: number | string) =>
  (await api.get(`/api/fleet/drivers/${pk}/`)).data;
export const createDriver = async (payload: any) =>
  (await api.post("/api/fleet/drivers/", payload)).data;
export const updateDriver = async (pk: number | string, payload: any) =>
  (await api.patch(`/api/fleet/drivers/${pk}/`, payload, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })).data;
export const deleteDriver = async (pk: number | string) =>
  (await api.delete(`/api/fleet/drivers/${pk}/`)).data;
export const getDriverDashboardStats = async (params: Record<string, any> = {}) =>
  (await api.get("/api/fleet/drivers/dashboard_stats/", { params })).data;
export const exportDriversCSV = async (params: Record<string, any> = {}) => {
  const r = await api.get("/api/fleet/drivers/export_drivers_csv/", {
    params,
    responseType: "blob",
  });
  return r.data; // Blob
};

/** =========================
 *  Generic helpers
 *  ========================= */
export const getRequest = async (url: string, params: any = {}) =>
  (await api.get(url, { params })).data;
export const postRequest = async (url: string, data: any = {}) =>
  (await api.post(url, data)).data;

export default api;
