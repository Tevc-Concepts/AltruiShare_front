"use client"
import { useImpactAnalytics } from '../hooks/useImpactAnalytics'
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/ui/card'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { Button } from '../../../shared/ui/button'

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B']

export function ImpactDashboard() {
    const { data, loading, error, refetch } = useImpactAnalytics(60_000)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-brand-hero">Impact Analytics</h1>
                <Button size="sm" onClick={refetch} disabled={loading}>Refresh</Button>
            </div>
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            {loading && !data && <p className="text-sm">Loading analytics...</p>}
            {data && (
                <>
                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <KpiCard title="Donations" value={data.kpi.total_donations.toLocaleString()} />
                        <KpiCard title="Active Needs" value={data.kpi.active_needs.toLocaleString()} />
                        <KpiCard title="Fulfilled Needs" value={data.kpi.fulfilled_needs.toLocaleString()} />
                        <KpiCard title="Volunteers" value={data.kpi.volunteers.toLocaleString()} />
                        <KpiCard title="Impact Score" value={data.kpi.impact_score.toFixed(1)} />
                    </section>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-2">
                            <CardHeader><CardTitle>Donations Timeline</CardTitle></CardHeader>
                            <CardContent className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.timeline} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorDon" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6} />
                                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip contentStyle={{ fontSize: 12 }} />
                                        <Area type="monotone" dataKey="donations" stroke="#6366F1" fillOpacity={1} fill="url(#colorDon)" />
                                        <Area type="monotone" dataKey="items" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorItems)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
                            <CardContent className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={data.categories} dataKey="amount" nameKey="category" outerRadius={90} innerRadius={40} paddingAngle={2}>
                                            {data.categories.map((entry, idx) => <Cell key={entry.category} fill={COLORS[idx % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ fontSize: 12 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <ul className="mt-4 grid grid-cols-2 gap-2 text-xs">
                                    {data.categories.map((c, idx) => (
                                        <li key={c.category} className="flex items-center gap-2">
                                            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: COLORS[idx % COLORS.length] }} />
                                            <span className="truncate" title={c.category}>{c.category}</span>
                                            <span className="ml-auto font-medium">{c.amount.toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    )
}

function KpiCard({ title, value }: { title: string; value: string }) {
    return (
        <Card>
            <CardHeader className="py-3"><CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{title}</CardTitle></CardHeader>
            <CardContent className="pt-0 pb-4"><p className="text-xl font-semibold tracking-tight">{value}</p></CardContent>
        </Card>
    )
}
