import axios, {AxiosError, AxiosResponse} from"axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

const sleep = () => new Promise(reslove => setTimeout(reslove, 500));

axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true;

const responseBody = (reponse: AxiosResponse) => reponse.data;

axios.interceptors.response.use(async response => {
    await sleep();
    return response;
}, (error: AxiosError) => {
    const { data, status} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (data.errors) {
                const modelStateErrors: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 500:
            router.navigate('/server-error', {state: {error: data}});
            break;
        default:
            break;

    }
    return Promise.reject(error.response)
})

// function responseBodyFn(response: AxiosResponse) {
//     return response.data;
// }

const requests = {
    get:(url: string) => axios.get(url).then(responseBody),
    post:(url: string, body: {}) => axios.post(url, body).then(responseBody),
    put:(url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete:(url: string) => axios.delete(url).then(responseBody)
}

const Catalog = {
    list: () => requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`)
}

const TestErrors = {
    Get400Error: () => requests.get('buggy/bad-request'),
    Get401Error: () => requests.get('buggy/unauthorized'),
    Get404Error: () => requests.get('buggy/not-found'),
    Get500Error: () => requests.get('buggy/server-error'),
    GetValidationError: () => requests.get('buggy/validation-error'),
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const agent = {
    Catalog,
    TestErrors,
    Basket
}

export default agent;