/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo, use } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Application } from "@/types/application"

interface DynamicStackedBarChartProps {
  applicationsPromise: Promise<Application[] | null>
}

function DynamicStackedBarChart({
  applicationsPromise,
}: DynamicStackedBarChartProps) {
  const rawData = use(applicationsPromise)
  const [focoBarra, setFocoBarra] = useState<string | null>(null)

  const chartsByGoal = useMemo(() => {
    const agrupado: Record<
      string,
      { dadosPorData: Record<string, any>; tiposEntrada: Set<string> }
    > = {}
    rawData?.forEach((item) => {
      const meta = item.goal_name
      if (!agrupado[meta]) {
        agrupado[meta] = { dadosPorData: {}, tiposEntrada: new Set() }
      }
      const data = new Date(item.created_at).toISOString().split("T")[0]
      if (!agrupado[meta].dadosPorData[data]) {
        agrupado[meta].dadosPorData[data] = { data }
      }
      Object.entries(item.inputs).forEach(([tipoEntrada, valor]) => {
        if (tipoEntrada !== "Observações" && tipoEntrada !== "IND") {
          agrupado[meta].tiposEntrada.add(tipoEntrada)
          agrupado[meta].dadosPorData[data][tipoEntrada] =
            (agrupado[meta].dadosPorData[data][tipoEntrada] || 0) +
            (typeof valor === "number" ? valor : 0)
        }
      })
    })
    return Object.entries(agrupado).map(
      ([meta, { dadosPorData, tiposEntrada }]) => ({
        meta,
        chartData: Object.values(dadosPorData).sort((a, b) =>
          a.data.localeCompare(b.data)
        ),
        tiposEntrada: Array.from(tiposEntrada),
      })
    )
  }, [rawData])

  const chartConfigs = useMemo(() => {
    const configs: Record<
      string,
      Record<string, { label: string; color: string }>
    > = {}
    chartsByGoal.forEach(({ meta, tiposEntrada }) => {
      const configMeta: Record<string, { label: string; color: string }> = {}
      tiposEntrada.forEach((tipo, idx) => {
        configMeta[tipo] = {
          label: tipo,
          color: `hsl(${(idx * 360) / tiposEntrada.length}, 70%, 50%)`,
        }
      })
      configs[meta] = configMeta
    })
    return configs
  }, [chartsByGoal])

  const formatDate = (data: string) => {
    const [ano, mes, dia] = data.split("-")
    return `${dia}/${mes}/${ano}`
  }

  return (
    <div className="space-y-8">
      {chartsByGoal.map(({ meta, chartData, tiposEntrada }) => (
        <Card key={meta} className="w-full max-w-6xl">
          <CardHeader>
            <CardTitle>{`Meta: ${meta}`}</CardTitle>
            <CardDescription>{`Gráfico de barras empilhadas para a meta ${meta}`}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigs[meta]} className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="data"
                    tickFormatter={(valor) => formatDate(valor)}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {tiposEntrada.map((tipo) => (
                    <Bar
                      key={tipo}
                      dataKey={tipo}
                      stackId="stack"
                      onMouseEnter={() => setFocoBarra(tipo)}
                      onMouseLeave={() => setFocoBarra(null)}
                      opacity={focoBarra && focoBarra !== tipo ? 0.3 : 1}
                      fill={chartConfigs[meta][tipo].color}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export { DynamicStackedBarChart }
