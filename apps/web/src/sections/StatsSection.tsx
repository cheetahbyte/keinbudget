import { Breakdown, type BreakdownItem } from "#/components/Breakdown"

interface StatSectionProps {
  dailyCost: number
  avgPerSub: number
  breakdownStats: BreakdownItem[]
}

interface SmallCardProps {
  title: string
  value: string
  text: string
}

function SmallCard({ title, value, text }: SmallCardProps) {
  return (
    <div className="hidden min-h-36 flex-col justify-center rounded-xl border border-border bg-card/50 p-7 lg:flex">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>

      <h2 className="mt-3 font-mono text-3xl tracking-tight text-foreground">
        {value}
        <span className="ml-1 text-base text-muted-foreground">EUR</span>
      </h2>

      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export function StatsSection({
  dailyCost,
  avgPerSub: _avgPerSub,
  breakdownStats,
}: StatSectionProps) {
  const monthlyCost = dailyCost * 30
  const yearlyCost = dailyCost * 365

  const donerPrice = 8
  const coffeePrice = 4

  const monthlyDoner = monthlyCost / donerPrice
  const yearlyDoner = yearlyCost / donerPrice
  const dailyCoffee = dailyCost / coffeePrice

  return (
    <div className="flex flex-col gap-8">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Monthly Spending
          </p>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-7xl font-light tracking-tight text-foreground">
              {Math.floor(monthlyCost)}
            </span>
            <span className="font-mono text-3xl text-muted-foreground">
              .{monthlyCost.toFixed(2).split(".")[1]}
            </span>
            <span className="text-xl text-muted-foreground">EUR</span>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            That&apos;s{" "}
            <span className="mr-1 text-primary">
              {monthlyDoner.toFixed(1)} burger
            </span>
            per month you&apos;re not eating
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SmallCard
            title="Yearly"
            value={yearlyCost.toFixed(2)}
            text={`${yearlyDoner.toFixed(0)} burger per year`}
          />

          <SmallCard
            title="Daily"
            value={dailyCost.toFixed(2)}
            text={`${dailyCoffee.toFixed(1)} coffees per day`}
          />
        </div>
      </div>

      <Breakdown items={breakdownStats} />
    </div>
  )
}
