export interface FirebaseUser {
    displayName: string | null;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    metadata: {
        creationTime: number;
        lastSignInTime: number;
    };
    multiFactor: {
        enrolledFactors: EnrolledFactors[];
    };
    phoneNumber: string | null;
    photoURL: string | null;
    providerData: ProviderData[];
    providerId: string;
    tenantId?: string | null;
    uid: string;
}

interface ProviderData {
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    providerId: string;
    uid: string;
}

interface EnrolledFactors {
    displayName: string | null;
    enrollmentTime: number;
    factorId: string;
    phoneNumber: string | null;
    uid: string;
}
