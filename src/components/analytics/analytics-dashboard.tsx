'use client'

import React, { useMemo } from 'react'
import { Task } from '@/types/kanban'
import { generateAnalyticsData } from '@/lib/analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Target,
  Zap,
  Calendar,
  Tag
} from 'lucide-react'

interface AnalyticsDashboardProps {
  tasks: Task[]
}

const COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  success: 'hsl(142.1 76.2% 36.3%)',
  warning: 'hsl(47.9 95.8% 53.1%)',
  danger: 'hsl(0 84.2% 60.2%)',
  chart1: 'hsl(var(--chart-1))',
  chart2: 'hsl(var(--chart-2))',
  chart3: 'hsl(var(--chart-3))',
  chart4: 'hsl(var(--chart-4))',
  chart5: 'hsl(var(--chart-5))',
}

const PRIORITY_COLORS = {
  high: COLORS.danger,
  medium: COLORS.warning,
  low: COLORS.success
}

const STATUS_COLORS = {
  new: COLORS.chart1,
  learning: COLORS.chart5,
  completed: COLORS.chart3
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

function MetricCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  color = 'primary'
}: {
  title: string
  value: string | number
  description?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: 'up' | 'down' | 'neutral'
  color?: string
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null

  return (
    <motion.div {...fadeInUp}>
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 text-muted-foreground`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <div className="flex items-center gap-1 mt-1">
              {TrendIcon && (
                <TrendIcon 
                  className={`h-3 w-3 ${
                    trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`} 
                />
              )}
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          )}
        </CardContent>
        <div 
          className="absolute inset-x-0 bottom-0 h-1"
          style={{ backgroundColor: COLORS[color as keyof typeof COLORS] || color }}
        />
      </Card>
    </motion.div>
  )
}

export function AnalyticsDashboard({ tasks }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => generateAnalyticsData(tasks), [tasks])

  const productivityTrend = analytics.productivityScore > 75 ? 'up' : 
                           analytics.productivityScore < 50 ? 'down' : 'neutral'

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Track your productivity and task completion metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Tasks"
          value={analytics.stats.total}
          description={`${analytics.stats.new} new tasks`}
          icon={Activity}
          color="chart1"
        />
        <MetricCard
          title="Completion Rate"
          value={`${analytics.stats.completionRate.toFixed(1)}%`}
          description={`${analytics.stats.completed} completed`}
          icon={CheckCircle2}
          trend={analytics.stats.completionRate > 70 ? 'up' : 'down'}
          color="chart3"
        />
        <MetricCard
          title="Productivity Score"
          value={analytics.productivityScore}
          description="Last 30 days"
          icon={Zap}
          trend={productivityTrend}
          color="chart5"
        />
        <MetricCard
          title="Overdue Tasks"
          value={analytics.stats.overdueTasks}
          description={analytics.stats.overdueTasks > 0 ? "Needs attention" : "All on track"}
          icon={AlertCircle}
          color={analytics.stats.overdueTasks > 0 ? "danger" : "success"}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Completion Trends */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Completion Trends</CardTitle>
              <CardDescription>Daily task creation and completion</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.completionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="created" 
                    stackId="1"
                    stroke={COLORS.chart1} 
                    fill={COLORS.chart1}
                    fillOpacity={0.6}
                    name="Created"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stackId="1"
                    stroke={COLORS.chart3} 
                    fill={COLORS.chart3}
                    fillOpacity={0.6}
                    name="Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
              <CardDescription>Tasks by priority level</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'High', value: analytics.priorityDistribution.high },
                      { name: 'Medium', value: analytics.priorityDistribution.medium },
                      { name: 'Low', value: analytics.priorityDistribution.low }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill={PRIORITY_COLORS.high} />
                    <Cell fill={PRIORITY_COLORS.medium} />
                    <Cell fill={PRIORITY_COLORS.low} />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Task Status */}
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Task Status</CardTitle>
              <CardDescription>Current distribution of tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { status: 'New', count: analytics.tasksByStatus.new },
                    { status: 'Learning', count: analytics.tasksByStatus.learning },
                    { status: 'Completed', count: analytics.tasksByStatus.completed }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    <Cell fill={STATUS_COLORS.new} />
                    <Cell fill={STATUS_COLORS.learning} />
                    <Cell fill={STATUS_COLORS.completed} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Time Analysis */}
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Time Tracking</CardTitle>
              <CardDescription>Tasks with most time spent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.timeAnalysis.slice(0, 5).map((task, index) => (
                  <div key={task.taskId} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(task.timeSpent / 60)}h {task.timeSpent % 60}m
                        </span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full border"
                          style={{ 
                            borderColor: STATUS_COLORS[task.status],
                            color: STATUS_COLORS[task.status]
                          }}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={(task.timeSpent / analytics.timeAnalysis[0].timeSpent) * 100} 
                      className="w-20 h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Tags */}
      <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Top Tags</CardTitle>
            <CardDescription>Most used tags and their completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {analytics.topTags.slice(0, 9).map((tag) => (
                <div key={tag.tag} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{tag.tag}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{tag.count} tasks</div>
                    <div className="text-xs text-muted-foreground">
                      {tag.completionRate.toFixed(0)}% complete
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Stats */}
      <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
            <CardDescription>Key insights about your task management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Avg. Completion Time</span>
                </div>
                <p className="text-2xl font-bold">
                  {analytics.stats.averageTimeToComplete.toFixed(1)} days
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tasks per Day</span>
                </div>
                <p className="text-2xl font-bold">
                  {analytics.averageTasksPerDay.toFixed(1)}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">In Progress</span>
                </div>
                <p className="text-2xl font-bold">
                  {analytics.stats.inProgress}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Time Tracked</span>
                </div>
                <p className="text-2xl font-bold">
                  {Math.floor(tasks.reduce((sum, t) => sum + t.timeSpent, 0) / 60)}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}