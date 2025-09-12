// Firebase Authentication Functions
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import { 
    ref, 
    set, 
    get, 
    push, 
    update,
    remove 
} from "firebase/database";
import { auth, database } from "./firebase-config.js";

// Authentication functions
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Get user data from database
        const userData = await getUserData(user.uid);
        
        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                name: userData?.name || user.displayName || 'Usuário',
                ...userData
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
}

export async function registerUser(email, password, name) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update user profile
        await updateProfile(user, {
            displayName: name
        });
        
        // Save user data to database
        await saveUserData(user.uid, {
            name: name,
            email: email,
            role: 'technician',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        });
        
        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                name: name
            }
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
}

export async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: 'Erro ao fazer logout'
        };
    }
}

export function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
}

// Database functions
export async function saveUserData(uid, userData) {
    try {
        const userRef = ref(database, `users/${uid}`);
        await set(userRef, userData);
        return { success: true };
    } catch (error) {
        console.error('Save user data error:', error);
        return { success: false, error: error.message };
    }
}

export async function getUserData(uid) {
    try {
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Get user data error:', error);
        return null;
    }
}

export async function updateUserProgress(uid, progressData) {
    try {
        const progressRef = ref(database, `userProgress/${uid}`);
        await set(progressRef, progressData);
        return { success: true };
    } catch (error) {
        console.error('Update progress error:', error);
        return { success: false, error: error.message };
    }
}

export async function getUserProgress(uid) {
    try {
        const progressRef = ref(database, `userProgress/${uid}`);
        const snapshot = await get(progressRef);
        
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return {
                videosWatched: 0,
                quizzesPassed: 0,
                certificatesEarned: 0
            };
        }
    } catch (error) {
        console.error('Get progress error:', error);
        return {
            videosWatched: 0,
            quizzesPassed: 0,
            certificatesEarned: 0
        };
    }
}

export async function saveClientData(clientData) {
    try {
        const clientsRef = ref(database, 'clients');
        const newClientRef = push(clientsRef);
        await set(newClientRef, {
            ...clientData,
            id: newClientRef.key,
            createdAt: new Date().toISOString()
        });
        return { success: true, clientId: newClientRef.key };
    } catch (error) {
        console.error('Save client error:', error);
        return { success: false, error: error.message };
    }
}

export async function getClientsData() {
    try {
        const clientsRef = ref(database, 'clients');
        const snapshot = await get(clientsRef);
        
        if (snapshot.exists()) {
            const clients = [];
            snapshot.forEach((childSnapshot) => {
                clients.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            return clients;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Get clients error:', error);
        return [];
    }
}

export async function updateClientStatus(clientId, status) {
    try {
        const clientRef = ref(database, `clients/${clientId}`);
        await update(clientRef, {
            status: status,
            lastVisit: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        console.error('Update client status error:', error);
        return { success: false, error: error.message };
    }
}

// Error message helper
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/email-already-in-use': 'Este email já está em uso',
        'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
        'auth/invalid-email': 'Email inválido',
        'auth/user-disabled': 'Usuário desabilitado',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
        'auth/operation-not-allowed': 'Operação não permitida'
    };
    
    return errorMessages[errorCode] || 'Erro desconhecido. Tente novamente.';
}
