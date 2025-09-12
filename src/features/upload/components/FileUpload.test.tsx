import { render, screen } from '@testing-library/react'
import { FileUpload } from './FileUpload'

describe('FileUpload component', () => {
    it('renders heading and drop zone', () => {
        render(<FileUpload />)
        expect(screen.getByText(/Upload Files/i)).toBeInTheDocument()
        expect(screen.getByText(/Drag & drop files/i)).toBeInTheDocument()
    })
})
