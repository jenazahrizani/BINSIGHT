/**
 * BINSIGHT — FIREBASE CONFIG
 * --------------------------------------------------------------------------
 * Central Firebase Web SDK configuration.
 *
 * Responsibilities:
 * - Read public Firebase configuration from Astro environment variables
 * - Validate required configuration
 * - Initialize Firebase exactly once
 * - Export Firebase app + commonly used SDK instances
 *
 * Security:
 * - Firebase Web config is NOT a secret.
 * - Never put Firebase Admin SDK credentials here.
 * - Never put service-account private keys in PUBLIC_* variables.
 * - Authorization is enforced by Firebase Security Rules and application auth.
 *
 * Environment:
 * - PUBLIC_FIREBASE_API_KEY
 * - PUBLIC_FIREBASE_AUTH_DOMAIN
 * - PUBLIC_FIREBASE_PROJECT_ID
 * - PUBLIC_FIREBASE_STORAGE_BUCKET
 * - PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 * - PUBLIC_FIREBASE_APP_ID
 * - PUBLIC_FIREBASE_MEASUREMENT_ID (optional)
 * --------------------------------------------------------------------------
 */

import {
  getApps,
  getApp,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";

import {
  getAnalytics,
  isSupported as analyticsIsSupported,
  type Analytics,
} from "firebase/analytics";

import {
  getAuth,
  type Auth,
} from "firebase/auth";

import {
  getFirestore,
  type Firestore,
} from "firebase/firestore";

import {
  getStorage,
  type FirebaseStorage,
} from "firebase/storage";

interface FirebaseEnvironment {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const environment = import.meta.env;

const requiredEnvironmentVariables = {
  PUBLIC_FIREBASE_API_KEY:
    environment.PUBLIC_FIREBASE_API_KEY,

  PUBLIC_FIREBASE_AUTH_DOMAIN:
    environment.PUBLIC_FIREBASE_AUTH_DOMAIN,

  PUBLIC_FIREBASE_PROJECT_ID:
    environment.PUBLIC_FIREBASE_PROJECT_ID,

  PUBLIC_FIREBASE_STORAGE_BUCKET:
    environment.PUBLIC_FIREBASE_STORAGE_BUCKET,

  PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    environment.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

  PUBLIC_FIREBASE_APP_ID:
    environment.PUBLIC_FIREBASE_APP_ID,
} as const;

const missingVariables = Object.entries(
  requiredEnvironmentVariables
)
  .filter(
    ([, value]) =>
      typeof value !== "string" ||
      value.trim().length === 0
  )
  .map(([name]) => name);

/**
 * Firebase configuration is intentionally validated
 * lazily when this module is evaluated.
 *
 * During local development, a clear error is preferable
 * to a much harder-to-diagnose Firebase initialization error.
 */
if (missingVariables.length > 0) {
  throw new Error(
    [
      "BINSIGHT Firebase configuration is incomplete.",
      "",
      "Missing environment variables:",
      ...missingVariables.map(
        (variable) => `- ${variable}`
      ),
      "",
      "Copy .env.example to .env and fill in the Firebase Web App configuration.",
    ].join("\n")
  );
}

const firebaseEnvironment: FirebaseEnvironment = {
  apiKey:
    requiredEnvironmentVariables
      .PUBLIC_FIREBASE_API_KEY
      .trim(),

  authDomain:
    requiredEnvironmentVariables
      .PUBLIC_FIREBASE_AUTH_DOMAIN
      .trim(),

  projectId:
    requiredEnvironmentVariables
      .PUBLIC_FIREBASE_PROJECT_ID
      .trim(),

  storageBucket:
    requiredEnvironmentVariables
      .PUBLIC_FIREBASE_STORAGE_BUCKET
      .trim(),

  messagingSenderId:
    requiredEnvironmentVariables
      .PUBLIC_FIREBASE_MESSAGING_SENDER_ID
      .trim(),

  appId:
    requiredEnvironmentVariables
      .PUBLIC_FIREBASE_APP_ID
      .trim(),

  ...(environment.PUBLIC_FIREBASE_MEASUREMENT_ID?.trim()
    ? {
        measurementId:
          environment.PUBLIC_FIREBASE_MEASUREMENT_ID.trim(),
      }
    : {}),
};

const firebaseConfig: FirebaseOptions = {
  apiKey: firebaseEnvironment.apiKey,
  authDomain: firebaseEnvironment.authDomain,
  projectId: firebaseEnvironment.projectId,
  storageBucket:
    firebaseEnvironment.storageBucket,
  messagingSenderId:
    firebaseEnvironment.messagingSenderId,
  appId: firebaseEnvironment.appId,

  ...(firebaseEnvironment.measurementId
    ? {
        measurementId:
          firebaseEnvironment.measurementId,
      }
    : {}),
};

/**
 * Reuse the existing Firebase app during HMR.
 *
 * This prevents:
 * "Firebase App named '[DEFAULT]' already exists"
 * errors during Astro development.
 */
export const firebaseApp: FirebaseApp =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

/**
 * Core Firebase services.
 *
 * These instances are created once and reused by
 * the rest of the BINSIGHT data layer.
 */
export const firebaseAuth: Auth =
  getAuth(firebaseApp);

export const firebaseFirestore: Firestore =
  getFirestore(firebaseApp);

export const firebaseStorage: FirebaseStorage =
  getStorage(firebaseApp);

/**
 * Firebase Analytics is browser-only and may not be supported
 * in every environment.
 *
 * Keep the promise internal to this module so importing the
 * Firebase config never crashes SSR/static generation.
 */
let analyticsPromise:
  | Promise<Analytics | null>
  | undefined;

export const getFirebaseAnalytics =
  async (): Promise<Analytics | null> => {
    if (analyticsPromise) {
      return analyticsPromise;
    }

    analyticsPromise = (
      async (): Promise<Analytics | null> => {
        if (typeof window === "undefined") {
          return null;
        }

        if (!firebaseConfig.measurementId) {
          return null;
        }

        try {
          const supported =
            await analyticsIsSupported();

          if (!supported) {
            return null;
          }

          return getAnalytics(firebaseApp);
        } catch {
          /**
           * Analytics must never make the application
           * unusable. BINSIGHT remains fully functional
           * when Analytics is unavailable.
           */
          return null;
        }
      }
    )();

    return analyticsPromise;
  };

/**
 * Public read-only configuration.
 *
 * Useful for diagnostics and integrations that need
 * the Firebase project identity, without exposing any
 * server-side credential because none exists here.
 */
export const firebaseProjectId =
  firebaseEnvironment.projectId;

export const firebaseAuthDomain =
  firebaseEnvironment.authDomain;

export const firebaseStorageBucket =
  firebaseEnvironment.storageBucket;

export const firebaseConfigPublic = Object.freeze({
  apiKey: firebaseEnvironment.apiKey,
  authDomain: firebaseEnvironment.authDomain,
  projectId: firebaseEnvironment.projectId,
  storageBucket: firebaseEnvironment.storageBucket,
  messagingSenderId:
    firebaseEnvironment.messagingSenderId,
  appId: firebaseEnvironment.appId,
  ...(firebaseEnvironment.measurementId
    ? {
        measurementId:
          firebaseEnvironment.measurementId,
      }
    : {}),
});

/**
 * Convenience helper used by diagnostics / development tools.
 *
 * This intentionally returns only non-secret Firebase
 * project metadata.
 */
export const getFirebaseEnvironmentInfo = () => ({
  projectId: firebaseProjectId,
  authDomain: firebaseAuthDomain,
  storageBucket: firebaseStorageBucket,
  analyticsEnabled:
    Boolean(firebaseConfig.measurementId),
});

/**
 * Default export for consumers that only need the app.
 */
export default firebaseApp;