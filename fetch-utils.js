const SUPABASE_URL = 'https://tybfgetbgtrxyzothjyn.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5YmZnZXRiZ3RyeHl6b3RoanluIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ0MDY1MzAsImV4cCI6MTk3OTk4MjUzMH0.auIefiG5jH98P6Wl_NU4TKQnkJLjr_FPBd9mx7_3zWo';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Auth related functions */

export function getUser() {
    return client.auth.user();
}

export async function signUpUser(email, password) {
    return await client.auth.signUp({
        email,
        password,
    });
}

export async function signInUser(email, password) {
    return await client.auth.signIn({
        email,
        password,
    });
}

export async function signOutUser() {
    return await client.auth.signOut();
}

/* Data functions */
