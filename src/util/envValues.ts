interface EnvValueType {
    apiUrl : string
    googleClientId : string
    googleClientSecret : string
}

export const envValues : EnvValueType = {
    apiUrl : process.env.NEXT_PUBLIC_API_BASE_URL || "",
    googleClientId : process.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret : process.env.GOOGLE_CLIENT_SECRET || "",

}