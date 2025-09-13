import { render, screen } from '@testing-library/react'
import { Button } from '../button'
import { Card, CardHeader, CardTitle, CardContent } from '../card'
import { Badge } from '../badge'
import React from 'react'

describe('UI primitives', () => {
    test('Button renders with text and loading state', () => {
        const { rerender } = render(<Button>Click</Button>)
        expect(screen.getByRole('button', { name: /click/i })).toBeInTheDocument()
        rerender(<Button loading>Click</Button>)
        expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    })

    test('Card structural subcomponents render', () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle data-testid="title">Title</CardTitle>
                </CardHeader>
                <CardContent>Body</CardContent>
            </Card>
        )
        expect(screen.getByTestId('title')).toHaveTextContent('Title')
    })

    test('Badge variants render', () => {
        const { rerender } = render(<Badge>Default</Badge>)
        expect(screen.getByText(/default/i)).toBeInTheDocument()
        rerender(<Badge variant="solid">Solid</Badge>)
        expect(screen.getByText(/solid/i)).toBeInTheDocument()
    })
})
