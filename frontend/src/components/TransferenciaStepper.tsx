import type { EstadoTransferencia } from '../types'

interface Props {
  estado: EstadoTransferencia
}

type StepStatus = 'done' | 'current' | 'partial' | 'upcoming'

const steps = ['Solicitada', 'Preparación', 'En tránsito', 'Recibida']

const estadoIndex: Record<EstadoTransferencia, number> = {
  SOLICITADA: 0,
  EN_PREPARACION: 1,
  EN_TRANSITO: 2,
  RECIBIDA_COMPLETA: 3,
  RECIBIDA_PARCIAL: 3,
}

function getStatus(index: number, currentIndex: number, esParcial: boolean): StepStatus {
  if (index < currentIndex) return 'done'
  if (index === currentIndex) {
    if (index === 3) return esParcial ? 'partial' : 'done'
    return 'current'
  }
  return 'upcoming'
}

const circleStyles: Record<StepStatus, string> = {
  done: 'bg-green-600 text-white',
  current: 'bg-primary text-white',
  partial: 'bg-amber-500 text-white',
  upcoming: 'bg-gray-200 text-text-muted',
}

export default function TransferenciaStepper({ estado }: Props) {
  const currentIndex = estadoIndex[estado]
  const esParcial = estado === 'RECIBIDA_PARCIAL'

  return (
    <div className="flex items-start">
      {steps.map((label, i) => {
        const status = getStatus(i, currentIndex, esParcial)
        const lineaCompletada = i < currentIndex

        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${circleStyles[status]}`}>
                {status === 'done' || status === 'partial' ? '✓' : i + 1}
              </div>
              <span className="mt-2 whitespace-nowrap text-xs font-medium text-text-secondary">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-2 mb-5 h-0.5 flex-1 ${lineaCompletada ? 'bg-green-600' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}