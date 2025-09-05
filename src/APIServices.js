
export const getLocation = async () => {
    const response = await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${os.getenv('API_KEY')}`)
    
    const data = await response.json()

    console.log(data)
    
    return data
}