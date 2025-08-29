
export const getLocation = async () => {
    const response = await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${os.getenv('API_KEY')}`)
    
    
}