import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AppState,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { reconcile, listenForNotifications } from "../services/background";
import { initialState, reduce, type State, type Action } from "./model";
import { loadSnapshot, saveSnapshot } from "./repository";
import { errorMessage } from "../services/errors";
import type { MonitoringStatus } from "../services/monitoring";
import { prepareDeviceContext } from "../services/context-runtime";
import { publishSavedWidgets } from "../services/widgets";
import { contextKey } from "../services/outing-policy";
const Context = createContext<{
  state: State;
  dispatch: (action: Action) => Promise<boolean>;
  saveError: string | null;
  integrationError: string | null;
  monitoringStatus: MonitoringStatus | null;
  contextBusy: boolean;
  refreshContext: () => Promise<void>;
  reloadSavedState: () => Promise<void>;
  widgetError: string | null;
  widgetLastSync: number | null;
  refreshWidgets: () => Promise<void>;
} | null>(null);
export function PreparationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [saveError, setError] = useState<string | null>(null);
  const queue = useRef(Promise.resolve());
  const integrationQueue = useRef(Promise.resolve());
  const stateRef = useRef(state);
  const [contextBusy, setContextBusy] = useState(false);
  const [refreshEpoch, setRefreshEpoch] = useState(0);
  const contextRequest = useRef(0);
  const widgetRequest = useRef(0);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const [widgetLastSync, setWidgetLastSync] = useState<number | null>(null);
  const refreshWidgets = useCallback(async () => {
    const request = ++widgetRequest.current;
    const result = await publishSavedWidgets();
    if (request !== widgetRequest.current) return;
    setWidgetError(result.error);
    setWidgetLastSync(result.updatedAt);
  }, []);
  useEffect(() => { if (ready) void refreshWidgets(); }, [ready, state, refreshWidgets]);
  const [integrationResult, setIntegrationResult] = useState<{
    state: State;
    error: string | null;
    monitoring: MonitoringStatus | null;
  } | null>(null);
  const currentResult = integrationResult?.state === state ? integrationResult : null;
  const integrationError = currentResult?.error ?? null;
  const monitoringStatus = currentResult?.monitoring ?? null;
  async function hydrate() {
    try {
      const saved = await loadSnapshot();
      const next = saved?.state ?? initialState();
      stateRef.current = next;
      setState(next);
      setReady(true);
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }
  useEffect(() => {
    queue.current = queue.current.then(hydrate);
    const subscription = AppState.addEventListener("change", (s) => {
      if (s === "active") {
        queue.current = queue.current.then(hydrate);
        setRefreshEpoch(x => x + 1);
      }
    });
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (ready) {
      integrationQueue.current = integrationQueue.current
        .then(async () => {
          const current = stateRef.current;
          try {
            const status = await reconcile(current);
            if (stateRef.current !== current) return;
            setIntegrationResult({ state: current, monitoring: status, error: null });
          } catch (e) {
            if (stateRef.current === current)
              setIntegrationResult({ state: current, monitoring: null, error: errorMessage(e) });
          }
        });
    }
  }, [state, ready]);
  useEffect(
    () =>
      listenForNotifications((planId, outing = false) => {
        queue.current = queue.current
          .then(async () => {
            const saved = await loadSnapshot();
            if (saved) {
              const next = { ...saved.state, demo: false };
              await saveSnapshot(
                { ...saved, state: next, revision: saved.revision + 1 },
                saved.revision,
              );
              stateRef.current = next;
              setState(next);
            }
            if (outing) router.push({ pathname: "/reminder", params: { outingId: planId } });
            else router.push({ pathname: "/checklist", params: { planId } });
          })
          .catch((e) => setError(String(e)));
      }),
    [],
  );
  const dispatch = useCallback((action: Action) => {
    let applied = false;
    queue.current = queue.current.then(async () => {
      try {
        const current = await loadSnapshot();
        const next = reduce(current?.state ?? stateRef.current, action);
        await saveSnapshot(
          { version: 3, revision: (current?.revision ?? 0) + 1, state: next },
          current?.revision ?? 0,
        );
        stateRef.current = next;
        setState(next);
        setError(null);
        applied = true;
      } catch (e) {
        setError(`Could not save. Your change was not applied. ${String(e)}`);
      }
    });
    return queue.current.then(() => applied);
  }, []);
  const reloadSavedState = useCallback(async () => {
    queue.current = queue.current.then(async () => {
      try {
        const saved = await loadSnapshot();
        if (saved) { stateRef.current = saved.state; setState(saved.state); }
      } catch (error) { setError(`Could not reload saved records. ${String(error)}`); }
    });
    await queue.current;
  }, []);
  const refreshContext = useCallback(async () => {
    const snapshot = stateRef.current;
    if (!snapshot.outing.onboardingComplete || snapshot.demo) return;
    const request = ++contextRequest.current;
    setContextBusy(true);
    try {
      const context = await prepareDeviceContext(snapshot);
      if (request === contextRequest.current && contextKey(stateRef.current) === context.inputKey)
        await dispatch({ type: "outingContext", context });
    } finally { if (request === contextRequest.current) setContextBusy(false); }
  }, [dispatch]);
  const inputKey = contextKey(state);
  useEffect(() => {
    if (ready && state.outing.onboardingComplete && !state.demo) void refreshContext();
  }, [ready, inputKey, state.outing.onboardingComplete, state.demo, refreshEpoch, refreshContext]);
  useEffect(() => {
    if (!ready || !state.outing.onboardingComplete || state.demo) return;
    const timer = setInterval(() => {
      if (AppState.currentState === "active") void refreshContext();
    }, 15 * 60000);
    return () => clearInterval(timer);
  }, [ready, state.outing.onboardingComplete, state.demo, refreshContext]);
  if (!ready)
    return (
      <View style={{ flex: 1, padding: 32, justifyContent: "center" }}>
        {saveError ? (
          <>
            <Text>{saveError}</Text>
            <Pressable onPress={() => void hydrate()}>
              <Text>Retry loading saved data</Text>
            </Pressable>
          </>
        ) : (
          <ActivityIndicator accessibilityLabel="Loading saved preparation" />
        )}
      </View>
    );
  return (
    <Context.Provider value={{ state, dispatch, saveError, integrationError, monitoringStatus, contextBusy, refreshContext, reloadSavedState, widgetError, widgetLastSync, refreshWidgets }}>
      {children}
    </Context.Provider>
  );
}
export function usePreparation() {
  const value = useContext(Context);
  if (!value) throw new Error("PreparationProvider is missing");
  return value;
}
