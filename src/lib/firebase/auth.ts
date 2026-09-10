/**
 * BINSIGHT — FIREBASE AUTHENTICATION
 * --------------------------------------------------------------------------
 * Firebase Authentication service layer.
 *
 * Responsibilities:
 * - Email/password sign-in
 * - Email/password sign-up
 * - Sign-out
 * - Password reset
 * - Password update
 * - Email verification
 * - Current-user access
 * - Auth-state subscription
 * - Authentication error normalization
 *
 * Architecture:
 * - Firebase Auth only
 * - No role / permission logic here
 * - No Firestore profile logic here
 * - No UI concerns here
 *
 * Authentication answers:
 *   "Who is this user?"
 *
 * Authorization belongs elsewhere:
 *   src/lib/auth/roles.ts
 *   src/lib/auth/guards.ts
 *   Firebase Security Rules
 * --------------------------------------------------------------------------
 */

import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  type User,
  type UserCredential,
} from "firebase/auth";

import { firebaseAuth } from "@lib/firebase/config";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type AuthPersistence =
  | "local"
  | "session"
  | "none";

export interface SignInOptions {
  email: string;
  password: string;
  persistence?: AuthPersistence;
}

export interface SignUpOptions {
  email: string;
  password: string;
  displayName?: string;
  sendVerificationEmail?: boolean;
  persistence?: AuthPersistence;
}

export interface UpdateProfileOptions {
  displayName?: string;
  photoURL?: string;
}

export interface ReauthenticateOptions {
  email: string;
  password: string;
}

export interface AuthError {
  code: string;
  message: string;
  originalCode?: string;
}

export type AuthResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: AuthError;
    };

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_PERSISTENCE: AuthPersistence =
  "local";

const MIN_PASSWORD_LENGTH = 6;

/**
 * Stable application-level messages for Firebase Auth errors.
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email":
    "Format email tidak valid.",

  "auth/user-disabled":
    "Akun ini telah dinonaktifkan.",

  "auth/user-not-found":
    "Akun dengan email tersebut tidak ditemukan.",

  "auth/wrong-password":
    "Email atau password salah.",

  "auth/invalid-credential":
    "Email atau password salah.",

  "auth/email-already-in-use":
    "Email tersebut sudah digunakan.",

  "auth/weak-password":
    "Password terlalu lemah.",

  "auth/operation-not-allowed":
    "Metode autentikasi ini belum diaktifkan.",

  "auth/network-request-failed":
    "Koneksi jaringan bermasalah. Silakan coba lagi.",

  "auth/too-many-requests":
    "Terlalu banyak percobaan. Silakan coba kembali nanti.",

  "auth/requires-recent-login":
    "Silakan login kembali untuk melakukan tindakan ini.",

  "auth/user-mismatch":
    "Kredensial tidak cocok dengan pengguna saat ini.",

  "auth/credential-already-in-use":
    "Kredensial tersebut sudah digunakan oleh akun lain.",

  "auth/provider-already-linked":
    "Metode autentikasi tersebut sudah terhubung.",

  "auth/no-such-provider":
    "Metode autentikasi tidak tersedia untuk akun ini.",

  "auth/expired-action-code":
    "Tautan autentikasi sudah kedaluwarsa.",

  "auth/invalid-action-code":
    "Tautan autentikasi tidak valid.",

  "auth/action-code-expired":
    "Kode tindakan sudah kedaluwarsa.",

  "auth/session-cookie-revoked":
    "Sesi telah dicabut. Silakan login kembali.",

  "auth/app-deleted":
    "Konfigurasi aplikasi Firebase tidak tersedia.",

  "auth/unauthorized-domain":
    "Domain aplikasi belum diizinkan oleh Firebase Authentication.",

  "auth/unsupported-first-factor":
    "Metode autentikasi utama ini tidak didukung.",

  "auth/rejected-credential":
    "Kredensial autentikasi ditolak.",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const normalizeEmail = (
  email: string
): string => {
  return email.trim().toLowerCase();
};

const isValidEmail = (
  email: string
): boolean => {
  const normalized =
    normalizeEmail(email);

  if (!normalized) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    normalized
  );
};

const validatePassword = (
  password: string
): boolean => {
  return (
    password.length >=
    MIN_PASSWORD_LENGTH
  );
};

const normalizeAuthError = (
  error: unknown
): AuthError => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const firebaseError =
      error as {
        code?: unknown;
        message?: unknown;
      };

    const rawCode =
      typeof firebaseError.code === "string"
        ? firebaseError.code
        : "auth/unknown";

    return {
      code: rawCode.replace(
        /^auth\//,
        ""
      ),
      message:
        AUTH_ERROR_MESSAGES[rawCode] ??
        "Terjadi kesalahan autentikasi. Silakan coba lagi.",
      originalCode: rawCode,
    };
  }

  if (error instanceof Error) {
    return {
      code: "unknown",
      message:
        error.message ||
        "Terjadi kesalahan autentikasi.",
    };
  }

  return {
    code: "unknown",
    message:
      "Terjadi kesalahan autentikasi. Silakan coba lagi.",
  };
};

const safeAuthCall = async <T>(
  operation: () => Promise<T>
): Promise<AuthResult<T>> => {
  try {
    return {
      success: true,
      data: await operation(),
    };
  } catch (error) {
    return {
      success: false,
      error: normalizeAuthError(error),
    };
  }
};

/* -------------------------------------------------------------------------- */
/* Persistence                                                                */
/* -------------------------------------------------------------------------- */

const applyPersistence = async (
  persistence: AuthPersistence
): Promise<void> => {
  switch (persistence) {
    case "session":
      await setPersistence(
        firebaseAuth,
        browserSessionPersistence
      );
      return;

    case "local":
      await setPersistence(
        firebaseAuth,
        browserLocalPersistence
      );
      return;

    case "none":
      /**
       * No explicit persistence is applied here.
       *
       * This option is retained at the public API level for forward
       * compatibility, but BINSIGHT currently standardizes on local
       * and session persistence.
       */
      return;

    default:
      return;
  }
};

/* -------------------------------------------------------------------------- */
/* Current User                                                               */
/* -------------------------------------------------------------------------- */

export const getCurrentUser = (): User | null => {
  return firebaseAuth.currentUser;
};

export const isAuthenticated = (): boolean => {
  return firebaseAuth.currentUser !== null;
};

export const getCurrentUserId =
  (): string | null => {
    return (
      firebaseAuth.currentUser?.uid ??
      null
    );
  };

export const getCurrentUserEmail =
  (): string | null => {
    return (
      firebaseAuth.currentUser?.email ??
      null
    );
  };

export const getCurrentUserDisplayName =
  (): string | null => {
    return (
      firebaseAuth.currentUser
        ?.displayName ?? null
    );
  };

export const isEmailVerified =
  (): boolean => {
    return (
      firebaseAuth.currentUser
        ?.emailVerified ?? false
    );
  };

/* -------------------------------------------------------------------------- */
/* Token                                                                      */
/* -------------------------------------------------------------------------- */

export const getCurrentUserToken =
  async (
    forceRefresh = false
  ): Promise<AuthResult<string>> => {
    const user =
      firebaseAuth.currentUser;

    if (!user) {
      return {
        success: false,
        error: {
          code: "not-authenticated",
          message:
            "Pengguna belum terautentikasi.",
        },
      };
    }

    return safeAuthCall(() =>
      user.getIdToken(forceRefresh)
    );
  };

/* -------------------------------------------------------------------------- */
/* Claims                                                                     */
/* -------------------------------------------------------------------------- */

export const getCurrentUserClaims =
  async (): Promise<
    AuthResult<Record<string, unknown>>
  > => {
    const user =
      firebaseAuth.currentUser;

    if (!user) {
      return {
        success: false,
        error: {
          code: "not-authenticated",
          message:
            "Pengguna belum terautentikasi.",
        },
      };
    }

    const result =
      await safeAuthCall(() =>
        user.getIdTokenResult()
      );

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: {
        ...result.data.claims,
      },
    };
  };

/* -------------------------------------------------------------------------- */
/* Sign In                                                                    */
/* -------------------------------------------------------------------------- */

export const signIn = async (
  options: SignInOptions
): Promise<AuthResult<UserCredential>> => {
  const email =
    normalizeEmail(options.email);

  if (!isValidEmail(email)) {
    return {
      success: false,
      error: {
        code: "invalid-email",
        message:
          "Format email tidak valid.",
      },
    };
  }

  if (!options.password) {
    return {
      success: false,
      error: {
        code: "invalid-password",
        message:
          "Password wajib diisi.",
      },
    };
  }

  return safeAuthCall(async () => {
    await applyPersistence(
      options.persistence ??
        DEFAULT_PERSISTENCE
    );

    return signInWithEmailAndPassword(
      firebaseAuth,
      email,
      options.password
    );
  });
};

/* -------------------------------------------------------------------------- */
/* Sign Up                                                                    */
/* -------------------------------------------------------------------------- */

export const signUp = async (
  options: SignUpOptions
): Promise<AuthResult<UserCredential>> => {
  const email =
    normalizeEmail(options.email);

  if (!isValidEmail(email)) {
    return {
      success: false,
      error: {
        code: "invalid-email",
        message:
          "Format email tidak valid.",
      },
    };
  }

  if (!options.password) {
    return {
      success: false,
      error: {
        code: "invalid-password",
        message:
          "Password wajib diisi.",
      },
    };
  }

  if (
    !validatePassword(
      options.password
    )
  ) {
    return {
      success: false,
      error: {
        code: "weak-password",
        message:
          `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`,
      },
    };
  }

  return safeAuthCall(async () => {
    await applyPersistence(
      options.persistence ??
        DEFAULT_PERSISTENCE
    );

    const credential =
      await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        options.password
      );

    const displayName =
      options.displayName?.trim();

    if (displayName) {
      await updateProfile(
        credential.user,
        {
          displayName,
        }
      );
    }

    if (
      options.sendVerificationEmail !==
      false
    ) {
      await sendEmailVerification(
        credential.user
      );
    }

    return credential;
  });
};

/* -------------------------------------------------------------------------- */
/* Sign Out                                                                   */
/* -------------------------------------------------------------------------- */

export const logout =
  async (): Promise<
    AuthResult<void>
  > => {
    return safeAuthCall(() =>
      signOut(firebaseAuth)
    );
  };

export const signOutUser =
  logout;

/* -------------------------------------------------------------------------- */
/* Email Verification                                                         */
/* -------------------------------------------------------------------------- */

export const sendVerificationEmail =
  async (): Promise<
    AuthResult<void>
  > => {
    const user =
      firebaseAuth.currentUser;

    if (!user) {
      return {
        success: false,
        error: {
          code: "not-authenticated",
          message:
            "Pengguna belum terautentikasi.",
        },
      };
    }

    return safeAuthCall(() =>
      sendEmailVerification(user)
    );
  };

/* -------------------------------------------------------------------------- */
/* Password Reset                                                             */
/* -------------------------------------------------------------------------- */

export const resetPassword = async (
  email: string
): Promise<AuthResult<void>> => {
  const normalizedEmail =
    normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    return {
      success: false,
      error: {
        code: "invalid-email",
        message:
          "Format email tidak valid.",
      },
    };
  }

  return safeAuthCall(() =>
    sendPasswordResetEmail(
      firebaseAuth,
      normalizedEmail
    )
  );
};

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

export const updateUserProfile =
  async (
    options: UpdateProfileOptions
  ): Promise<AuthResult<void>> => {
    const user =
      firebaseAuth.currentUser;

    if (!user) {
      return {
        success: false,
        error: {
          code: "not-authenticated",
          message:
            "Pengguna belum terautentikasi.",
        },
      };
    }

    const displayName =
      options.displayName?.trim() ||
      undefined;

    const photoURL =
      options.photoURL?.trim() ||
      undefined;

    if (
      displayName === undefined &&
      photoURL === undefined
    ) {
      return {
        success: false,
        error: {
          code: "nothing-to-update",
          message:
            "Tidak ada informasi profil yang perlu diperbarui.",
        },
      };
    }

    return safeAuthCall(() =>
      updateProfile(user, {
        displayName,
        photoURL,
      })
    );
  };

/* -------------------------------------------------------------------------- */
/* Reauthentication                                                           */
/* -------------------------------------------------------------------------- */

export const reauthenticate =
  async (
    options: ReauthenticateOptions
  ): Promise<AuthResult<UserCredential>> => {
    const user =
      firebaseAuth.currentUser;

    if (!user) {
      return {
        success: false,
        error: {
          code: "not-authenticated",
          message:
            "Pengguna belum terautentikasi.",
        },
      };
    }

    const email =
      normalizeEmail(options.email);

    if (!isValidEmail(email)) {
      return {
        success: false,
        error: {
          code: "invalid-email",
          message:
            "Format email tidak valid.",
        },
      };
    }

    if (!options.password) {
      return {
        success: false,
        error: {
          code: "invalid-password",
          message:
            "Password wajib diisi.",
        },
      };
    }

    return safeAuthCall(() => {
      const credential =
        EmailAuthProvider.credential(
          email,
          options.password
        );

      return reauthenticateWithCredential(
        user,
        credential
      );
    });
  };

/* -------------------------------------------------------------------------- */
/* Password Update                                                            */
/* -------------------------------------------------------------------------- */

export const changePassword =
  async (
    newPassword: string
  ): Promise<AuthResult<void>> => {
    const user =
      firebaseAuth.currentUser;

    if (!user) {
      return {
        success: false,
        error: {
          code: "not-authenticated",
          message:
            "Pengguna belum terautentikasi.",
        },
      };
    }

    if (!newPassword) {
      return {
        success: false,
        error: {
          code: "invalid-password",
          message:
            "Password baru wajib diisi.",
        },
      };
    }

    if (
      !validatePassword(newPassword)
    ) {
      return {
        success: false,
        error: {
          code: "weak-password",
          message:
            `Password minimal ${MIN_PASSWORD_LENGTH} karakter.`,
        },
      };
    }

    return safeAuthCall(() =>
      updatePassword(
        user,
        newPassword
      )
    );
  };

/* -------------------------------------------------------------------------- */
/* Delete Account                                                             */
/* -------------------------------------------------------------------------- */

export const deleteCurrentUser =
  async (): Promise<
    AuthResult<void>
  > => {
    const user =
      firebaseAuth.currentUser;

    if (!user) {
      return {
        success: false,
        error: {
          code: "not-authenticated",
          message:
            "Pengguna belum terautentikasi.",
        },
      };
    }

    return safeAuthCall(() =>
      deleteUser(user)
    );
  };

/* -------------------------------------------------------------------------- */
/* Auth State                                                                 */
/* -------------------------------------------------------------------------- */

export const subscribeToAuthState = (
  callback: (
    user: User | null
  ) => void
) => {
  return onAuthStateChanged(
    firebaseAuth,
    callback
  );
};

/**
 * Resolves once Firebase has determined the initial auth state.
 */
export const waitForAuthState =
  async (): Promise<User | null> => {
    return new Promise(
      (resolve) => {
        let unsubscribe:
          | (() => void)
          | null = null;

        unsubscribe =
          onAuthStateChanged(
            firebaseAuth,
            (user) => {
              if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
              }

              resolve(user);
            }
          );
      }
    );
  };

/* -------------------------------------------------------------------------- */
/* Refresh                                                                    */
/* -------------------------------------------------------------------------- */

export const refreshCurrentUser =
  async (): Promise<
    AuthResult<User>
  > => {
    const user =
      firebaseAuth.currentUser;

    if (!user) {
      return {
        success: false,
        error: {
          code: "not-authenticated",
          message:
            "Pengguna belum terautentikasi.",
        },
      };
    }

    return safeAuthCall(async () => {
      await user.reload();

      const refreshedUser =
        firebaseAuth.currentUser;

      if (!refreshedUser) {
        throw new Error(
          "Pengguna tidak lagi tersedia setelah refresh."
        );
      }

      return refreshedUser;
    });
  };

/* -------------------------------------------------------------------------- */
/* Default Service                                                            */
/* -------------------------------------------------------------------------- */

const authService = Object.freeze({
  getCurrentUser,
  getCurrentUserToken,
  getCurrentUserClaims,

  getCurrentUserId,
  getCurrentUserEmail,
  getCurrentUserDisplayName,
  isAuthenticated,
  isEmailVerified,

  signIn,
  signUp,

  logout,
  signOutUser,

  sendVerificationEmail,
  resetPassword,

  updateUserProfile,
  reauthenticate,
  changePassword,
  deleteCurrentUser,

  refreshCurrentUser,

  subscribeToAuthState,
  waitForAuthState,
});

export default authService;