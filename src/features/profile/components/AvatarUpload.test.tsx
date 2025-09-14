import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../test/utils/renderWithProviders'
import { ProfileForm } from './ProfileForm'

jest.mock('../../../shared/api/endpoints/file', () => ({
    fileApi: {
        upload: jest.fn()
    }
}))

jest.mock('../../../shared/api/endpoints/user', () => {
    return {
        userApi: {
            updateProfile: jest.fn(),
            getProfile: jest.fn()
        }
    }
})

import { fileApi } from '../../../shared/api/endpoints/file'
import { userApi } from '../../../shared/api/endpoints/user'

describe('AvatarUpload within ProfileForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
            ; (userApi.updateProfile as jest.Mock).mockResolvedValue({})
    })

    it('uploads avatar and triggers profile update', async () => {
        ; (fileApi.upload as jest.Mock).mockImplementation(async () => {
            return { file_url: '/files/avatar123.png', filename: 'avatar.png', size: 1234 }
        })

        renderWithProviders(<ProfileForm onUpdated={() => { }} />, { user: { id: 'u1', email: 'user@test', name: 'Test User' } })

        // Find file input (hidden) via label
        const changeBtn = screen.getByText(/Change Avatar/i)
        const input = changeBtn.closest('label')?.querySelector('input[type="file"]') as HTMLInputElement
        expect(input).toBeTruthy()

        const file = new File(['data'], 'avatar.png', { type: 'image/png' })
        fireEvent.change(input, { target: { files: [file] } })

        await waitFor(() => expect(fileApi.upload).toHaveBeenCalled())
        await waitFor(() => expect(userApi.updateProfile).toHaveBeenCalledWith({ avatar_url: '/files/avatar123.png' }))
    })

    it('shows progress bar during upload', async () => {
        let progressCb: ((p: number) => void) | undefined
            ; (fileApi.upload as jest.Mock).mockImplementation(async (opts: { onProgress?: (p: number) => void }) => {
                progressCb = opts?.onProgress
                // simulate progress steps
                progressCb?.(10)
                progressCb?.(55)
                progressCb?.(100)
                return { file_url: '/files/done.png', filename: 'done.png', size: 200 }
            })

        renderWithProviders(<ProfileForm />, { user: { id: 'u2', email: 'user2@test' } })
        const input = screen.getByText(/Change Avatar/i).closest('label')!.querySelector('input[type="file"]') as HTMLInputElement
        fireEvent.change(input, { target: { files: [new File(['x'], 'done.png', { type: 'image/png' })] } })

        // Wait for a progress indicator to appear (tabular-nums span) with 100%
        await waitFor(() => expect(screen.getByText(/100%/)).toBeInTheDocument())
    })
})
