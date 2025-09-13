import { buildQuery } from './buildQuery'
import { fileApi } from './endpoints/file'
import { needApi } from './endpoints/need'
import api from './client'

jest.mock('axios', () => {
    const inst = {
        interceptors: { response: { use: () => { } } },
        post: jest.fn(),
        get: jest.fn()
    }
    return { create: jest.fn(() => inst) }
})

describe('buildQuery', () => {
    it('builds query skipping empty, undefined, and null values; stringifies arrays/objects', () => {
        const qs = buildQuery({ a: 1, b: '', c: undefined, d: null, e: [1, 2], f: { x: true }, g: 'hi' })
        expect(qs.startsWith('?')).toBe(true)
        expect(qs).toContain('a=1')
        expect(qs).not.toContain('b=')
        expect(qs).toContain('e=%5B1%2C2%5D') // encoded JSON
        expect(qs).toContain('f=%7B%22x%22%3Atrue')
        expect(qs).toContain('g=hi')
    })
    it('returns empty string when no valid params', () => {
        expect(buildQuery({ a: undefined, b: null, c: '', d: [] })).toBe('')
    })
})

// Cast api to mocked type for convenience
const mockedApi = api as unknown as { post: jest.Mock; get: jest.Mock }

describe('fileApi.upload', () => {
    beforeEach(() => mockedApi.post.mockReset())
    it('sends multipart form and reports progress', async () => {
        const progress: number[] = []
        mockedApi.post.mockImplementation((_url, _form, config) => {
            // simulate progress
            config.onUploadProgress({ loaded: 50, total: 100 })
            config.onUploadProgress({ loaded: 100, total: 100 })
            return Promise.resolve({ file_url: '/f', filename: 'a.txt', size: 10 })
        })
        const fakeFile = new File([new Uint8Array([1, 2, 3])], 'a.txt')
        const res = await fileApi.upload({ file: fakeFile, attach_to_doctype: 'Doc', attach_to_name: 'X', onProgress: p => progress.push(p) })
        expect(res.filename).toBe('a.txt')
        expect(progress).toEqual([50, 100])
        expect(mockedApi.post.mock.calls[0][0]).toBe('.as_api.file_api.upload_file')
    })
    it('propagates error', async () => {
        const err = new Error('upload fail')
        mockedApi.post.mockRejectedValueOnce(err)
        const fakeFile = new File([new Uint8Array([1])], 'b.txt')
        await expect(fileApi.upload({ file: fakeFile })).rejects.toThrow('upload fail')
    })
})

describe('needApi', () => {
    beforeEach(() => { mockedApi.post.mockReset(); mockedApi.get.mockReset() })
    it('creates need', async () => {
        mockedApi.post.mockResolvedValueOnce({ id: 'N1', title: 'Water', description: 'Bottled', status: 'Open' })
        const res = await needApi.create({ title: 'Water' })
        expect(res.id).toBe('N1')
        expect(mockedApi.post).toHaveBeenCalledWith('.as_api.need_api.create_need', { title: 'Water' })
    })
    it('updates need merges id', async () => {
        mockedApi.post.mockResolvedValueOnce({ id: 'N1', title: 'Updated', description: 'Bottled', status: 'Open' })
        const res = await needApi.update('N1', { title: 'Updated' })
        expect(res.title).toBe('Updated')
        expect(mockedApi.post).toHaveBeenCalledWith('.as_api.need_api.update_need', { id: 'N1', title: 'Updated' })
    })
    it('lists needs by filters building params', async () => {
        mockedApi.get.mockResolvedValueOnce([])
        await needApi.listByFilters({ status: 'Open', category: 'Health' })
        const called = mockedApi.get.mock.calls[0][0]
        expect(called).toContain('.as_api.need_api.get_needs_by_filters?')
        expect(called).toContain('status=Open')
        expect(called).toContain('category=Health')
    })
    it('propagates error on create', async () => {
        const err = new Error('create fail')
        mockedApi.post.mockRejectedValueOnce(err)
        await expect(needApi.create({ title: 'X' })).rejects.toThrow('create fail')
    })
})
