// Jest auto-mock for axios to prevent real network calls in tests
// Provides a simple programmable mock with default resolved value
interface AxiosMockInstance {
    get: jest.Mock
    post: jest.Mock
    put: jest.Mock
    delete: jest.Mock
    request: jest.Mock
    create: () => AxiosMockInstance
    interceptors: {
        response: {
            use: (onFulfilled: (value: unknown) => unknown, onRejected?: (error: unknown) => unknown) => number
        }
    }
}

// Internal holders for interceptor handlers so we can emulate axios' behavior
let successHandler: ((value: unknown) => unknown) | undefined

const baseAxiosResponse = { data: { status: 'success', data: {} } }

function runSuccess(value: unknown = baseAxiosResponse) {
    try {
        return successHandler ? successHandler(value) : value
    } catch (err) {
        return Promise.reject(err)
    }
}

// Note: error path executed by rejecting promise from handler if needed

const mockAxios: AxiosMockInstance = {
    get: jest.fn(async () => runSuccess()),
    post: jest.fn(async () => runSuccess()),
    put: jest.fn(async () => runSuccess()),
    delete: jest.fn(async () => runSuccess()),
    request: jest.fn(async () => runSuccess()),
    interceptors: {
        response: {
            use: (onFulfilled) => {
                successHandler = onFulfilled
                // we ignore error handler in mock for now; tests can simulate error by throwing in successHandler
                return 0 // id token (unused)
            }
        }
    },
    create: function () { return this }
}

export default mockAxios
