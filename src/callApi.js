import request from 'superagent';
// import config from '../config';

// if (typeof(config.app.baseUrl) === 'undefined') {
//     config.app.baseUrl = '';
// }


const callApi = (verb, endpoint, data, filekey, file) => {
    const API_URL = 'https://touchingloop.eu-gb.mybluemix.net/api/';
    const TOKEN = localStorage.getItem('access_token');
    let url;

    if (!endpoint.match(/http/)) {
        url = API_URL + endpoint;
    } else {
        url = endpoint;
    }

    const errorMessage = document.getElementById('app__server-error');

    const hideErrorMessage = () => {
        errorMessage.className = 'app__server-error';
    };

    const showErrorMessage = () => {
        errorMessage.className += ' app__server-error--show';
    };

    const handleApiError = () => {
        if (document.getElementsByClassName('app__server-error--show').length === 0) {
            showErrorMessage();
        }
    };

    const processApiResponse = (resolve, reject) => (error, response) => {
        if (response) {
            if (error) {
                if (response.body.error.http_code >= 500) {
                    handleApiError(response.body.error);
                }
                reject(response.body.error);
            } else {
                if (document.getElementsByClassName('app__server-error--show').length) {
                    hideErrorMessage();
                }
                resolve(response);
            }
        } else {
            handleApiError();
        }
    };

    const apiRequest = () => {
        switch (verb) {
        case 'GET':
            return request.get(url).query(data);

        case 'POST':
            return request.post(url).send(data);

        case 'PUT':
            return request.put(url).send(data);

        case 'DELETE':
            return request.delete(url);
        }
    };

    if (filekey) {
        return new Promise((resolve, reject) => {
            //Need to build request manually as attach is not combatiable with send (send will overwrite attatchment)
            request
                .post(url)
                .accept('application/json')
                .set('Authorization', 'Bearer ' + TOKEN)
                .withCredentials()
                .query(data)
                .timeout(60000)
                .attach(filekey, file) //Attach sends GET but APi will recieve still
                .end(processApiResponse(resolve, reject));
        });

    } else {
        return new Promise((resolve, reject) => {
            apiRequest()
                .set('Authorization', 'Bearer ' + TOKEN)
                .withCredentials()
                .timeout(20000)
                .end(processApiResponse(resolve, reject));
        });
    }
};

export default callApi;
