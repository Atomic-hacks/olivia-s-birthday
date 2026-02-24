export const env = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  sessionSecret: process.env.APP_SESSION_SECRET || '',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};

export const hasCloudinaryEnv =
  Boolean(env.cloudinaryCloudName) && Boolean(env.cloudinaryApiKey) && Boolean(env.cloudinaryApiSecret);

export const hasSupabaseEnv = Boolean(env.supabaseUrl) && Boolean(env.supabaseServiceRoleKey);
