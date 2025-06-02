import { supabaseKey, supabaseUrl } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';
import RNFS from 'react-native-fs';

global.Buffer = global.Buffer || Buffer;
// ✅ Custom AsyncStorage adapter for React Native
// const AsyncStorageAdapter = {
//   getItem: async (key) => {
//     return await AsyncStorage.getItem(key);
//   },
//   setItem: async (key, value) => {
//     await AsyncStorage.setItem(key, value);
//   },
//   removeItem: async (key) => {
//     await AsyncStorage.removeItem(key);
//   },
// };
const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// export const refreshSupabaseToken = () => {
//   supabase.auth.getSession().then(({ data, error }) => {
//     if (data?.session) {
//       console.log('✅ Session restored:', data.session);
//     } else {
//       console.log('🟡 No session or error:', error);
//     }
//   });
// }

// Authentication functions
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signIn({ email, password });
  if (error) throw error;
  return data;
};

export const signUp = async (email, password) => {
  const redirectTo = 'keepr://app/auth-callback?action=confirm_signup';
  const { user, error } = await supabase.auth.signUp({ email, password }, {
    redirectTo,
  });
  console.log('checking signup response', user, error)
  if (error) throw error;
  if (user?.identities?.length === 0) {
    throw new Error('This email is already registered. Kindly log in or sign up using a different email address.');
  }
  return user;
};

export const forgotPassword = async (email) => {
  const redirectTo = 'keepr://app/auth-callback?action=reset';
  const { data, error } = await supabase.auth.api.resetPasswordForEmail(email, {
    redirectTo,
  });
  console.log('forgotPassword', data, error)
  if (error) throw error;
  return data;
};

export const setSession = async (access_token, refresh_token) => {
  try {
    console.log('recoverSession');
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);
    console.log('Calling supabase.auth.setSession...');

    const { data, error } = await supabase.auth.setSession({
      refresh_token,
      access_token,
    });

    console.log('After setSession', data, error);

    if (error) {
      console.log('Supabase setSession error:', error.message);
      throw error;
    }

    return data;
  } catch (err) {
    console.log('setSession threw an exception:', err.message);
    throw err;
  }
};

export const updatePassword = async (newPassword) => {
  const session = supabase.auth.session(); // Get the current session
  if (!session) {
    throw new Error('User is not authenticated');
  }

  const { access_token } = session; // Access the token from the session
  if (!access_token) {
    throw new Error('Access token is not available');
  }

  const { data, error } = await supabase.auth.api.updateUser(
    access_token, // Provide the Bearer token
    {
      password: newPassword,
    }
  );

  if (error) throw error;
  return data;
};

export const updateCurrentPassword = async (email, currentPassword, newPassword) => {
  // const session = supabase.auth.session(); // Get the current session
  // if (!session) {
  //   throw new Error('User is not authenticated');
  // }

  // const { access_token } = session; // Access the token from the session
  // if (!access_token) {
  //   throw new Error('Access token is not available');
  // }
  const { data: userData, error: loginError } = await supabase.auth.signIn(email, currentPassword);
  if (loginError) throw new Error('Current password is invalid');
  const { data, error } = await supabase.auth.api.updateUser(
    // access_token, // Provide the Bearer token
    {
      password: newPassword,
    }
  );

  if (error) throw error;
  return data;
};

// Image upload function
export const uploadAvatarToSupabase = async (uri) => {
  try {
    const fileName = `avatars/${Date.now()}.jpg`;
    let filePath = uri;
    let contentType = 'image/jpeg';

    // Normalize content URI (Android)
    if (Platform.OS === 'android' && uri.startsWith('content://')) {
      // You might need a library like `react-native-get-real-path` for this case
      throw new Error('content:// URIs need real path resolution on Android');
    }

    // Handle file URIs or raw paths
    if (!uri.startsWith('file://')) {
      filePath = 'file://' + uri;
    }
    // } else if (uri.startsWith('http')) {
    //   // Remote image URL
    //   const response = await fetch(uri);
    //   const blob = await response.blob();
    //   const arrayBuffer = await blob.arrayBuffer();
    //   fileBuffer = new Uint8Array(arrayBuffer);
    //   contentType = blob.type || 'image/jpeg';
    // } else {
    //   throw new Error('Unsupported image URI type');
    // }


    const base64 = await RNFS.readFile(filePath, 'base64');
    const fileBuffer = Buffer.from(base64, 'base64');
    // Upload image to Supabase storage
    const { error, data } = await supabase.storage
      .from('profile-pic') // Replace with your bucket name
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: true,
      });

    console.log('uploadddddd', error, data)
    if (error) throw error;

    // Get the public URL of the uploaded image
    const { publicURL } = supabase.storage
      .from('profile-pic')
      .getPublicUrl(fileName).data;

    return { path: data?.path, publicURL };
  } catch (err) {
    // console.error('Upload failed:', err.message);
    throw err;
  }
};

export const insertAvatarToProfile = async ({ id, email, avatar_url }) => {
  console.log('Insert Params:', id, email, avatar_url);

  const { data, error } = await supabase
    .from('profiles')
    .upsert([{ id, email, avatar_url }]);

  if (error) {
    console.error('Supabase Insert Error:', error.message, error.details);
    throw new Error(error.message || 'Insert failed');
  }

  return data;
};

export const logoutSupabase = async () => {
  let { error } = await supabase.auth.signOut()
  if (error) throw error;
}
