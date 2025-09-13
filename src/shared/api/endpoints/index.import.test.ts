import * as endpoints from './index'

describe('endpoints barrel', () => {
    it('exports expected endpoint groups', () => {
        expect(Object.keys(endpoints).length).toBeGreaterThan(0)
    })
})
