import {
  createFileRoute,
  useLocation,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import CarbonPedestrian from '~icons/carbon/pedestrian'

export const Route = createFileRoute('/hi/$name')({
  component: Hi,
})

function Hi() {
  const { name } = Route.useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const router = useRouter()

  return (
    <div>
      <CarbonPedestrian className="inline-block text-4xl" />
      <p>Hi, {name}</p>
      <p className="text-sm opacity-50">
        <em>Dynamic route!</em>
      </p>

      <button
        className="m-3 mt-8 btn text-sm"
        onClick={() => {
          if (location.state.from === '/') {
            router.history.back()
          } else {
            navigate({ to: '/' })
          }
        }}
      >
        Back
      </button>
    </div>
  )
}
