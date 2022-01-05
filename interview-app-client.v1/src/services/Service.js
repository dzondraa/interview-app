import config from '../config/config'

const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Request-Method": "*",
    "Access-Control-Request-Headers": "*"

    
}

function joinURL(baseUrl, uri) {
    return `${baseUrl}/${uri}`
}

class Api {
    constructor() {
        this.domain = config.API_URL
    }

    request(url, method="POST", data=null) {
        url = joinURL(this.domain, url)
        const options = {
            headers,
            method
        }

        if(data != null) {
            options.body = JSON.stringify(data)
        }

        console.log("opt", options )
        return fetch(url, options)
    }

    async get(url, id) {
        const method = 'GET'
        if(id) {
            url = `${url}/${id}`
        }
        const res = await this.request(url, method).then(res => res.json())
        return res;
    }

    async post(url, data) {
        const method = 'POST'    
        const res = await this.request(url, method, data).then(res => res.json())
        return res
    }
}

export default Api;