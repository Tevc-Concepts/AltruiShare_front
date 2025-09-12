import { motion } from 'framer-motion'
import type { Need } from '../../../shared/api/endpoints/need'
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/ui/card'

export function NeedCard({ need, index }: { need: Need; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
        >
            <Card className="hover:shadow-soft-lg transition-shadow">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                        <span>{need.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo capitalize">{need.status}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm line-clamp-3 mb-2 text-neutral-700 dark:text-neutral-300">{need.description}</p>
                    {need.category && <p className="text-xs text-neutral-500">Category: {need.category}</p>}
                </CardContent>
            </Card>
        </motion.div>
    )
}
